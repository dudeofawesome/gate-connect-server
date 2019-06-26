import { Module } from '@nestjs/common';

import { HologramService } from './hologram.service';

@Module({
  imports: [],
  providers: [HologramService],
  exports: [HologramService],
})
export class HologramModule {}
