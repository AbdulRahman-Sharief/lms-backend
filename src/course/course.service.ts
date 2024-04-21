import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CourseDocument, CourseEntity } from 'src/models/course/course.entity';
import { CreateCourseDTO } from './DTOs/create-course.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CourseDataEntity } from 'src/models/course/courseData.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCourseDataDTO } from './DTOs/create-courseData.dto';
import { UpdateCourseDataDTO } from './DTOs/update-courseData.dto';
import { UpdateCourseDTO } from './DTOs/update-course.dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { UserDocument } from 'src/models/user/user.entity';
import { generateLast12MonthsData } from 'src/common/utils/analytics.generator';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private CourseModel: Model<CourseEntity>,
    @InjectModel('CourseData') private CourseDataModel: Model<CourseDataEntity>,
    private CloudinaryService: CloudinaryService,
    private readonly redisCacheService: RedisCacheService,
  ) {}
  async createCourseData(course_data: CreateCourseDataDTO[]) {
    const data = [];
    for (const courseDataObject in course_data) {
      const courseDataEntity = new this.CourseDataModel(
        course_data[courseDataObject],
      );
      const courseData = await courseDataEntity.save();
      data.push(courseData._id);
    }
    return data;
  }
  async updateCourseData(course_data: UpdateCourseDataDTO[]) {
    const data = [];
    for (const courseDataObject in course_data) {
      const { _id, ...dataToUpdate } = course_data[courseDataObject];
      const courseData = await this.CourseDataModel.findByIdAndUpdate(
        _id,
        { $set: dataToUpdate },
        { new: true },
      );
    }
    return data;
  }
  async createCourse({
    name,
    description,
    price,
    estimatedPrice,
    tags,
    level,
    demo_url,
    benefits,
    prerequisites,
    thumbnail,
    course_data,
  }: CreateCourseDTO & { thumbnail?: Express.Multer.File }) {
    let uploadedThumbnail;
    let courseThumbnail;
    if (thumbnail) {
      uploadedThumbnail = await this.CloudinaryService.uploadImage(thumbnail, {
        resource_type: 'image',
        folder: 'LMS/thumbnail/',
        public_id: `${name
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .split(' ')
          .join('-')}-thumbnail`,
      }).catch((error) => {
        throw new BadRequestException(error.message);
      });
      courseThumbnail = {
        public_id: uploadedThumbnail.public_id,
        url: uploadedThumbnail.secure_url,
      };
    }
    const course_data_ids = await this.createCourseData(course_data);
    const courseEntity = new this.CourseModel({
      name,
      description,
      price,
      estimatedPrice,
      tags,
      level,
      demo_url,
      benefits,
      prerequisites,
      course_data: course_data_ids,
      thumbnail: courseThumbnail ? courseThumbnail : undefined,
    });
    const course = await courseEntity.save();

    return { status: 'success', course: await course.populate('course_data') };
  }
  async updateCourse(courseId: string, dataToUpdate: UpdateCourseDTO) {
    let uploadedThumbnail;
    let courseThumbnail;
    if (dataToUpdate.thumbnail) {
      const course = await this.CourseModel.findById(courseId).exec();
      console.log('course: ', course);
      if (course.thumbnail) {
        await this.CloudinaryService.destroyImage(course.thumbnail.public_id);
      }
      uploadedThumbnail = await this.CloudinaryService.uploadImage(
        dataToUpdate.thumbnail,
        {
          resource_type: 'image',
          folder: 'LMS/thumbnail/',
          public_id: `${course.name
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .split(' ')
            .join('-')}-thumbnail`,
        },
      ).catch((error) => {
        throw new BadRequestException(error.message);
      });
      courseThumbnail = {
        public_id: uploadedThumbnail.public_id,
        url: uploadedThumbnail.secure_url,
      };
    }
    const { course_data, thumbnail, ...updateData } = dataToUpdate;

    const data_to_update = courseThumbnail
      ? { ...updateData, thumbnail: courseThumbnail }
      : { ...updateData };
    if (course_data) {
      const course_data_ids = await this.updateCourseData(course_data);
    }

    const course = this.CourseModel.findByIdAndUpdate(
      courseId,
      { $set: data_to_update },
      { new: true },
    );

    return { status: 'success', course: await course.populate('course_data') };
  }
  async getSingleCourse(courseId: string) {
    const cachedCourse = await this.redisCacheService.getValue(courseId);
    if (cachedCourse) {
      const course = JSON.parse(cachedCourse);
      console.log('course Form Cache: ', course);
      return {
        status: 'success',
        course,
      };
    }
    const course = await this.CourseModel.findById(courseId)
      .populate('course_data', '-video_url -suggestion -questions -links')
      .exec();
    console.log('course Form DB: ', course);
    await this.redisCacheService.setValue(courseId, JSON.stringify(course));
    return { status: 'success', course };
  }
  async getAllCourses() {
    const cachedCourses = await this.redisCacheService.getValue('allCourses');
    if (cachedCourses) {
      const courses = JSON.parse(cachedCourses);
      console.log('all courses Form Cache: ', courses);
      return {
        status: 'success',
        courses,
      };
    }
    const courses = await this.CourseModel.find()
      .populate('course_data', '-video_url -suggestion -questions -links')
      .exec();
    console.log('all courses Form DB: ', courses);

    await this.redisCacheService.setValue(
      'allCourses',
      JSON.stringify(courses),
    );
    return { status: 'success', courses };
  }

  async getCourseByUser(userCoursesList: string[], courseId: string) {
    const courseExists = userCoursesList.find(
      (course: any) => course.toString() === courseId,
    );

    if (!courseExists)
      throw new HttpException(
        'You are not eligible to access this course.',
        401,
      );

    // const cachedCourse = await this.redisCacheService.getValue(courseId);
    // const course = cachedCourse
    //   ? JSON.parse(cachedCourse)
    //   : await this.CourseModel.findById(courseId).exec();
    // const content = course.course_data;
    // if (!cachedCourse) {
    //   await this.redisCacheService.setValue(courseId, JSON.stringify(course));
    // }
    const course = await this.CourseModel.findById(courseId)
      .populate('course_data')
      .exec();
    const content = course.course_data;

    return {
      status: 'success',
      content,
    };
  }

  async getCourseFromDB(courseId: string) {
    const course = await this.CourseModel.findById(courseId).exec();
    if (!course) throw new HttpException('No Course with such id.', 400);
    return course;
  }
  async getCourseDataFromDB(courseId: string) {
    const courseContent = await this.CourseDataModel.findById(courseId).exec();
    if (!courseContent) throw new HttpException('No Course with such id.', 400);
    return courseContent;
  }

  async addCourseToUser(course: CourseDocument, user: UserDocument) {
    user.courses.push(course);
    console.log(user);
    const savedUser = await user.save();
    return {
      status: 'success',
      savedUser,
    };
  }

  async getAllCoursesForAdmin() {
    const courses = await this.CourseModel.find().sort({ createdAt: -1 });
    return courses;
  }

  async deleteCourse(courseId: string) {
    try {
      const course = await this.CourseModel.findById(courseId);
      const deleted = await course.deleteOne({ courseId });
      console.log(deleted);
      await this.redisCacheService.delValue(courseId);
    } catch (error) {
      console.log(error);
    }
  }

  async getCourseAnalytics() {
    return await generateLast12MonthsData(this.CourseModel);
  }
}
