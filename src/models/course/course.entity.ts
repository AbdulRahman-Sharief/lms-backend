import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ReviewEntity } from '../review/review.entity';
import { CourseDataEntity } from './courseData.entity';

export type CourseDocument = HydratedDocument<CourseEntity>;
@Schema({ timestamps: true, versionKey: false })
export class CourseEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number })
  estimatedPrice: number;

  @Prop({
    type: {
      _id: false,
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    // required: true,
  })
  thumbnail: {
    public_id: string;
    url: string;
  };

  @Prop({ type: String, required: true })
  tags: string;

  @Prop({ type: String, required: true })
  level: string;

  @Prop({ type: String, required: true })
  demo_url: string;

  @Prop({ type: [{ _id: false, title: String }] })
  benefits: object[];

  @Prop({ type: [{ _id: false, title: String }] })
  prerequisites: object[];
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    // required: true,
  })
  reviews: ReviewEntity[];
  @Prop({
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'CourseData',
      },
    ],
    // required: true,
  })
  course_data: CourseDataEntity[];

  @Prop({ type: Number, required: true, default: 0 })
  ratings: number;

  @Prop({ type: Number, required: true, default: 0 })
  purchased: number;
}

export const CourseSchema = SchemaFactory.createForClass(CourseEntity);
