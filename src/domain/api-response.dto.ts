import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: '0000' })
  code: string;

  @ApiProperty({ example: '' })
  message: string;

  @ApiProperty()
  data: T;
} 