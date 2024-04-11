import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { QuestionEntity } from '../question/question.entity';

export type CourseDataDocument = HydratedDocument<CourseDataEntity>;
@Schema({ timestamps: true, versionKey: false })
export class CourseDataEntity {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  video_url: string;

  @Prop({ type: Object, required: true })
  video_thumbnail: object;

  @Prop({ type: String, required: true })
  video_section: string;

  @Prop({ type: Number, required: true })
  video_length: number;

  @Prop({ type: String, required: true })
  video_player: string;

  @Prop({
    type: [
      {
        _id: false,
        title: { type: String, required: true, default: null },
        url: { type: String, required: true, default: null },
      },
    ],
  })
  links: object[];

  @Prop({ type: String })
  suggestion: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] })
  questions: QuestionEntity[];
}

export const CourseDataSchema = SchemaFactory.createForClass(CourseDataEntity);
