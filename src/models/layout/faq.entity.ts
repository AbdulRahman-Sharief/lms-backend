import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FAQDocument = HydratedDocument<FAQEntity>;

@Schema({ timestamps: true, versionKey: false })
export class FAQEntity {
  @Prop({ type: String, required: true, unique: true })
  question: string;
  @Prop({ type: String, required: true })
  answer: string;
}

export const FAQSchema = SchemaFactory.createForClass(FAQEntity);
// This function lets you pull in methods, statics, and virtuals from an ES6 class.
FAQSchema.loadClass(FAQEntity);
