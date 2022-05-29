import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ unique: true })
    username: string;

    @Prop()
    password: string;

    @Prop({ enum: ['user', 'admin'], default: 'user'})
    role: string;

}

export const UserSchema = SchemaFactory.createForClass(User)
