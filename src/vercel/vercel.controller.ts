import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { VercelService } from './vercel.service';

@Controller('vercel')
export class VercelController {
  constructor(private readonly appService: VercelService) {}

  @Get('stream')
  handle(@Req() req: Request, @Res() res: Response): void {
    this.appService.stream(req, res);
  }
}
