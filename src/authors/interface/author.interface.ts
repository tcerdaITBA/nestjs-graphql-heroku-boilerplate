import { Document } from 'mongoose';
import { Author } from 'src/graphql';

export interface AuthorDoc extends Document, Author {
  readonly id: string;
}
