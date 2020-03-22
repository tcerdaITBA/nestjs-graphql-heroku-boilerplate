import { PostInput } from 'src/common/graphql';
import { Length } from 'class-validator';

export class PostInputDto extends PostInput {
  @Length(1, 128)
  readonly title: string;
}
