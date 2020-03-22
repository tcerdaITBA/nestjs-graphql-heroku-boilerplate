import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver, PostsAuthorResolver } from './posts.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema } from './schema/posts.schema';
import { AuthorModule } from 'src/authors/author.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostsSchema }]), AuthorModule],
  providers: [PostsService, PostsResolver, PostsAuthorResolver],
  exports: [PostsService],
})
export class PostsModule {}
