import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    schema: { example: { loginId: 'user1', password: 'pw1234' } },
    description: '로그인에 필요한 아이디와 비밀번호를 입력합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공 시 accessToken 반환',
    schema: { example: { code: '0000', message: '', data: { accessToken: 'jwt.token.here' } } }
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패',
    schema: { example: { code: 'A401', message: '아이디 또는 비밀번호가 올바르지 않습니다.', data: null } }
  })
  @Post('login')
  async login(@Body() body: { loginId: string; password: string }) {
    return this.authService.login(body.loginId, body.password);
  }

  @ApiOperation({ summary: '회원가입' })
  @ApiBody({
    schema: { example: { loginId: 'user1', password: 'pw1234', email: 'user@email.com' } },
    description: '회원가입에 필요한 아이디, 비밀번호, 이메일(선택)을 입력합니다.'
  })
  @ApiResponse({
    status: 200, 
    description: '회원가입 성공',
    schema: { example: { code: '0000', message: '', data: { id: 'uuid', loginId: 'user1', email: 'user@email.com' } } }
  })
  @ApiResponse({
    status: 409,
    description: '중복된 아이디/이메일',
    schema: { example: { code: '409', message: '이미 가입된 아이디 또는 이메일입니다.', data: null } }
  })
  @Post('register')
  async register(@Body() body: { loginId: string; password: string; email?: string }) {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: '이메일 인증 요청' })
  @ApiBody({
    schema: { example: { email: 'user@email.com' } },
    description: '이메일 인증을 위한 이메일 주소를 입력합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '이메일 인증 토큰 발급',
    schema: { example: { code: '0000', message: '', data: { email: 'user@email.com', token: 'abcdef' } } }
  })
  @Post('email/request')
  async requestEmailVerification(@Body() body: { email: string }) {
    return this.authService.requestEmailVerification(body.email);
  }

  @ApiOperation({ summary: '이메일 인증 검증' })
  @ApiBody({
    schema: { example: { email: 'user@email.com', token: 'abcdef' } },
    description: '이메일과 인증 토큰을 입력합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '이메일 인증 성공',
    schema: { example: { code: '0000', message: '', data: { email: 'user@email.com', verified: true } } }
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: { example: { code: 'A401', message: '인증 토큰이 올바르지 않습니다.', data: null } }
  })
  @Post('email/verify')
  async verifyEmail(@Body() body: { email: string; token: string }) {
    return this.authService.verifyEmail(body.email, body.token);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBody({
    schema: { example: { refreshToken: '123456' } },
    description: '로그아웃 시 사용할 refreshToken을 입력합니다.'
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    schema: { example: { code: '0000', message: '', data: { success: true } } }
  })
  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    return this.authService.logout(body.refreshToken);
  }

  @ApiOperation({ summary: '토큰 리프레시' })
  @ApiBody({
    schema: { example: { refreshToken: '123456' } },
    description: 'accessToken 재발급을 위한 refreshToken을 입력합니다.'
  })
  @ApiResponse({
    status: 200,
    description: 'accessToken 재발급 성공',
    schema: { example: { code: '0000', message: '', data: { accessToken: 'jwt.token.here' } } }
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 리프레시 토큰',
    schema: { example: { code: 'A401', message: '유효하지 않은 리프레시 토큰입니다.', data: null } }
  })
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }
} 