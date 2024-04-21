import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<CategoryEntity>;

@Schema({ timestamps: true, versionKey: false })
export class CategoryEntity {
  @Prop({ type: String, required: true, unique: true })
  title: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryEntity);
// This function lets you pull in methods, statics, and virtuals from an ES6 class.
CategorySchema.loadClass(CategoryEntity);
