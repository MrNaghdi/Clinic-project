import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
  } from 'class-validator';
  
  export class PromoteSpecialistDto {
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    bio?: string;
  
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    service_ids?: number[];
  }