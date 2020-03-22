import { Module, Global } from '@nestjs/common';
import { MyLogger } from './my-logger.service';
import { MyLoggerPlugin } from './my-logger.plugin';

@Global()
@Module({
  providers: [MyLogger, MyLoggerPlugin],
  exports: [MyLogger, MyLoggerPlugin],
})
export class LoggerModule {}
