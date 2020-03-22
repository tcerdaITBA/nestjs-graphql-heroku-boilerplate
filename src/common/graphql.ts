
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class AuthorInput {
    firstName: string;
    lastName: string;
}

export class PaginationInput {
    limit?: number;
    offset?: number;
}

export class PostInput {
    title: string;
}

export class Author {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
    posts: Post[];
}

export abstract class IMutation {
    abstract createAuthor(input: AuthorInput): Author | Promise<Author>;

    abstract createPost(authorId: string, input: PostInput): Post | Promise<Post>;
}

export class Post {
    id: string;
    title: string;
    votes: number;
    author: Author;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class IQuery {
    abstract author(id: string): Author | Promise<Author>;
}
