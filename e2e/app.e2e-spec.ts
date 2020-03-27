import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import gql from 'graphql-tag';
import { AppModule } from '../src/app.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { Author, Post } from 'src/common/graphql';
import { Model } from 'mongoose';
import { PostDoc } from 'src/posts/interface/posts.interface';
import { AuthorDoc } from 'src/authors/interface/author.interface';
import { getModelToken } from '@nestjs/mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;
  let postsModule: Model<PostDoc>;
  let authorModel: Model<AuthorDoc>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const module: GraphQLModule = moduleFixture.get<GraphQLModule>(GraphQLModule);
    apolloClient = createTestClient((module as any).apolloServer);
    authorModel = moduleFixture.get(getModelToken('Author'));
    postsModule = moduleFixture.get(getModelToken('Post'));
  });

  describe('Queries', () => {
    it('author', async () => {
      await authorModel.create({
        _id: '5e790e3d3a854bc61909e6d7',
        firstName: 'Tomás',
        lastName: 'Cerdá',
      });

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
          title: 'post from a different author',
        },
      ]);

      const author: Author = (
        await apolloClient.query({
          query: gql`
            query {
              author(id: "5e790e3d3a854bc61909e6d7") {
                id
                firstName
                lastName
                fullName
                posts {
                  title
                }
              }
            }
          `,
        })
      ).data.author;

      expect(author).toEqual({
        id: '5e790e3d3a854bc61909e6d7',
        firstName: 'Tomás',
        lastName: 'Cerdá',
        fullName: 'Tomás Cerdá',
        posts: expect.arrayContaining([
          { title: 'a post from first author' },
          { title: 'another post from first author' },
        ]),
      });
    });
  });

  describe('Mutations', () => {
    it('createAuthor', async () => {
      const createdAuthor: Author = (
        await apolloClient.mutate({
          mutation: gql`
            mutation {
              createAuthor(input: { firstName: "Tomás", lastName: "Cerdá" }) {
                id
                firstName
                lastName
                fullName
                createdAt
                updatedAt
                posts {
                  id
                }
              }
            }
          `,
        })
      ).data.createAuthor;

      expect(createdAuthor).toEqual({
        id: expect.any(String),
        firstName: 'Tomás',
        lastName: 'Cerdá',
        fullName: 'Tomás Cerdá',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
        posts: [],
      });

      // assert created author can be retrieved as well

      const retrievedAuthor: Author = (
        await apolloClient.query({
          query: gql`
          query {
            author(id: "${createdAuthor.id}") {
              id
              firstName
              lastName
              fullName
              createdAt
              updatedAt
              posts {
                id
              }
            }
          }`,
        })
      ).data.author;

      expect(retrievedAuthor).toEqual(createdAuthor);
    });

    it('createPost', async () => {
      await authorModel.create({
        _id: '5e7732edcf6bbfed4aa10caa',
        firstName: 'Tomás',
        lastName: 'Cerdá',
      });

      const createdPost: Post = (
        await apolloClient.mutate({
          mutation: gql`
            mutation {
              createPost(input: { title: "my third post" }, authorId: "5e7732edcf6bbfed4aa10caa") {
                id
                title
                votes
                author {
                  id
                  firstName
                }
              }
            }
          `,
        })
      ).data.createPost;

      expect(createdPost).toEqual({
        id: expect.any(String),
        title: 'my third post',
        votes: 0,
        author: {
          id: '5e7732edcf6bbfed4aa10caa',
          firstName: 'Tomás',
        },
      });
    });
  });

  afterEach(async () => {
    await authorModel.deleteMany({});
    await postsModule.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });
});
