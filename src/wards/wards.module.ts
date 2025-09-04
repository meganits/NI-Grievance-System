import { Module } from '@nestjs/common';
import { WardsController } from './wards.controller';
import { WardsService } from './wards.service';
import { PrismaService } from '../prisma/prisma.service'; // ← MUST ADD THIS

@Module({
  controllers: [WardsController],
  providers: [WardsService, PrismaService], // ← ADD PrismaService HERE
})
export class WardsModule {} // ← This should be at the end