import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const emailVerificationStore = new Map<string, string>(); // email -> token

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(data: { loginId: string; password: string; email?: string }) {
    const { loginId, password, email } = data;
    const existing = await prisma.user.findFirst({
      where: { OR: [{ loginId }, { email }] },
    });
    if (existing)
      throw new ConflictException('이미 가입된 아이디 또는 이메일입니다.');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { loginId, passwordHash, email },
    });
    return { id: user.id, loginId: user.loginId, email: user.email };
  }

  async login(loginId: string, password: string) {
    const user = await prisma.user.findUnique({ where: { loginId } });
    if (!user || !user.passwordHash)
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 올바르지 않습니다.',
      );
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 올바르지 않습니다.',
      );
    const payload = { sub: user.id, loginId: user.loginId };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async requestEmailVerification(email: string) {
    // 실제 서비스에서는 이메일로 토큰을 전송해야 함
    const token = Math.random().toString(36).substring(2, 8);
    emailVerificationStore.set(email, token);
    // 테스트용: 토큰을 반환
    return { email, token };
  }

  async verifyEmail(email: string, token: string) {
    const stored = emailVerificationStore.get(email);
    if (!stored || stored !== token) {
      throw new UnauthorizedException('인증 토큰이 올바르지 않습니다.');
    }
    await prisma.user.updateMany({
      where: { email },
      data: { emailVerified: true },
    });
    emailVerificationStore.delete(email);
    return { email, verified: true };
  }

  async logout(refreshToken: string) {
    const token = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!token) return { success: true }; // 이미 없으면 성공 처리
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revoked: true },
    });
    return { success: true };
  }

  async refresh(refreshToken: string) {
    const token = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!token || token.revoked || token.expiresAt < new Date()) {
      throw new HttpException(
        { code: 'A401', message: '유효하지 않은 리프레시 토큰입니다.' },
        401,
      );
    }
    const user = await prisma.user.findUnique({ where: { id: token.userId } });
    if (!user) {
      throw new HttpException(
        { code: 'A404', message: '사용자를 찾을 수 없습니다.' },
        404,
      );
    }
    const payload = { sub: user.id, loginId: user.loginId };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
