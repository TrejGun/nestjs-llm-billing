import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { VanillaService } from './vanilla.service';

@Controller('vanilla')
export class VanillaController {
  constructor(private readonly appService: VanillaService) {}

  @Get('stream')
  handle(@Req() req: Request, @Res() res: Response): void {
    this.appService.stream(req, res);
  }
}
