import {PassportStrategy} from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        const secret = config.get('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        })
    }

    async validate(payload: { sub: number; email: string }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        
        return user;
    }
}