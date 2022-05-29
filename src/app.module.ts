require('dotenv').config()
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module'
import { ImageModule } from './image/image.module'

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UserModule, ImageModule, MongooseModule.forRoot(process.env.MONGODB_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(UserMiddleware)
  //     .forRoutes('image');
  // }
}
