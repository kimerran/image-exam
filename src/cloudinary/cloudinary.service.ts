import { Injectable } from '@nestjs/common';
const cloudinary = require('cloudinary');

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUDNAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
          });
    }

    saveAll(urls: string[]) {
        const savePromises: Promise<string>[] = urls.map(url => {
            return new Promise((resolve, reject) => {
                const options = {}
                cloudinary.v2.uploader.upload(url, options, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.url);
                    }
                });
            });
        });

        return Promise.all(savePromises)
    }
}
