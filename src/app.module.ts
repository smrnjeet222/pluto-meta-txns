import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { TxnsModule } from './txns/txns.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis:
        'redis://default:52bbb3818431479aae878e69294ea841@deep-llama-34217.upstash.io:34217',
      prefix: 'queue',
      limiter: {
        max: 2,
        duration: seconds(5),
        bounceBack: false,
      },
    }),
    ThrottlerModule.forRoot({
      storage: new ThrottlerStorageRedisService(
        'redis://default:52bbb3818431479aae878e69294ea841@deep-llama-34217.upstash.io:34217',
      ),
      throttlers: [
        {
          ttl: seconds(10),
          limit: 5,
        },
      ],
    }),
    TxnsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
