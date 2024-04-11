import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';

export type QuestionDocument = HydratedDocument<QuestionEntity>;
@Schema({ timestamps: true, versionKey: false })
export class QuestionEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: UserEntity;
  @Prop({ type: String, required: true })
  question_text: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  answers: CommentEntity[];
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionEntity);
