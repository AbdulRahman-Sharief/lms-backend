import { Module } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { LayoutController } from './layout.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  providers: [LayoutService],
  controllers: [LayoutController],
})
export class LayoutModule {}
