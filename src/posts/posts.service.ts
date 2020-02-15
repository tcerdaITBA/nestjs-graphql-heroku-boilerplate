import { Injectable } from '@nestjs/common';
import { Post } from 'src/graphql';

@Injectable()
export class PostsService {
  findAll(filters: PostsFilters = {}): [Post] {
    if (filters.authorId) {
      return [
        { id: filters.authorId, title: `Post made by ${filters.authorId}` }
      ];
    }
  }
}

export interface PostsFilters {
  id?: number;
  authorId?: number;
}
