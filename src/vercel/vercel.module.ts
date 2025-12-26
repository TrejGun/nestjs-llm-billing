import { Module, Logger } from '@nestjs/common';

import { VercelController } from './vercel.controller';
import { VercelService } from './vercel.service';

@Module({
  controllers: [VercelController],
  providers: [VercelService, Logger],
  exports: [VercelService]
})
export class VercelModule {}
