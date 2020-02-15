import { Injectable } from '@nestjs/common';
import { Author } from 'src/graphql';

@Injectable()
export class AuthorService {
  findById(id: number): Author {
    return {
      id,
      firstName: 'Tomás',
      lastName: 'Cerdá'
    };
  }
}
