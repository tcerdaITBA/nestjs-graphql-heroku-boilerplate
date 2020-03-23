import { Test } from '@nestjs/testing';
import { AuthorResolver } from '../author.resolver';
import { AuthorService } from '../author.service';
import { AuthorDoc } from '../interface/author.interface';
import { AuthorInputDto } from '../dto/author.dto';
import { MyLogger } from 'src/common/logger/my-logger.service';

describe('AuthorResolver', () => {
  let authorResolver: AuthorResolver;
  let authorService: AuthorService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthorResolver,
        MyLogger,
        {
          provide: AuthorService,
          useValue: new AuthorService(null),
        },
      ],
    }).compile();

    authorResolver = moduleRef.get(AuthorResolver);
    authorService = moduleRef.get(AuthorService);
  });

  describe('author', () => {
    it('should return an author by id', async () => {
      const author = {
        id: '1',
        firstName: 'Tomás',
        lastName: 'Cerdá',
      } as AuthorDoc;

      jest.spyOn(authorService, 'findById').mockReturnValue(Promise.resolve(author));

      expect(await authorResolver.author('1')).toBe(author);
      expect(authorService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should return the created author', async () => {
      const authorInput = {
        firstName: 'Tomás',
        lastName: 'Cerdá',
      } as AuthorInputDto;

      const author = {
        id: '1',
        firstName: 'Tomás',
        lastName: 'Cerdá',
      } as AuthorDoc;

      jest.spyOn(authorService, 'create').mockReturnValue(Promise.resolve(author));

      expect(await authorResolver.createAuthor(authorInput)).toBe(author);
      expect(authorService.create).toHaveBeenCalledWith(authorInput);
    });
  });
});
