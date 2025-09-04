import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // This runs automatically when the module starts
  async onModuleInit() {
    await this.createTestUserIfNotExists();
  }

  private async createTestUserIfNotExists() {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: 'test@example.com' },
      });
      
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await this.prisma.user.create({
          data: {
            email: 'test@example.com',
            password: hashedPassword,
            fullname: 'Test User',
            role: 'CITIZEN',
          },
        });
        console.log('✅ Test user created successfully');
      } else {
        console.log('ℹ️ Test user already exists');
      }
    } catch (error) {
      console.error('❌ Error creating test user:', error);
    }
  }

  async login(loginDto: LoginDto) {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    // 2. Check if user exists and password matches
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // 4. Return token (in the envelope format required)
    return {
      success: true,
      data: {
        access_token: accessToken,
      },
    };
  }
}