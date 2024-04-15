import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';

export type ReviewDocument = HydratedDocument<ReviewEntity>;
@Schema({ timestamps: true, versionKey: false })
export class ReviewEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: UserEntity;

  @Prop({ required: true })
  rating: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    // required: true,
    default: null,
  })
  comment: CommentEntity;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Comment' })
  reply: CommentEntity;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewEntity);
