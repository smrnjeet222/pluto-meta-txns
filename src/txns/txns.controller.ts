import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { Queue } from 'bull';

export class TxnBodyDto {
  signature: string;
  txn: {
    from: string;
    to: string;
    value: number;
    gas: number;
    nonce: number;
    data: string;
  };
}

@Controller('txns')
export class TxnsController {
  constructor(
    @InjectQueue('meta_txns') private readonly metaTxnsQueue: Queue,
  ) {}

  @Get(':id')
  getJobInQueue(@Param('id') id: string) {
    return this.metaTxnsQueue.getJob(id);
  }

  @Post()
  async sendTxn(@Body() body: TxnBodyDto) {
    if (!body?.txn || !body.signature) {
      return { error: 'invalid body' };
    }
    const job = await this.metaTxnsQueue.add('proccess', body);
    console.log('Queue added', job.id);
    return job;
  }
}
