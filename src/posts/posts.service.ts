import { Injectable } from '@nestjs/common';
import { Post, PaginationInput, PostInput } from 'src/shared/graphql';
import { PostDoc } from './interface/posts.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postsModel: Model<PostDoc>
  ) {}

  async findAll(
    filters: PostsFilters,
    { limit, offset }: PaginationInput
  ): Promise<Post[]> {
    return await this.postsModel
      .find({ authorId: filters.authorId })
      .limit(limit)
      .skip(offset);
  }

  create(authorId: string, input: PostInput): Promise<PostDoc> {
    return this.postsModel.create({
      ...input,
      authorId
    });
  }
}

export interface PostsFilters {
  authorId?: string;
}
