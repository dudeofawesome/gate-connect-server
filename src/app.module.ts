import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserTokenModule } from './user-token/user-token.module';
import { GateModule } from './gate/gate.module';
import { GateGroupModule } from './gate-group/gate-group.module';
import { GateGroupOwnerModule } from './gate-group-owner/gate-group-owner.module';
import { GateGroupAddressModule } from './gate_group_address/gate_group_address.module';
import { UserAddressModule } from './user_address/user_address.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'doa-server.local',
      port: 54322,
      username: 'postgres',
      password:
        'geminate catchy runny wee zoophyte coax record achieve pipette coward',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    AuthModule,
    UserModule,
    UserTokenModule,
    GateModule,
    GateGroupModule,
    GateGroupOwnerModule,
    UserAddressModule,
    GateGroupAddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
