import { Expose } from 'class-transformer';

export class CreateCourseDataDTO {
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  video_url: string;
  //   video_thumbnail: object;
  @Expose()
  video_section?: string;
  @Expose()
  video_length: number;
  //   video_player: string;
  @Expose()
  links: { title: string; url: string }[];
  //   suggestion: string;
  //   questions?: object;
}
