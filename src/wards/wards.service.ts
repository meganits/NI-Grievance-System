import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WardsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const wards = await this.prisma.ward.findMany({
      select: {
        id: true,
        code: true,
        name_eng: true,  // ← Make sure this matches your schema
        name_np: true,
      },
    });
    
    return {
      success: true,
      data: wards,
    };
  }
}