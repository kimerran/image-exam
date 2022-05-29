import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
    @Prop({ default: 1})
    hits: number;

    @Prop()
    uri: string;

    @Prop()
    owner: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image)
