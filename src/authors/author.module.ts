import { Module } from '@nestjs/common';
import { AuthorResolver } from './author.resolver';
import { AuthorService } from './author.service';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [PostsModule],
  providers: [AuthorResolver, AuthorService]
})
export class AuthorModule {}
