import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class getMySubscriptionStats {
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
