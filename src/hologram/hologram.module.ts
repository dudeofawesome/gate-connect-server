import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { HologramService } from './hologram.service';

@Module({
  imports: [ConfigModule],
  providers: [HologramService],
  exports: [HologramService],
})
export class HologramModule {}
