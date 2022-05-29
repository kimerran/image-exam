import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const { ObjectId } = require('mongodb');

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PexelsService } from 'src/pexels/pexels.service';
import { Image, ImageDocument } from './schemas/image.schema'

@Injectable()
export class ImageService {
    constructor(
        @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>
    ) {}

    async createImages(urls: string[]) {
        const newDocuments = urls.map((url) => {
            return {uri: url}
        })
        return await this.imageModel.create(newDocuments)
    }

    async findOne(id: string, ownerId?: string) {
        let query:any = { _id: id }
        if (ownerId) query.owner = ownerId;
        console.log('query',query)
        return this.imageModel.findOne(query)
    }

    async incrementHit(id: string, lastHit: number) {
        // const image = await this.imageModel.findById(id);
        return await this.imageModel.findByIdAndUpdate(id, {hits: lastHit+1})
    }

    async createImage(uri: string, ownerId: string) {
        return await this.imageModel.create({
            owner: ownerId,
            uri,
        })
    }

    async updateImage(id: string, uri: string, ownerId: string) {
        let patch: any = {}

        if (uri) patch.uri = uri;
        if (ownerId) patch.owner = ownerId;

        return await this.imageModel.findByIdAndUpdate(id, patch);
    }

    async deleteImage(id: string) {
        return await this.imageModel.findByIdAndRemove(id)
    }

}
