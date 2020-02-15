import {
  Resolver,
  ResolveProperty,
  Query,
  Args,
  Parent
} from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Author, Post } from 'src/graphql';
import { PostsService } from 'src/posts/posts.service';

@Resolver('Author')
export class AuthorResolver {
  constructor(
    private readonly authorService: AuthorService,
    private readonly postsService: PostsService
  ) {}

  @Query('author')
  findAuthor(@Args('id') id: number): Author {
    return this.authorService.findById(id);
  }

  @ResolveProperty('posts')
  findPosts(@Parent() author: Author): [Post] {
    const { id } = author;
    return this.postsService.findAll({ authorId: id });
  }
}
