import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common'; // Added UseGuards
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport'; // Built-in Guard

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // TEST ROUTE: Only accessible with a valid token
  @Get('/test')
  @UseGuards(AuthGuard()) 
  testAuth(@Req() req) {
    return { 
      message: 'You are authorized!', 
      user: req.user 
    };
  }
}