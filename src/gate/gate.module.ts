import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Gate } from './gate.entity';
import { GateController } from './gate.controller';
import { GateService } from './gate.service';
import { AuthModule, passportModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gate]),
    passportModule,
    forwardRef(() => AuthModule),
  ],
  providers: [GateService],
  controllers: [GateController],
  exports: [GateService],
})
export class GateModule {}
