import { Module, forwardRef } from '@nestjs/common';
import { PostsModule } from 'src/posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorService } from './author.service';
import { AuthorSchema } from './schema/author.schema';
import { AuthorResolver } from './author.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }]),
    forwardRef(() => PostsModule)
  ],
  providers: [AuthorResolver, AuthorService],
  exports: [AuthorService]
})
export class AuthorModule {}
