import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<CourseEntity>;
@Schema({ timestamps: true, versionKey: false })
export class CourseEntity {}

export const CourseSchema = SchemaFactory.createForClass(CourseEntity);
