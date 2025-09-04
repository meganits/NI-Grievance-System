import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // No prefix here - handles root route "/"
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}