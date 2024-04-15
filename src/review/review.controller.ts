import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CommentService } from 'src/comment/comment.service';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Roles } from 'src/decorators/Roles.decorator';

@Controller('review')
export class ReviewController {
  constructor(
    private ReviewService: ReviewService,

    private CommentService: CommentService,
  ) {}
  @Post('/create')
  async createReview(
    @Req() req: any,
    @Body()
    body: { courseId: string; review: string; rating: number },
  ) {
    const user = req.user.user;
    //create question.
    const review = await this.ReviewService.createReview(user, body.rating);
    //create commentEntity.
    const comment = await this.CommentService.createComment(
      user,
      'Review',
      review,
      body.review,
      null,
    );
    //add comment to review.
    const updatedReview = await this.ReviewService.addReviewTextToReview(
      review,
      comment,
    );
    const notification = {
      title: 'New Review Received.',
      message: `${req.user.user.name} has given a review of your course.`,
    };

    //add review to course.
    return await this.ReviewService.addReviewToCourse(
      body.courseId,
      updatedReview,
    );
  }
  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @Post('/:reviewId/reply')
  async addReply(
    @Req() req: any,
    @Param('reviewId') reviewId: string,
    @Body() body: { reply: string },
  ) {
    const user = req.user.user;
    const review = await this.ReviewService.getReviewById(reviewId);
    console.log(review.comment);
    const comment = await this.CommentService.getCommentById(
      review.comment.toString(),
    );
    const reply = await this.CommentService.createComment(
      user,
      'Review',
      review,
      body.reply,
      comment,
    );
    console.log(reply);
    return this.ReviewService.addReplyToReview(review, reply);
  }
}
