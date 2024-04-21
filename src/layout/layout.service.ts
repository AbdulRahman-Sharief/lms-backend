import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BannerDocument, BannerEntity } from 'src/models/layout/banner.entity';
import {
  CategoryDocument,
  CategoryEntity,
} from 'src/models/layout/category.entity';
import { FAQDocument, FAQEntity } from 'src/models/layout/faq.entity';
import { LayoutEntity } from 'src/models/layout/layout.entity';

@Injectable()
export class LayoutService {
  constructor(
    @InjectModel('FAQ') private readonly FAQModel: Model<FAQEntity>,
    @InjectModel('Category')
    private readonly CategoryModel: Model<CategoryEntity>,
    @InjectModel('Banner') private readonly BannerModel: Model<BannerEntity>,
    @InjectModel('Layout') private readonly LayoutModel: Model<LayoutEntity>,
  ) {}
  async createLayout(type: string) {
    try {
      const isTypeExist = await this.LayoutModel.findOne({ type });
      if (isTypeExist) throw new HttpException(`${type} already exist.`, 400);

      const layoutDocument = new this.LayoutModel({ type });
      const layout = await layoutDocument.save();
      return layout;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 400);
    }
  }

  async createFAQ(question: string, answer: string): Promise<FAQDocument> {
    const exist = await this.FAQModel.findOne({ question, answer });
    if (exist) throw new HttpException('this faq already exists.', 500);
    const faqDocument = new this.FAQModel({ question, answer });
    const faq = await faqDocument.save();
    return faq;
  }
  async createCategory(title: string): Promise<CategoryDocument> {
    const exist = await this.CategoryModel.findOne({ title });
    if (exist) throw new HttpException('this category already exists.', 500);
    const CategoryDocument = new this.CategoryModel({ title });
    const Category = await CategoryDocument.save();
    return Category;
  }
  async createBanner(public_id: string, url: string): Promise<BannerDocument> {
    // const exist = await this.BannerModel.findOne({ public_id, url });
    // if (exist) throw new HttpException('this banner already exists.', 500);
    const BannerDocument = new this.BannerModel({ public_id, url });
    const banner = await BannerDocument.save();
    return banner;
  }

  async updateFAQ(id: string, data: { question?: string; answer?: string }) {
    const faq = await this.FAQModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true },
    );
    return faq;
  }
  async updateCategory(id: string, data: { title?: string }) {
    const category = await this.CategoryModel.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true },
    );
    return category;
  }
  //   async updateBanner(id: string, data: { public_id: string; url: string }) {
  //     const banner = await this.BannerModel.findByIdAndUpdate(id, { ...data });
  //     return banner;
  //   }
  async addToLayout(type: string, data: any) {
    const layout = await this.LayoutModel.findOne({ type });
    console.log(layout);
    if (type === 'Banner') {
      layout.banner = {
        image: data.image ? data.image : layout.banner,
        title: data.title ? data.title : layout.banner.title,
        subTitle: data.subTitle ? data.subTitle : layout.banner.subTitle,
      };
      console.log(layout);
    } else if (type === 'Categories') {
      //   console.log(layout.categories);
      if (!layout.categories) layout.categories = [];
      // if(layout.categories.includes(data.title)) throw new HttpException('This category already exists.',500)
      layout.categories.push(data);
    } else if (type === 'FAQs') {
      if (!layout.faqs) layout.faqs = [];

      layout.faqs.push(data);
    }

    const updatedLayout = await layout.save();
    return updatedLayout;
  }

  async getLayoutByType(type: string) {
    try {
      const layout = (await this.LayoutModel.findOne({ type })).populate(
        type === 'FAQs'
          ? 'faqs'
          : type === 'Categories'
            ? 'categories'
            : 'banner',
      );
      return layout;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 500);
    }
  }
}
