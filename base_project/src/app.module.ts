import { CacheInterceptor, CacheModule, Logger, Module } from '@nestjs/common';
import { AuthModule } from 'auth/auth/auth.module';
import { UserModule } from 'user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RefreshTokenModule } from './auth/refresh-token/refresh-token.module';
import { CoreModule } from 'core/core.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CoreModule,
    CacheModule.register(),
    AuthModule,
    UserModule,
    RefreshTokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
