import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post('signup')
    async signup(@Body() dto:AuthDto) {
        
        const token=await this.authService.signup(dto);
        return token;
    }

    @Post('signin')
    async signin(@Body() dto:AuthDto) {
        const token=await this.authService.signin(dto);
        console.log('Token controller:', token);
        return token;
    }
}