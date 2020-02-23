import {
  Resolver,
  ResolveProperty,
  Query,
  Args,
  Parent,
  Mutation
} from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Post } from 'src/shared/graphql';
import { PostsService } from 'src/posts/posts.service';
import { PaginationInputDto } from 'src/shared/dto/pagination.dto';
import { AuthorDoc } from './interface/author.interface';
import { AuthorInputDto } from './dto/author.dto';

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
  createAuthor(@Args('input') authorInput: AuthorInputDto) {
    return this.authorService.createAuthor(authorInput);
  }

  @ResolveProperty()
  posts(
    @Args('page') page: PaginationInputDto,
    @Parent() author: AuthorDoc
  ): Promise<Post[]> {
    return this.postsService.findAll({ authorId: author.id }, page);
  }
}
