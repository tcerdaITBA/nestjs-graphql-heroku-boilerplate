import { Document } from 'mongoose';
import { Post } from 'src/common/graphql';

export interface PostDoc extends Document, Post {
  readonly id: string;
  readonly authorId: string;
}
