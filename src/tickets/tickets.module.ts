import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { PrismaService } from '../prisma/prisma.service'; // Add this import

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, PrismaService], // Add PrismaService here
})
export class TicketsModule {}