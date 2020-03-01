import {
  Resolver,
  ResolveProperty,
  Query,
  Args,
  Parent,
  Mutation
} from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Post, Author } from 'src/shared/graphql';
import { PostsService } from 'src/posts/posts.service';
import { PaginationInputDto } from 'src/shared/dto/pagination.dto';
import { AuthorInputDto } from './dto/author.dto';
import { MyLogger } from 'src/shared/logger/my-logger.service';

@Resolver('Author')
export class AuthorResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly authorService: AuthorService,
    private readonly logger: MyLogger
  ) {
    logger.setContext('AuthorResolver');
  }

  @Query()
  author(@Args('id') id: string): Promise<Author> {
    return this.authorService.findById(id);
  }

  @Mutation()
  async createAuthor(
    @Args('input') authorInput: AuthorInputDto
  ): Promise<Author> {
    const createdAuthor = await this.authorService.createAuthor(authorInput);

    this.logger.log(
      `Created author [fullName=${createdAuthor.fullName}] [id=${createdAuthor.id}]`
    );

    return createdAuthor;
  }

  @ResolveProperty()
  posts(
    @Args('page') page: PaginationInputDto,
    @Parent() author: Author
  ): Promise<Post[]> {
    return this.postsService.findAll({ authorId: author.id }, page);
  }
}
