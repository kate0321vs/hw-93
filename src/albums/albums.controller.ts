import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlbumDocument } from '../schemas/album.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { RoleAuthGuard } from '../role-auth/role-auth.guard';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel('Album')
    private albumModel: Model<AlbumDocument>,
  ) {}
  @Get()
  getAll(@Query('artist') id_artist?: string) {
    if (id_artist) {
      return this.albumModel.find({ artist: id_artist });
    } else {
      return this.albumModel.find();
    }
  }
  @Get(':id')
  getAlbum(@Param('id') id: string) {
    return this.albumModel.findById({ _id: id });
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/albums' }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      name: createAlbumDto.name,
      artist: createAlbumDto.artist,
      year: createAlbumDto.year,
      image: file ? '/uploads/albums/' + file.filename : null,
    });
    return album.save();
  }
  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.albumModel.deleteOne({ _id: id });
  }
}
