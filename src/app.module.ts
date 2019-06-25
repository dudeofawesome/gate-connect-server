import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
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
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserEmailModule } from './user_email/user_email.module';

const config_service = ConfigService.getInstance();

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config_service.get('POSTGRES_HOST'),
      port: Number.parseInt(config_service.get('POSTGRES_PORT')),
      username: config_service.get('POSTGRES_USERNAME'),
      password: config_service.get('POSTGRES_PASSWORD'),
      database: config_service.get('POSTGRES_DATABASE'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    } as TypeOrmModuleOptions),

    AuthModule,
    UserModule,
    UserTokenModule,
    GateModule,
    GateGroupModule,
    GateGroupOwnerModule,
    UserAddressModule,
    GateGroupAddressModule,
    UserEmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
