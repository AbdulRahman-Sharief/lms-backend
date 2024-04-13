import { Expose } from 'class-transformer';
import { CreateCourseDataDTO } from './create-courseData.dto';

export class CreateCourseDTO {
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  price: number;
  @Expose()
  estimatedPrice?: number;
  @Expose()
  course_data: CreateCourseDataDTO[];
  @Expose()
  tags: string;
  @Expose()
  level: string;
  @Expose()
  demo_url: string;
  @Expose()
  benefits: { title: string }[];
  @Expose()
  prerequisites: { title: string }[];
}
