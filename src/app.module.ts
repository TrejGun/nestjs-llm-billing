import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { VercelModule } from "./vercel/vercel.module";
import { VanillaModule } from "./vanilla/vanilla.module";

@Module({
  imports: [
    ConfigModule.forRoot({}),
    VercelModule,
    VanillaModule,
  ],
})
export class AppModule {}
