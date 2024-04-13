import { Expose } from 'class-transformer';
import { CreateCourseDataDTO } from './create-courseData.dto';
import { UpdateCourseDataDTO } from './update-courseData.dto';

export class UpdateCourseDTO {
  @Expose()
  name?: string;
  @Expose()
  description?: string;
  @Expose()
  price?: number;
  @Expose()
  estimatedPrice?: number;
  @Expose()
  course_data?: UpdateCourseDataDTO[];
  @Expose()
  tags?: string;
  @Expose()
  level?: string;
  @Expose()
  demo_url?: string;
  @Expose()
  benefits?: { title: string }[];
  @Expose()
  prerequisites?: { title: string }[];
  @Expose()
  thumbnail?: Express.Multer.File;
}
