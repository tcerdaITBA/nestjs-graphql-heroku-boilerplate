import { Document } from 'mongoose';
import { Author } from 'src/common/graphql';

export interface AuthorDoc extends Document, Author {
  readonly id: string;
}
