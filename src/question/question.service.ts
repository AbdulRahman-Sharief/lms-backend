import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CourseService } from 'src/course/course.service';
import { CommentDocument } from 'src/models/comment/comment.entity';
import { CourseEntity } from 'src/models/course/course.entity';
import {
  QuestionDocument,
  QuestionEntity,
} from 'src/models/question/question.entity';
import { UserDocument, UserEntity } from 'src/models/user/user.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel('Question') private QuestionModel: Model<QuestionEntity>,
    private CourseService: CourseService,
  ) {}
  async createQuestion(
    user: UserDocument,
    question_text: string,
  ): Promise<QuestionDocument> {
    const questionEntity = new this.QuestionModel({
      user: user._id,
      question_text,
    });
    const question = await questionEntity.save();
    return question;
  }

  async addQuestionToCourse(
    courseId: string,
    questionId: mongoose.Types.ObjectId,
    contentId: string,
  ) {
    const course = await this.CourseService.getCourseFromDB(courseId);
    if (!mongoose.Types.ObjectId.isValid(contentId))
      throw new HttpException('Invalid contentId.', 400);
    const courseContent = course.course_data.find((item: any) =>
      item.equals(contentId),
    );
    if (!courseContent)
      throw new HttpException(
        'This contentId doesnot belong to this course.',
        400,
      );

    const courseData = await this.CourseService.getCourseDataFromDB(contentId);
    const question = await this.QuestionModel.findById(questionId).exec();
    courseData.questions.push(question);
    const savedCourseData = await courseData.save();
    return {
      status: 'success',
      savedCourseData,
    };
  }

  async getQuestion(questionId: string) {
    const question = await this.QuestionModel.findById(questionId)
      .populate('user')
      .exec();
    if (!question)
      throw new HttpException('There is no question with such id.', 400);

    return question;
  }

  async addAnswerToQuestion(
    question: QuestionDocument,
    answer: CommentDocument,
  ) {
    question.answers.push(answer);
    const savedQuestion = await question.save();
    return {
      status: 'success',
      savedQuestion,
    };
  }
}
