import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto, userId: string) {
    // Generate ticket code: GNS-YYYY-XXXXX
    const year = new Date().getFullYear();
    const sequence = Math.random().toString().slice(2, 7);
    const code = `GNS-${year}-${sequence}`;

    const ticket = await this.prisma.ticket.create({
      data: {
        ...createTicketDto,
        code,
        createdById: userId,
        status: TicketStatus.NEW,
      },
      include: {
        category: true,
        ward: true,
        createdBy: { select: { id: true, fullname: true, email: true } },
      },
    });

    return { success: true, data: ticket };
  }

  async findAll(userId: string, userRole: string, filters: any) {
    let where: any = {};

    // Citizens can only see their own tickets
    if (userRole === 'CITIZEN') {
      where.createdById = userId;
    }

    // Staff/Admin can filter by status, wardId, categoryId
    if (['STAFF', 'ADMIN'].includes(userRole)) {
      if (filters.status) where.status = filters.status;
      if (filters.wardId) where.wardId = parseInt(filters.wardId);
      if (filters.categoryId) where.categoryId = parseInt(filters.categoryId);
    }

    const tickets = await this.prisma.ticket.findMany({
      where,
      include: {
        category: true,
        ward: true,
        createdBy: { select: { id: true, fullname: true, email: true } },
        assignedTo: { select: { id: true, fullname: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: tickets };
  }

  async findOne(id: string, userId: string, userRole: string) {
    let where: any = { id };

    // Citizens can only see their own tickets
    if (userRole === 'CITIZEN') {
      where.createdById = userId;
    }

    const ticket = await this.prisma.ticket.findUnique({
      where,
      include: {
        category: true,
        ward: true,
        createdBy: { select: { id: true, fullname: true, email: true } },
        assignedTo: { select: { id: true, fullname: true, email: true } },
        comments: {
          include: {
            author: { select: { id: true, fullname: true, email: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return { success: true, data: ticket };
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, userRole: string) {
    // Only STAFF/ADMIN can update tickets
    if (!['STAFF', 'ADMIN'].includes(userRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
      include: {
        category: true,
        ward: true,
        createdBy: { select: { id: true, fullname: true, email: true } },
        assignedTo: { select: { id: true, fullname: true, email: true } },
      },
    });

    return { success: true, data: ticket };
  }
}