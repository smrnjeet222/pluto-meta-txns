import { Module } from '@nestjs/common';
import { TxnsController } from './txns.controller';
import { TxnsConsumer } from './txns.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'meta_txns',
    }),
  ],
  controllers: [TxnsController],
  providers: [TxnsConsumer],
})
export class TxnsModule {}
