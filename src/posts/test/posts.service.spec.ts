import { PostsService } from '../posts.service';
import { PostDoc } from '../interface/posts.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { PostsSchema } from '../schema/posts.schema';
import { DatabaseModule } from 'src/common/database/database.module';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

describe('PostsService', () => {
  let moduleRef: TestingModule;
  let postsService: PostsService;
  let postsModule: Model<PostDoc>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, MongooseModule.forFeature([{ name: 'Post', schema: PostsSchema }])],
      providers: [PostsService],
    }).compile();

    postsService = moduleRef.get(PostsService);
    postsModule = moduleRef.get(getModelToken('Post'));
  });

  afterEach(async () => {
    await postsModule.deleteMany({});
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('create', () => {
    it('should create a post with the input content and the author id', async () => {
      const createdPost = await postsService.create('5e790e3d3a854bc61909e6d7', {
        title: 'new post',
      });

      expect(createdPost).toMatchObject({
        id: expect.any(String),
        authorId: '5e790e3d3a854bc61909e6d7',
        title: 'new post',
        votes: 0,
      });
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await postsModule.insertMany([
        {
          authorId: '5e790e3d3a854bc61909e6d7',
          title: 'a post from first author',
        },
        {
          authorId: '5e790e3d3a854bc61909e6d7',
          title: 'another post from first author',
        },
        {
          authorId: '5e7a4bbc49c969c292a946bc',
          title: 'post from another author',
        },
      ]);
    });

    it('should filter by author id', async () => {
      const posts = await postsService.findAll(
        { authorId: '5e790e3d3a854bc61909e6d7' },
        { limit: 20, offset: 0 }
      );

      expect(posts).toHaveLength(2);
      expect(posts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            authorId: '5e790e3d3a854bc61909e6d7',
            title: 'a post from first author',
          }),
          expect.objectContaining({
            authorId: '5e790e3d3a854bc61909e6d7',
            title: 'another post from first author',
          }),
        ])
      );
    });

    it('should return all posts given empty filters', async () => {
      expect(await postsService.findAll({}, { limit: 20, offset: 0 })).toHaveLength(3);
    });

    it('should return no more posts than the limit number', async () => {
      expect(await postsService.findAll({}, { limit: 2, offset: 0 })).toHaveLength(2);
    });

    it('should skip posts given an offset', async () => {
      expect(await postsService.findAll({}, { limit: 2, offset: 2 })).toHaveLength(1);
    });

    it('should return no posts if offset is higher or equal than total number of posts', async () => {
      expect(await postsService.findAll({}, { limit: 2, offset: 3 })).toHaveLength(0);
    });
  });
});
