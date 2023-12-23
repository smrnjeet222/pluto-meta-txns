import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Post } from '@nestjs/common';
import type { Queue } from 'bull';

@Controller('txns')
export class TxnsController {
  constructor(
    @InjectQueue('meta_txns') private readonly metaTxnsQueue: Queue,
  ) {}

  @Get()
  getHello(req): string {
    console.log(req);
    return 'Hello World!';
  }

  @Post()
  async sendTxn() {
    console.log('sending txn');
    const { id } = await this.metaTxnsQueue.add('proccess', {
      from: '0xjeet',
      to: '0xcontract',
      data: '0x',
    });
    return { jobId: id };
  }
}
