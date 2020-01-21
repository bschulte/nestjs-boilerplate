import { Module, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ConsoleModule } from 'nestjs-console';

import { DotenvModule } from './modules/dotenv/dotenv.module';
import { DotenvService } from './modules/dotenv/dotenv.service';
import { UserModule } from './modules/user/user.module';
import { SessionMiddleware } from './middleware/session.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UtilModule } from './modules/util/util.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationModule } from './modules/notification/notification.module';
import { GroupAdminModule } from 'src/modules/groupAdmin/groupAdmin.module';
import { UserConfigModule } from './modules/userConfig/userConfig.module';
import { DatabaseModule } from './modules/database/database.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DotenvModule],
      useFactory: async (dotenvService: DotenvService) =>
        ({
          type: 'mysql',
          host: dotenvService.get('DB_HOST'),
          port: parseInt(dotenvService.get('DB_PORT'), 10),
          username: dotenvService.get('DB_USER'),
          password: dotenvService.get('DB_PASSWORD'),
          database: dotenvService.get('DB_NAME'),
          entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
          synchronize: dotenvService.get('NODE_ENV') === 'development',
          logging: dotenvService.get('NODE_ENV') === 'development',
          logger: 'file',
        } as any),
      inject: [DotenvService],
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (dotenvService: DotenvService) => ({
        debug: dotenvService.get('NODE_ENV') === 'development',
        playground: dotenvService.get('NODE_ENV') === 'development',
        autoSchemaFile: true,
        context: ({ req }) => ({ req }),
      }),
      inject: [DotenvService],
    }),
    DotenvModule,
    AuthModule,
    EmailModule,
    AuditModule,
    ConsoleModule,
    NotificationModule,
    GroupAdminModule,
    forwardRef(() => UtilModule),
    forwardRef(() => UserModule),
    UserConfigModule,
    DatabaseModule,
    SchedulerModule,
  ],
  providers: [],
})
export class ConsoleAppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
