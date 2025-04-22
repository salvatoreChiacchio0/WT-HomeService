import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmpty, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReportDto{

  
    @ApiProperty({example:"A"})
    @IsString()
    @IsNotEmpty()
    readonly report_type: string;

    @ApiProperty({example:"Service Error"})
    @IsString()
    @IsNotEmpty()
    readonly  data: string;




      
      @ApiProperty()
      @IsDate()
      generated_at: Date;
      
      @ApiProperty()
      @IsNumber()
     admin_id: number;

}