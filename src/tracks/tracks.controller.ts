import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrackDocument } from '../schemas/track.schema';
import { CreateTrackDto } from './create-track.dto';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { RoleAuthGuard } from '../role-auth/role-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel('Track')
    private trackModel: Model<TrackDocument>,
  ) {}
  @Get()
  getAll(@Query('album') id_album?: string) {
    if (id_album) {
      return this.trackModel.find({ album: id_album });
    } else {
      return this.trackModel.find();
    }
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    const track = new this.trackModel({
      album: createTrackDto.album,
      name: createTrackDto.name,
      duration: createTrackDto.duration,
    });
    return track.save();
  }
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.trackModel.deleteOne({ _id: id });
  }
}
