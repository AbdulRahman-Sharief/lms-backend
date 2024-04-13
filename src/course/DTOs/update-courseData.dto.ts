import { Expose } from 'class-transformer';
import { CreateCourseDataDTO } from './create-courseData.dto';

export class UpdateCourseDataDTO {
  @Expose()
  _id: string;
  @Expose()
  title?: string;
  @Expose()
  description?: string;
  @Expose()
  video_url?: string;
  //   video_thumbnail: object;
  @Expose()
  video_section?: string;
  @Expose()
  video_length?: number;
  //   video_player: string;
  @Expose()
  links?: { title: string; url: string }[];
  //   suggestion: string;
  //   questions?: object;
}
