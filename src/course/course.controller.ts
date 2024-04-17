import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCourseDTO } from './DTOs/create-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/Roles.decorator';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { CourseService } from './course.service';
import { UpdateCourseDTO } from './DTOs/update-course.dto';
import { Public } from 'src/decorators/Public.decorator';
import { UserService } from 'src/user/user.service';

@Controller('courses')
export class CourseController {
  constructor(
    private CourseService: CourseService,
    private UserService: UserService,
  ) {}
  @UseGuards(RolesGuard)
  @Roles(['admin']) //only allowed for the admin.
  @Post('/course/create')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createCourse(
    @Body() body: CreateCourseDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    thumbnail: Express.Multer.File,
  ) {
    const { name, description, price, estimatedPrice, tags, level, demo_url } =
      body;
    const benefits = JSON.parse(body.benefits as any);
    const prerequisites = JSON.parse(body.prerequisites as any);
    const course_data = JSON.parse(body.course_data as any);
    return await this.CourseService.createCourse({
      name,
      description,
      price,
      estimatedPrice,
      tags,
      level,
      demo_url,
      benefits,
      prerequisites,
      course_data,
      thumbnail,
    });
  }
  @UseGuards(RolesGuard)
  @Roles(['admin']) //only allowed for the admin.
  @Patch('/course/update/:courseId')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateCourse(
    @Body() body: UpdateCourseDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    thumbnail: Express.Multer.File,
    @Param('courseId') courseId: string,
  ) {
    const { name, description, price, estimatedPrice, tags, level, demo_url } =
      body;
    if (body.benefits) body.benefits = JSON.parse(body.benefits as any);
    if (body.prerequisites)
      body.prerequisites = JSON.parse(body.prerequisites as any);
    if (body.course_data)
      body.course_data = JSON.parse(body.course_data as any);
    return await this.CourseService.updateCourse(courseId, {
      ...body,
      thumbnail,
    });
  }
  @Public()
  @Get('/course/:courseId')
  async getSingleCourse(@Param('courseId') courseId: string) {
    return this.CourseService.getSingleCourse(courseId);
  }

  @Get('/course/:courseId/content')
  async getCourseByUser(@Req() req: any, @Param('courseId') courseId: string) {
    const userCoursesList = req.user.user.courses;
    console.log(userCoursesList);
    return this.CourseService.getCourseByUser(userCoursesList, courseId);
  }
  @Public()
  @Get('/all')
  async getAllCourse() {
    return this.CourseService.getAllCourses();
  }

  @Post('/course/add-to-user')
  async addCourseToUser(@Req() req: any, @Body() body: { courseId: string }) {
    const user = await this.UserService.findUserById(req.user.userId);
    const course = await this.CourseService.getCourseFromDB(body.courseId);
    return await this.CourseService.addCourseToUser(course, user);
  }

  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @Get('/all/admin')
  async getAllCoursesForAdmin() {
    return await this.CourseService.getAllCoursesForAdmin();
  }
}
