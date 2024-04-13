import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CourseEntity } from 'src/models/course/course.entity';
import { CreateCourseDTO } from './DTOs/create-course.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CourseDataEntity } from 'src/models/course/courseData.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCourseDataDTO } from './DTOs/create-courseData.dto';
import { UpdateCourseDataDTO } from './DTOs/update-courseData.dto';
import { UpdateCourseDTO } from './DTOs/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private CourseModel: Model<CourseEntity>,
    @InjectModel('CourseData') private CourseDataModel: Model<CourseDataEntity>,
    private CloudinaryService: CloudinaryService,
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
}
