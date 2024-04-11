import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDataDocument = HydratedDocument<CourseDataEntity>;
@Schema({ timestamps: true, versionKey: false })
export class CourseDataEntity {}

export const CourseDataSchema = SchemaFactory.createForClass(CourseDataEntity);
