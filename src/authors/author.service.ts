import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthorDoc } from './interface/author.interface';
import { Model } from 'mongoose';
import { AuthorInput } from 'src/shared/graphql';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel('Author') private readonly authorModel: Model<AuthorDoc>
  ) {}

  async findById(id: string): Promise<AuthorDoc> {
    return this.authorModel.findById(id);
  }

  async createAuthor({ firstName, lastName }: AuthorInput): Promise<AuthorDoc> {
    return this.authorModel.create({ firstName, lastName });
  }
}
