import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}