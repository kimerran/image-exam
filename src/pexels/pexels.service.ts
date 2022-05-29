import { Injectable } from '@nestjs/common';
import { IPexelImage } from './interfaces/pexel-image.interface'
import axios from 'axios'
const rn =  require('random-number')
@Injectable()
export class PexelsService {
    async getRandomImages(): Promise<IPexelImage[]> {
        const page = rn({min: 1, max: 500, integer: true})
        const options = {
            headers: {
                'Authorization': process.env.PEXELS_API_KEY
            }
        }

        const response = await axios.get(`https://api.pexels.com/v1/curated?page=${page}&per_page=10`, options)
        if (response.status === 200) {
            const { photos } = response.data;
            // return photos.map(p => p.src.original)
            return photos.map(p => {
                return {
                    url: p.src.large
                }
            })
        }
        return;
    }
}
