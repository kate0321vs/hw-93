import { Model } from 'mongoose';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterUserDto } from './register-user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  register(@Body() registerUserDto: RegisterUserDto) {
    const user = new this.userModel({
      email: registerUserDto.email,
      displayName: registerUserDto.displayName,
      password: registerUserDto.password,
      role: registerUserDto.role,
    });
    user.generateToken();
    return user.save();
  }

  @UseGuards(AuthGuard('local'))
  @Post('/sessions')
  login(@Req() req: Request<{ user: User }>) {
    return req.user;
  }

  @UseGuards(TokenAuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request<{ user: User }>) {
    const user = req.user as UserDocument;
    user.generateToken();
    await user.save();
  }
}
