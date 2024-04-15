import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ReviewDocument, ReviewEntity } from 'src/models/review/review.entity';
import { UserDocument } from 'src/models/user/user.entity';
import { CommentDocument } from 'src/models/comment/comment.entity';
import { CourseService } from 'src/course/course.service';
@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private ReviewModel: Model<ReviewEntity>,
    private CourseService: CourseService,
  ) {}

  async createReview(
    user: UserDocument,
    rating: number,
    comment?: CommentDocument,
  ): Promise<ReviewDocument> {
    const reviewEntity = new this.ReviewModel({
      user: user._id,
      rating,
      comment: comment ? comment : null,
    });
    const review = await reviewEntity.save();
    return review;
  }

  async addReviewTextToReview(
    review: ReviewDocument,
    comment: CommentDocument,
  ) {
    review.comment = comment;
    const updatedReview = await review.save();
    return updatedReview;
  }
  async addReviewToCourse(courseId: string, review: ReviewDocument) {
    const course = await this.CourseService.getCourseFromDB(courseId);

    if (!course) throw new HttpException('No such course with that id.', 400);

    course.reviews.push(review);

    let avg = 0;
    course.reviews.forEach((rev: any) => {
      avg += rev.rating;
    });
    course.ratings = avg / course.reviews.length;
    const savedCourse = await course.save();

    return {
      status: 'success',
      savedCourse,
    };
  }

  async addReplyToReview(review: ReviewDocument, reply: CommentDocument) {
    review.reply = reply;
    const updatedReview = await review.save();

    return {
      status: 'success',
      updatedReview: await updatedReview.populate('reply'),
    };
  }

  async getReviewById(reviewId: string): Promise<ReviewDocument> {
    const review = await this.ReviewModel.findById(reviewId).exec();
    if (!review) throw new HttpException('No Review with such id.', 400);
    return review;
  }
}
