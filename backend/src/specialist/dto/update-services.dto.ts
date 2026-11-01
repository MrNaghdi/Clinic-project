import { IsArray, IsInt } from 'class-validator';

export class UpdateServicesDto {
  @IsArray()
  @IsInt({ each: true })
  service_ids: number[];
}