import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';

export class GetmyStatsDto {
  @IsNumber()
  @IsNotEmpty()
  categoryId!: number;

  @IsString()
  @IsNotEmpty()
  categoryName!: string;

  @IsBoolean()
  @IsNotEmpty()
  isSubscribed!: boolean;

  @IsNumber()
  @IsNotEmpty()
  myPostCount!: number;
}
