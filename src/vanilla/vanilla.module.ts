import { Module, Logger } from '@nestjs/common';

import { VanillaController } from './vanilla.controller';
import { VanillaService } from './vanilla.service';

@Module({
  controllers: [VanillaController],
  providers: [VanillaService, Logger],
  exports: [VanillaService]
})
export class VanillaModule {}
