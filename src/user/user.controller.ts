import { Controller, Get, Post, Headers, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private readonly userSvc: UserService) {}

    @Post()
    async register(@Headers() headers, @Body() createUserDto: CreateUserDto) {
        const existingUser = await this.userSvc.findUser(createUserDto.username);
        if (existingUser) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
        } else {
            // validate credentials
            const isValidUser = this.userSvc.isUserNameValid(createUserDto.username);
            const isValidPassword = this.userSvc.isPasswordValid(createUserDto.password);

            if (isValidUser && isValidPassword) {
                const generatedPassword = await this.userSvc.generatePassword(createUserDto.password)
                await this.userSvc.register(createUserDto.username, generatedPassword, createUserDto.role);
                return {username: createUserDto.username, message: 'User created'}
            } else {
                throw new HttpException('Invalid user or password', HttpStatus.BAD_REQUEST)
            }
        }
    }

    @Post('login')
    async login(@Body() createUserDto: CreateUserDto) {
        const matchingUser = await this.userSvc.findUser(createUserDto.username);

        if (matchingUser) {
            const isPwValid = await this.userSvc.validatePassword(createUserDto.password, matchingUser.password)
            return (isPwValid)
                ? this.userSvc.createJWT(createUserDto.username)
                : new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        } else {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        }
    }
}
