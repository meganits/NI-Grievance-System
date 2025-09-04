import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service'; // ← MUST ADD THIS

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService], // ← ADD PrismaService HERE
})
export class CategoriesModule {} // ← This should be at the end