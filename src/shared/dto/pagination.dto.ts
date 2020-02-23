import { PaginationInput } from '../graphql';
import { Min, IsInt } from 'class-validator';

export class PaginationInputDto extends PaginationInput {
  @IsInt()
  @Min(1)
  readonly limit: number;

  @IsInt()
  @Min(0)
  readonly offset: number;
}
