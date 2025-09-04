import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: { is_active: true },
      select: {
        id: true,
        code: true,
        name_eng: true,
        name_np: true,
        is_active: true,
      },
    });
    
    return {
      success: true,
      data: categories,
    };
  }
}