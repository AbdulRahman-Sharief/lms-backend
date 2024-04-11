import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserEntity } from '../user/user.entity';
import { ReviewEntity } from '../review/review.entity';
import { QuestionEntity } from '../question/question.entity';
import { IsEnum } from 'class-validator';

export type CommentDocument = HydratedDocument<CommentEntity>;
export enum ParentType {
  REVIEW = 'Review',
  QUESTION = 'Question',
}
@Schema({ timestamps: true, versionKey: false })
export class CommentEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: UserEntity;

  @Prop({ type: String, enum: ParentType, required: true })
  @IsEnum(ParentType, {
    message: 'parent_type must be either Review or Question or Comment',
  })
  parent_type: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'parent_type',
    required: true,
  })
  parent: ReviewEntity | QuestionEntity;

  @Prop({ type: String, required: true })
  comment_text: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true,
        default: null,
      },
    ],
  })
  parent_comment: CommentEntity[];
}

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);
