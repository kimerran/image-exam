import { Controller, Get, Header, Headers, HttpException, HttpStatus, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PexelsService } from 'src/pexels/pexels.service';
import { UserService } from 'src/user/user.service';

import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update-image.dto'
import { ImageService } from './image.service';
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

@Controller('image')
export class ImageController {
    constructor(
        private readonly imgService: ImageService,
        private readonly pexelSvc: PexelsService,
        private readonly cloudinarySvc: CloudinaryService,
    ) {}

    extractUser(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET)
            return decoded
        } catch (error) {
            throw new HttpException('Token missing or malformed', HttpStatus.UNAUTHORIZED);
        }
    }

    getOwnerIdIfNotAdmin(user) {
        return (user.role ==='user') ? user.id : undefined;
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Headers() headers) {
        const user = this.extractUser(headers.authorization)
        const ownerId = this.getOwnerIdIfNotAdmin(user)

        let result =  await this.imgService.findOne(id, ownerId)
        if (result) {
            await this.imgService.incrementHit(id, result.hits)
            result.hits++;
            return result;
        } else {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        }
    }

    @Post()
    async createImage(@Headers() headers, @Body() createImage: CreateImageDto) {
        const user = this.extractUser(headers.authorization)
        const ownerId = this.getOwnerIdIfNotAdmin(user)

        if (ownerId) {
            await this.imgService.createImage(createImage.uri, ownerId)
        } else {
            // admin: request should have `owner`
            if (createImage.owner) {
                await this.imgService.createImage(createImage.uri, createImage.owner)
            } else {
                throw new HttpException('owner is required for this request', HttpStatus.BAD_REQUEST)
            }
        }
    }

    @Patch(':id')
    async updateImage(@Headers() headers, @Body() updateImage: UpdateImageDto, @Param('id') id: string) {
        const user = this.extractUser(headers.authorization)
        const ownerId = this.getOwnerIdIfNotAdmin(user)

        if (ownerId) {
            // check if owned by user
            const image = await this.imgService.findOne(id, ownerId)
            if (image) {
                return await this.imgService.updateImage(id, updateImage.uri, ownerId)
            } else {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
            }

        } else {
            // admin
            return await this.imgService.updateImage(id, updateImage.uri, updateImage.owner)
        }
    }

    @Delete(':id')
    async deleteImage(@Headers() headers, @Param('id') id: string) {
        const user = this.extractUser(headers.authorization)
        const ownerId = this.getOwnerIdIfNotAdmin(user)

        if (ownerId) {
            // check if owned by user
            const image = await this.imgService.findOne(id, ownerId)
            if (image) {
                return await this.imgService.deleteImage(id)
            } else {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
            }

        } else {
            // admin
            return await this.imgService.deleteImage(id)
        }
    }

    @Get()
    async findAll() {
        const randomImages = await this.pexelSvc.getRandomImages()

        const cloudinaryImageUrls = await this.cloudinarySvc.saveAll(randomImages.map(i => i.url))

        const mongoDbOut = await this.imgService.createImages(cloudinaryImageUrls)

        return {
            limit: mongoDbOut.length,
            data: mongoDbOut
        };
    }


}
