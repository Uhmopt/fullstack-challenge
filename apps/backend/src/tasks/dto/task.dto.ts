import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(["PENDING", "IN_PROGRESS", "COMPLETED"])
  status?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
