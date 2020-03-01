import { Resolver, Mutation, Parent, ResolveProperty, Args } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Author } from 'src/shared/graphql';
import { PostDoc } from './interface/posts.interface';
import { AuthorService } from 'src/authors/author.service';
import { PostInputDto } from './dto/posts.dto';
import { MyLogger } from 'src/shared/logger/my-logger.service';

@Resolver('Post')
export class PostsResolver {
  constructor(
    private readonly authorService: AuthorService,
    private readonly postsService: PostsService,
    private readonly logger: MyLogger
  ) {
    logger.setContext('PostsResolver');
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

  @ResolveProperty()
  author(@Parent() postDoc: PostDoc): Promise<Author> {
    return this.authorService.findById(postDoc.authorId);
  }
}
