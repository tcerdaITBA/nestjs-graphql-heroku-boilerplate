import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { AuthorInputDto } from './dto/author.dto';
import { MyLogger } from 'src/common/logger/my-logger.service';
import { Author } from 'src/common/graphql';

@Resolver('Author')
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService, private readonly logger: MyLogger) {
    logger.setContext('AuthorResolver');
  }

  @Query()
  author(@Args('id') id: string): Promise<Author> {
    return this.authorService.findById(id);
  }

  @Mutation()
  async createAuthor(@Args('input') authorInput: AuthorInputDto): Promise<Author> {
    const createdAuthor = await this.authorService.createAuthor(authorInput);

    this.logger.log(`Created author [fullName=${createdAuthor.fullName}] [id=${createdAuthor.id}]`);

    return createdAuthor;
  }
}
