import { Module } from '@nestjs/common';
import { join } from 'path';
import { AuthorModule } from './authors/author.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DateScalar } from './scalars/date.scalar';
import { PostsModule } from './posts/posts.module';
import { LoggerModule } from './shared/logger/my-logger.module';
import { MyLoggerPlugin } from './shared/logger/my-logger.plugin';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/shared/graphql.ts'),
        outputAs: 'class'
      },
      plugins: [new MyLoggerPlugin()]
    }),
    AuthorModule,
    PostsModule,
    LoggerModule
  ],
  providers: [DateScalar]
})
export class AppModule {}
