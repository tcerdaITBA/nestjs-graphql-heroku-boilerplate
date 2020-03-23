import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongod = new MongoMemoryServer();
        return {
          uri: await mongod.getConnectionString(),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
  ],
})
export class TestDatabaseModule {}

export function closeConnection(): Promise<boolean> {
  return mongod.stop();
}
