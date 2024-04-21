import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LayoutService } from './layout.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { title } from 'process';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Roles } from 'src/decorators/Roles.decorator';
import { Public } from 'src/decorators/Public.decorator';

@Controller('layout')
export class LayoutController {
  constructor(
    private LayoutService: LayoutService,
    private CloudinaryService: CloudinaryService,
  ) {}
  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @Post('/create')
  async createLayout(@Body() body: { type: 'FAQs' | 'Categories' | 'Banner' }) {
    return this.LayoutService.createLayout(body.type);
  }
  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @Patch('/update')
  @UseInterceptors(FileInterceptor('bannerImage'))
  async updateLayout(
    @Body()
    body: {
      type: string;
      category?: { title: string };
      faq?: { question: string; answer: string };
      banner?: { title: string; subTitle: string };
    },
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
    bannerImage: Express.Multer.File,
  ) {
    const { type } = body;

    if (type == 'Banner') {
      body.banner = JSON.parse(body.banner as any);
      console.log(body);
      //   body.banner.subTitle = JSON.parse(body.banner.subTitle as any);
      let createdBanner;
      if (bannerImage) {
        const banner = await this.CloudinaryService.uploadImage(bannerImage, {
          resource_type: 'image',
          folder: 'LMS/banner/',
          public_id: `${bannerImage.originalname}-banner`,
        });

        createdBanner = await this.LayoutService.createBanner(
          banner.public_id,
          banner.secure_url,
        );
      }

      const data = {
        image: createdBanner,
        title: body.banner.title,
        subTitle: body.banner.subTitle,
      };
      const layout = await this.LayoutService.addToLayout(type, data);
      return {
        status: 'success',
        layout,
      };
    } else if (type == 'FAQs') {
      body.faq = JSON.parse(body.faq as any);
      const faq = await this.LayoutService.createFAQ(
        body.faq.question,
        body.faq.answer,
      );

      const layout = await this.LayoutService.addToLayout(type, faq);
      return {
        status: 'success',
        layout,
      };
    } else if (type == 'Categories') {
      body.category = JSON.parse(body.category as any);
      //   console.log(body);
      const category = await this.LayoutService.createCategory(
        body.category.title,
      );
      //   console.log(category);
      const layout = await this.LayoutService.addToLayout(type, category);
      return {
        status: 'success',
        layout,
      };
    }
  }
  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @Patch('/faq/:faqId/update')
  async updateFAQ(
    @Param('faqId') faqId: string,
    @Body() body: { question?: string; answer?: string },
  ) {
    return await this.LayoutService.updateFAQ(faqId, body);
  }
  @UseGuards(RolesGuard)
  @Roles(['admin'])
  @Patch('/category/:categoryId/update')
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() body: { title?: string },
  ) {
    return await this.LayoutService.updateCategory(categoryId, body);
  }

  @Public()
  @Get('/:type')
  async getLayoutByType(@Param('type') type: string) {
    return await this.LayoutService.getLayoutByType(type);
  }
}
