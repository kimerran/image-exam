import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const { JWT_SECRET } = process.env;

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    isUserNameValid(username: string) {
        const usernameCheck = Joi.string().required().email();
        const {error} = usernameCheck.validate(username)
        return (error) ? false : true;
    }

    // a. Must be eight characters long
    // b. Must contain at least one uppercase character
    // c. Must contain at least one lowercase character
    // d. Must contain at least one digit
    // e. Must contain at least one special character
    isPasswordValid(plainText: string) {
        const passwordCheck = Joi
            .string()
            .min(8)
            .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)
            .required()

        const {error} = passwordCheck.validate(plainText)
        // console.log('isPasswordValid', error)
        return (error) ? false : true;
    }

    async generatePassword(plainText: string) {
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(plainText, salt)
        return password
    }

    async validatePassword(plainText: string, password: string): Promise<boolean> {
        return await bcrypt.compare(plainText, password)
    }

    async createJWT(username: string) {
        const user = await this.findUser(username);
        const payload = {
            user: user.username,
            role: user.role,
            id: user._id
        }

        const token = jwt.sign(payload, JWT_SECRET);
        return token;
    }

    validateJWT(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET)
        } catch (error) {
        }
    }

    async findAll() {
        return await this.userModel.find().exec()
    }

    async findUser(username: string) {
        const matchingUsers = await this.userModel.find({
            username,
        })
        return matchingUsers.shift();
    }

    async register(username: string, password: string, role: string = 'user') {
        return await this.userModel.create({
            username,
            password,
            role
        })
    }
}
