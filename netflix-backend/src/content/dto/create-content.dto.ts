import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateContentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  thumbnailUrl: string;

  @IsNotEmpty()
  @IsString()
  backdropUrl: string;

  @IsNotEmpty()
  @IsEnum(['movie', 'series'])
  type: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsString()
  ageRating: string;

  @IsNotEmpty()
  @IsUrl()
  trailerUrl: string;
  
  // Optional because Series won't have this on the main document
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  duration?: string;
}