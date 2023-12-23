import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';

@Processor('meta_txns')
export class TxnsConsumer {
  @Process('proccess')
  handleTxn(job: Job) {
    console.log('Processing meta transactions');
    console.log(job.data);
    console.log('completed!!');
  }
}
