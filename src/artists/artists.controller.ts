import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ArtistDocument } from '../schemas/artist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel('Artist')
    private artistModel: Model<ArtistDocument>,
  ) {}
  @Get()
  getAll() {
    return this.artistModel.find();
  }
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.artistModel.findById({ _id: id });
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/artists' }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createArtistDto: CreateArtistDto,
  ) {
    console.log(file);
    const artist = new this.artistModel({
      name: createArtistDto.name,
      information: createArtistDto.information,
      image: file ? '/uploads/artists/' + file.filename : null,
    });
    return artist.save();
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.artistModel.deleteOne({ _id: id });
  }
}
