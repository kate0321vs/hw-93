import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest<Request>();

    const token = req.get('Authorization');
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user: UserDocument | null = await this.userModel.findOne({ token });

    if (!user) {
      throw new UnauthorizedException('Invalid Token');
    }

    req.user = user;
    return true;
  }
}
