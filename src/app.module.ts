import { Module } from '@nestjs/common';
import { join } from 'path';
import { AuthorModule } from './authors/author.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DateScalar } from './scalars/date.scalar';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, { useNewUrlParser: true }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class'
      }
    }),
    AuthorModule,
    PostsModule
  ],
  providers: [DateScalar]
})
export class AppModule {}
