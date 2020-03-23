import { Test } from '@nestjs/testing';
import { MyLogger } from 'src/common/logger/my-logger.service';
import { PostsResolver, PostsAuthorResolver } from '../posts.resolver';
import { AuthorService } from 'src/authors/author.service';
import { PostsService } from '../posts.service';
import { PostDoc } from '../interface/posts.interface';
import { PostInputDto } from '../dto/posts.dto';
import { AuthorDoc } from 'src/authors/interface/author.interface';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';

describe('PostsResolvers', () => {
  let postsResolver: PostsResolver;
  let authorService: AuthorService;
  let postsService: PostsService;
  let postsAuthorResolver: PostsAuthorResolver;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PostsResolver,
        PostsAuthorResolver,
        MyLogger,
        {
          provide: AuthorService,
          useValue: new AuthorService(null),
        },
        {
          provide: PostsService,
          useValue: new PostsService(null),
        },
      ],
    }).compile();

    postsResolver = moduleRef.get(PostsResolver);
    authorService = moduleRef.get(AuthorService);
    postsService = moduleRef.get(PostsService);
    postsAuthorResolver = moduleRef.get(PostsAuthorResolver);
  });

  describe('PostResolver', () => {
    describe('createPost', () => {
      it('should create a post given the author id and the post input', async () => {
        const postInput = {
          title: 'new post',
        } as PostInputDto;

        const createdPost = {
          id: '2',
          authorId: '1',
          title: 'new post',
        } as PostDoc;

        jest.spyOn(postsService, 'create').mockReturnValue(Promise.resolve(createdPost));

        expect(await postsResolver.createPost('1', postInput)).toBe(createdPost);
        expect(postsService.create).toHaveBeenCalledWith('1', postInput);
      });
    });

    describe('author', () => {
      it('should find an author by the post author id', async () => {
        const post = {
          authorId: '1',
        } as PostDoc;

        const author = {
          id: '1',
          firstName: 'Tomás',
          lastName: 'Cerdá',
        } as AuthorDoc;

        jest.spyOn(authorService, 'findById').mockReturnValue(Promise.resolve(author));

        expect(await postsResolver.author(post)).toBe(author);
        expect(authorService.findById).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('PostsAuthorResolver', () => {
    it('should return a page of posts given their author', async () => {
      const posts = [
        {
          id: '2',
          authorId: '1',
          title: 'first post',
        },
        {
          id: '3',
          authorId: '1',
          title: 'second post',
        },
      ] as PostDoc[];

      const author = {
        id: '1',
        firstName: 'Tomás',
        lastName: 'Cerdá',
      } as AuthorDoc;

      const page = {
        offset: 1,
        limit: 20,
      } as PaginationInputDto;

      jest.spyOn(postsService, 'findAll').mockReturnValue(Promise.resolve(posts));

      expect(await postsAuthorResolver.posts(author, page)).toBe(posts);
      expect(postsService.findAll).toHaveBeenCalledWith({ authorId: '1' }, page);
    });
  });
});
