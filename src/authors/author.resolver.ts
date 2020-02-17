import {
  Resolver,
  ResolveProperty,
  Query,
  Args,
  Parent,
  Mutation
} from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Post, AuthorInput, PaginationInput } from 'src/graphql';
import { PostsService } from 'src/posts/posts.service';
import { AuthorDoc } from './interface/author.interface';

@Resolver('Author')
export class AuthorResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly authorService: AuthorService
  ) {}

  @Query()
  author(@Args('id') id: string): Promise<AuthorDoc> {
    return this.authorService.findById(id);
  }

  @Mutation()
  createAuthor(@Args('input') authorInput: AuthorInput) {
    return this.authorService.createAuthor(authorInput);
  }

  @ResolveProperty()
  posts(
    @Args('page') page: PaginationInput,
    @Parent() author: AuthorDoc
  ): Promise<Post[]> {
    return this.postsService.findAll({ authorId: author.id }, page);
  }
}
