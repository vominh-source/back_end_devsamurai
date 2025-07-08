import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
}

@Injectable({})
export class AuthService{
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}
    
    async signup(dto: AuthDto): Promise<TokenResponse> {
        // hash the password
        const hash = await argon.hash(dto.password);
        
        // save the new user in the database
        try{
            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hash,
                },
                select:{
                    id: true,
                    email: true,
                    createdAt: true,
                }
            })
            
            // Generate both access and refresh tokens
            const tokens = await this.generateTokens(user.id, user.email);
            
            // Save hashed refresh token to database
            await this.updateRefreshToken(user.id, tokens.refresh_token);
            
            return tokens;

        } catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }
    
    async signin(dto: AuthDto): Promise<TokenResponse> {
        // find the user by email
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email,
            },
        })
        
        if(!user){
            throw new ForbiddenException('Credentials incorrect');
        }

        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password);
        if(!pwMatches){
            throw new ForbiddenException('Credentials incorrect');
        }
        
        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        
        return tokens;
    }

    // Refresh token method
    async refreshTokens(refreshToken: string): Promise<TokenResponse> {
        // 1. Verify refresh token signature
        let payload;
        try {
            payload = await this.jwt.verifyAsync(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // 2. Find user with valid refresh token
        const user = await this.prisma.user.findFirst({
            where: {
                id: payload.sub,
                refreshToken: { not: null }, // Ensure refreshToken is not null
                refreshTokenExpiry: { gt: new Date() }, // Not expired
            },
        });

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // 3. Verify stored refresh token matches
        const refreshTokenMatches = await argon.verify(user.refreshToken, refreshToken);
        if (!refreshTokenMatches) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // 4. Generate new tokens
        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }


    // Generate both tokens
    private async generateTokens(userId: number, email: string): Promise<TokenResponse> {
        const payload = {
            sub: userId,
            email,
        };

        const [accessToken, refreshToken] = await Promise.all([
            // Access token: short-lived (15 minutes)
            this.jwt.signAsync(payload, {
                expiresIn: '15m',
                secret: this.config.get('JWT_SECRET'),
            }),
            // Refresh token: long-lived (7 days)
            this.jwt.signAsync(payload, {
                expiresIn: '7d',
                secret: this.config.get('JWT_REFRESH_SECRET'),
            }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    // Store hashed refresh token
    private async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await argon.hash(refreshToken);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken: hashedRefreshToken,
                refreshTokenExpiry: expiryDate,
            },
        });
    }
}