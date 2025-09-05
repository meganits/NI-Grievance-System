import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles('CITIZEN')
  create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    return this.ticketsService.create(createTicketDto, req.user.sub);
  }

  @Get()
  findAll(@Query() filters: any, @Request() req) {
    return this.ticketsService.findAll(req.user.sub, req.user.role, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.ticketsService.findOne(id, req.user.sub, req.user.role);
  }

  @Patch(':id')
  @Roles('STAFF', 'ADMIN')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto, @Request() req) {
    return this.ticketsService.update(id, updateTicketDto, req.user.role);
  }
}