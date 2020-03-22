import { Resolver, Mutation, Parent, Args, ResolveField } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Author, Post } from 'src/common/graphql';
import { PostDoc } from './interface/posts.interface';
import { AuthorService } from 'src/authors/author.service';
import { PostInputDto } from './dto/posts.dto';
import { MyLogger } from 'src/common/logger/my-logger.service';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';

@Resolver('Post')
export class PostsResolver {
  constructor(
    private readonly authorService: AuthorService,
    private readonly postsService: PostsService,
    private readonly logger: MyLogger
  ) {
    logger.setContext(PostsResolver.name);
  }

  @Mutation()
  async createPost(
    @Args('authorId') authorId: string,
    @Args('input') input: PostInputDto
  ): Promise<PostDoc> {
    const createdPost = await this.postsService.create(authorId, input);

    this.logger.log(`Created post [author=${authorId}] [id=${createdPost.id}]`);

    return createdPost;
  }

  @ResolveField()
  author(@Parent() postDoc: PostDoc): Promise<Author> {
    return this.authorService.findById(postDoc.authorId);
  }
}

@Resolver('Author')
export class PostsAuthorResolver {
  constructor(private readonly postsService: PostsService) {}

  @ResolveField()
  posts(@Parent() author: Author, @Args('page') page: PaginationInputDto): Promise<Post[]> {
    return this.postsService.findAll({ authorId: author.id }, page);
  }
}
