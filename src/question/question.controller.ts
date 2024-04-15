import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CommentService } from 'src/comment/comment.service';
import { EmailService } from 'src/email/email.service';

@Controller('question')
export class QuestionController {
  constructor(
    private QuestionService: QuestionService,
    private CommentService: CommentService,
    private EmailService: EmailService,
  ) {}
  @Post('/create')
  async createQuestion(
    @Req() req: any,
    @Body()
    body: { courseId: string; question_text: string; contentId: string },
  ) {
    const user = req.user.user;
    //create question.
    const question = await this.QuestionService.createQuestion(
      user,
      body.question_text,
    );
    //add question to course.
    return await this.QuestionService.addQuestionToCourse(
      body.courseId,
      question._id,
      body.contentId,
    );
  }
  @Post('/:questionId/answers/create')
  async createAnswer(
    @Req() req: any,
    @Param('questionId') questionId: string,
    @Body() body: { answer: string },
  ) {
    const user = req.user.user;
    const question = await this.QuestionService.getQuestion(questionId);
    const answer = await this.CommentService.createComment(
      user,
      'Question',
      question,
      body.answer,
      null,
    );
    console.log(question);
    if (req.user.userId !== question.user.toString()) {
      console.log(question.user.email, question.user.name);
      await this.EmailService.Notification(
        { name: question.user.name, email: question.user.email },
        `${question.question_text.substring(0, 100)} ...`,
      );
    }
    return await this.QuestionService.addAnswerToQuestion(question, answer);
  }
}
