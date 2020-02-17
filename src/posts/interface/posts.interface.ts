import { Document } from 'mongoose';
import { Post } from 'src/graphql';

export interface PostDoc extends Post, Document {
  readonly id: string;
  readonly authorId: string;
}
