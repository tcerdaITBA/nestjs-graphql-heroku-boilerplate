import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from '../author.service';
import { AuthorDoc } from '../interface/author.interface';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { AuthorSchema } from '../schema/author.schema';
import { DatabaseModule } from 'src/common/database/database.module';
import { Model } from 'mongoose';

describe('AuthorService', () => {
  let moduleRef: TestingModule;
  let authorService: AuthorService;
  let authorModel: Model<AuthorDoc>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }]),
      ],
      providers: [AuthorService],
    }).compile();

    authorService = moduleRef.get(AuthorService);
    authorModel = moduleRef.get(getModelToken('Author'));
  });

  afterEach(async () => {
    await authorModel.deleteMany({});
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('findById', () => {
    it('should return an author by id', async () => {
      await authorModel.create({
        _id: '5e790e3d3a854bc61909e6d7',
        firstName: 'Tomás',
        lastName: 'Cerdá',
      });

      expect(await authorService.findById('5e790e3d3a854bc61909e6d7')).toMatchObject({
        id: '5e790e3d3a854bc61909e6d7',
        firstName: 'Tomás',
        lastName: 'Cerdá',
        fullName: 'Tomás Cerdá',
      });
    });

    it('should return null if author does not exist', async () => {
      expect(await authorService.findById('5e790e3d3a854bc61909e6d7')).toBeNull();
    });
  });

  describe('createAuthor', () => {
    it('should create an author given an author input', async () => {
      expect(
        await authorService.create({
          firstName: 'Doe',
          lastName: 'Joe',
        })
      ).toMatchObject({
        id: expect.any(String),
        firstName: 'Doe',
        lastName: 'Joe',
        fullName: 'Doe Joe',
      });
    });
  });
});
