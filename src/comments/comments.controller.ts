import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tickets/:id/comments')
@UseGuards(JwtAuthGuard) // Add JWT protection
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findByTicket(
    @Param('id') ticketId: string,
    @Request() req, // Add request to get user info
  ) {
    const comments = await this.commentsService.findAllForTicket(
      ticketId, 
      req.user.sub, 
      req.user.role
    );
    return { success: true, data: comments };
  }

  @Post()
  async create(
    @Param('id') ticketId: string,
    @Body() createCommentDto: CreateCommentDto, // Use DTO instead of raw body
    @Request() req,
  ) {
    const comment = await this.commentsService.create(
      ticketId, 
      createCommentDto, 
      req.user.sub
    );
    return { success: true, data: comment };
  }
}