import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CommentDocument,
  CommentEntity,
} from 'src/models/comment/comment.entity';
import { QuestionDocument } from 'src/models/question/question.entity';
import { ReviewDocument } from 'src/models/review/review.entity';
import { UserDocument } from 'src/models/user/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private CommentModel: Model<CommentEntity>,
  ) {}

  async createComment(
    user: UserDocument,
    parent_type: string,
    parent: ReviewDocument | QuestionDocument,
    comment_text: string,
    parent_comment: CommentDocument | null,
  ) {
    const CommentEntity = new this.CommentModel({
      user,
      parent_type,
      parent,
      comment_text,
      parent_comment,
    });
    const comment = await CommentEntity.save();
    return comment;
  }
}
