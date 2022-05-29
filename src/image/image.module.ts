import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImageController } from './image.controller';
import { ImageService } from './image.service';

import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { PexelsService } from '../pexels/pexels.service';
import { Image, ImageSchema } from './schemas/image.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }])],
  controllers: [ImageController],
  providers: [ImageService, CloudinaryService, PexelsService],
})
export class ImageModule {}
