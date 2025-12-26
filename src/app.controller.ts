import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller('llm')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('stream')
  handle(@Req() req: Request, @Res() res: Response): void {
    this.appService.stream(req, res);
  }
}
