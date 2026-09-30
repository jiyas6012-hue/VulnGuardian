import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';

import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { RegisterDto } from './dto/register.dto.js';

interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  jti: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      email,
      passwordHash,
      name: dto.name?.trim(),
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refresh(dto: RefreshTokenDto) {
    let payload: RefreshTokenPayload;

    try {
      payload =
        await this.jwtService.verifyAsync<RefreshTokenPayload>(
          dto.refreshToken,
        );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        id: payload.jti,
        userId: payload.sub,
        revokedAt: null,
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (storedToken.expiresAt <= new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const tokenMatches = await bcrypt.compare(
      dto.refreshToken,
      storedToken.tokenHash,
    );

    if (!tokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    const accessToken = await this.createAccessToken({
      id: payload.sub,
    });

    const refreshToken = await this.createRefreshToken(payload.sub);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createAccessToken(user: {
    id: string;
    email?: string;
    role?: string;
  }) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        ...(user.email && { email: user.email }),
        ...(user.role && { role: user.role }),
      },
      {
        expiresIn: '15m',
      },
    );
  }

  private async createRefreshToken(userId: string) {
    const jti = randomUUID();

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        type: 'refresh',
        jti,
      },
      {
        expiresIn: '7d',
      },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 12);

    await this.prisma.refreshToken.create({
      data: {
        id: jti,
        tokenHash,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return refreshToken;
  }

  async getCurrentUser(id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async logout(dto: RefreshTokenDto) {
  let payload: RefreshTokenPayload;

  try {
    payload =
      await this.jwtService.verifyAsync<RefreshTokenPayload>(
        dto.refreshToken,
      );
  } catch {
    // Logout should be idempotent.
    // An already-invalid/expired token doesn't need another DB action.
    return {
      message: 'Logged out successfully',
    };
  }

  if (payload.type !== 'refresh') {
    return {
      message: 'Logged out successfully',
    };
  }

  await this.prisma.refreshToken.updateMany({
    where: {
      id: payload.jti,
      userId: payload.sub,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return {
    message: 'Logged out successfully',
  };
}
}