import { Module } from '@nestjs/common';
import { join } from 'path';
import { AuthorModule } from './authors/author.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { DateScalar } from './common/scalars/date.scalar';
import { PostsModule } from './posts/posts.module';
import { LoggerModule } from './common/logger/my-logger.module';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/common/graphql.ts'),
        outputAs: 'class',
      },
    }),
    DatabaseModule,
    AuthorModule,
    PostsModule,
    LoggerModule,
  ],
  providers: [DateScalar],
})
export class AppModule {}
