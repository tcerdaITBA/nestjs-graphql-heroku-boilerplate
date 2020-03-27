import { Module, OnModuleDestroy } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

let mongod;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        let uri: string;

        if (process.env.TEST) {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          mongod = new MongoMemoryServer();
          uri = await mongod.getConnectionString();
        } else {
          uri = process.env.MONGODB_URI;
        }

        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
  ],
})
export class DatabaseModule implements OnModuleDestroy {
  onModuleDestroy() {
    if (mongod) {
      mongod.stop();
    }
  }
}
