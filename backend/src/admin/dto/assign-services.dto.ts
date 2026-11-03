import { IsArray, IsInt } from 'class-validator';

export class AssignServicesDto {
  @IsArray()
  @IsInt({ each: true })
  service_ids: number[];
}