import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(ticketId: string, createCommentDto: CreateCommentDto, userId: string) {
    // First check if ticket exists and user has access
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { createdBy: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Citizens can only comment on their own tickets
    // Staff/Admin can comment on any ticket
    if (ticket.createdById !== userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      // FIX: Check if user exists before accessing role
      if (!user || !['STAFF', 'ADMIN'].includes(user.role)) {
        throw new ForbiddenException('You can only comment on your own tickets');
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        body: createCommentDto.body,
        ticketId: ticketId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return comment;
  }

  async findAllForTicket(ticketId: string, userId: string, userRole: string) {
    // First check if ticket exists
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Citizens can only see comments on their own tickets
    if (userRole === 'CITIZEN' && ticket.createdById !== userId) {
      throw new ForbiddenException('Access to comments denied');
    }

    const comments = await this.prisma.comment.findMany({
      where: { ticketId },
      include: {
        author: {
          select: {
            id: true,
            fullname: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return comments;
  }
}