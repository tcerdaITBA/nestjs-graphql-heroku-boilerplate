import { Module } from '@nestjs/common';
import { join } from 'path';
import { AuthorModule } from './authors/author.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class'
      }
    }),
    AuthorModule
  ]
})
export class AppModule {}
