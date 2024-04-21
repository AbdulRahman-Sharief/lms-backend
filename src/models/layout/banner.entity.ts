import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BannerDocument = HydratedDocument<BannerEntity>;

@Schema({ timestamps: true, versionKey: false })
export class BannerEntity {
  @Prop({ type: String, required: true })
  public_id: string;
  @Prop({ type: String, required: true })
  url: string;
}

export const BannerSchema = SchemaFactory.createForClass(BannerEntity);
// This function lets you pull in methods, statics, and virtuals from an ES6 class.
BannerSchema.loadClass(BannerEntity);
