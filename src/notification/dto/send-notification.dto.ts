import { IsNotEmpty, IsNumber } from 'class-validator';

export class NotificationService {
  @IsNumber()
  @IsNotEmpty()
  categoryId!: number;
}
