import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiBody({ schema: { example: { loginId: 'test', password: '1234' } } })
  @Post('login')
  async login(@Body() body: { loginId: string; password: string }) {
    return this.authService.login(body.loginId, body.password);
  }

  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ schema: { example: { loginId: 'test', password: '1234', email: 'test@test.com' } } })
  @Post('register')
  async register(@Body() body: { loginId: string; password: string; email?: string }) {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: '이메일 인증 요청' })
  @ApiBody({ schema: { example: { email: 'test@test.com' } } })
  @Post('email/request')
  async requestEmailVerification(@Body() body: { email: string }) {
    return this.authService.requestEmailVerification(body.email);
  }

  @ApiOperation({ summary: '이메일 인증' })
  @ApiBody({ schema: { example: { email: 'test@test.com', token: '123456' } } })
  @Post('email/verify')
  async verifyEmail(@Body() body: { email: string; token: string }) {
    return this.authService.verifyEmail(body.email, body.token);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBody({ schema: { example: { refreshToken: '123456' } } })
  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) { 
    return this.authService.logout(body.refreshToken);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }
} 