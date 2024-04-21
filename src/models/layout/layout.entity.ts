import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { FAQEntity } from './faq.entity';
import { CategoryEntity } from './category.entity';
import { BannerEntity } from './banner.entity';

export type LayoutDocument = HydratedDocument<LayoutEntity>;

@Schema({ timestamps: true, versionKey: false })
export class LayoutEntity {
  @Prop({ type: String, required: true, unique: true })
  type: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FAQ' }],
    default: undefined,
  })
  faqs?: FAQEntity[];
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    default: undefined,
  })
  categories?: CategoryEntity[];
  @Prop({
    type: {
      image: { type: mongoose.Schema.Types.ObjectId, ref: 'Banner' },
      title: { type: String, required: true },
      subTitle: { type: String, required: true },
    },
    default: undefined,
  })
  banner?: {
    image: BannerEntity;
    title: string;
    subTitle: string;
  };
}

export const LayoutSchema = SchemaFactory.createForClass(LayoutEntity);
// This function lets you pull in methods, statics, and virtuals from an ES6 class.
LayoutSchema.loadClass(LayoutEntity);
