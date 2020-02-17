import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema } from './schema/posts.schema';
import { AuthorModule } from 'src/authors/author.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostsSchema }]),
    forwardRef(() => AuthorModule)
  ],
  providers: [PostsService, PostsResolver],
  exports: [PostsService]
})
export class PostsModule {}
