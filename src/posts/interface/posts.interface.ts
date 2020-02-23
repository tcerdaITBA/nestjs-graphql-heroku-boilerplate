import { Document } from 'mongoose';
import { Post } from 'src/shared/graphql';

export interface PostDoc extends Post, Document {
  readonly id: string;
  readonly authorId: string;
}
