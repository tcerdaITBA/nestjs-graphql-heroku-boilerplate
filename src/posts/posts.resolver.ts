import {
  Resolver,
  Mutation,
  Parent,
  ResolveProperty,
  Args
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { PostInput, Author } from 'src/graphql';
import { PostDoc } from './interface/posts.interface';
import { AuthorService } from 'src/authors/author.service';

@Resolver('Post')
export class PostsResolver {
  constructor(
    private readonly authorService: AuthorService,
    private readonly postsService: PostsService
  ) {}

  @Mutation()
  createPost(
    @Args('authorId') authorId: string,
    @Args('input') input: PostInput
  ): Promise<PostDoc> {
    return this.postsService.create(authorId, input);
  }

  @ResolveProperty()
  author(@Parent() postDoc: PostDoc): Promise<Author> {
    return this.authorService.findById(postDoc.authorId);
  }
}
