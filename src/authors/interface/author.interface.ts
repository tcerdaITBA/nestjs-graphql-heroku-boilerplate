import { Document } from 'mongoose';
import { Author } from 'src/shared/graphql';

export interface AuthorDoc extends Document, Author {
  readonly id: string;
}
