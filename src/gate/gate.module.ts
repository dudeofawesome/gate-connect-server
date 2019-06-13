import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { GateService, GateController, Gate } from './';
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
