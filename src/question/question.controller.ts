import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CommentService } from 'src/comment/comment.service';
import { EmailService } from 'src/email/email.service';
import { NotificationService } from 'src/notification/notification.service';

@Controller('question')
export class QuestionController {
  constructor(
    private QuestionService: QuestionService,
    private CommentService: CommentService,
    private EmailService: EmailService,
    private NotificationService: NotificationService,
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
    const response = await this.QuestionService.addQuestionToCourse(
      body.courseId,
      question._id,
      body.contentId,
    );
    //add notification.
    const notification = await this.NotificationService.createNotification(
      'New Question Received',
      `you have a new question in ${response.savedCourseData.title}`,
      user,
    );
    return response;
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
    if (req.user.userId == question.user.toString()) {
      console.log(question.user.email, question.user.name);
      const notification = await this.NotificationService.createNotification(
        'New Question Reply Received',
        `you have a new question reply in ${question.question_text.slice(0, 100)}..`,
        user,
      );
    }
    return await this.QuestionService.addAnswerToQuestion(question, answer);
  }
}
