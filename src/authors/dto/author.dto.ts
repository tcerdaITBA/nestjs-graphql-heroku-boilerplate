import { Length } from 'class-validator';
import { AuthorInput } from 'src/common/graphql';

export class AuthorInputDto extends AuthorInput {
  @Length(3, 64)
  readonly firstName: string;

  @Length(3, 64)
  readonly lastName: string;
}
