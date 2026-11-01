import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    Min,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateAppointmentDto {
    @IsInt()
    @Min(1)
    @Type(() => Number)
    specialist_id: number;
  
    @IsInt()
    @Min(1)
    @Type(() => Number)
    service_id: number;
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'تاریخ باید به فرمت YYYY-MM-DD باشد',
    })
    date: string;
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{2}:\d{2}(:\d{2})?$/, {
      message: 'ساعت شروع باید به فرمت HH:mm یا HH:mm:ss باشد',
    })
    start_time: string;
  
    @IsString()
    @IsOptional()
    @MaxLength(500)
    notes?: string;
  }