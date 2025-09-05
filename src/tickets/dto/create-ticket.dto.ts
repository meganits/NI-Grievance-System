import { IsString, IsInt, MinLength, MaxLength } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @MinLength(5)
  @MaxLength(140)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description: string;

  @IsInt()
  categoryId: number;

  @IsInt()
  wardId: number;
}