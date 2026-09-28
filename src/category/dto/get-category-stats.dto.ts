import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetCategoryStatsDto {
  @IsNumber()
  @IsNotEmpty()
  categoryId!: number;

  @IsString()
  @IsNotEmpty()
  categoryName!: string;

  @IsNumber()
  @IsNotEmpty()
  postCount!: number;

  @IsNumber()
  @IsNotEmpty()
  subscriberCount!: number;
}
