import {
  Resolver,
  Mutation,
  Parent,
  ResolveProperty,
  Args
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Author } from 'src/shared/graphql';
import { PostDoc } from './interface/posts.interface';
import { AuthorService } from 'src/authors/author.service';
import { PostInputDto } from './dto/posts.dto';

@Resolver('Post')
export class PostsResolver {
  constructor(
    private readonly authorService: AuthorService,
    private readonly postsService: PostsService
  ) {}

  @Mutation()
  createPost(
    @Args('authorId') authorId: string,
    @Args('input') input: PostInputDto
  ): Promise<PostDoc> {
    return this.postsService.create(authorId, input);
  }

  @ResolveProperty()
  author(@Parent() postDoc: PostDoc): Promise<Author> {
    return this.authorService.findById(postDoc.authorId);
  }
}
