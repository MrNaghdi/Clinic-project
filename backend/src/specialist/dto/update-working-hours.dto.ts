import {
    IsArray,
    IsInt,
    IsString,
    Matches,
    Min,
    Max,
    ValidateNested,
    ArrayMinSize,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class WorkingHoursItem {
    @IsInt()
    @Min(0)
    @Max(6)
    day_of_week: number;
  
    @IsString()
    @Matches(/^\d{2}:\d{2}(:\d{2})?$/, {
      message: 'ساعت شروع باید به فرمت HH:mm یا HH:mm:ss باشد',
    })
    start_time: string;
  
    @IsString()
    @Matches(/^\d{2}:\d{2}(:\d{2})?$/, {
      message: 'ساعت پایان باید به فرمت HH:mm یا HH:mm:ss باشد',
    })
    end_time: string;
  }
  
  export class UpdateWorkingHoursDto {
    @IsArray()
    @ArrayMinSize(1, { message: 'حداقل یک روز باید انتخاب شود' })
    @ValidateNested({ each: true })
    @Type(() => WorkingHoursItem)
    working_hours: WorkingHoursItem[];
  }