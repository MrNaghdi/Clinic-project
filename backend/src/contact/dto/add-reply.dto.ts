import { IsString, MaxLength, MinLength } from 'class-validator';

export class AddReplyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message: string;
}