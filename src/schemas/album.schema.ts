import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Artist, ArtistDocument } from './artist.schema';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Artist.name,
  })
  artist: ArtistDocument;
  @Prop({ required: true })
  year: string;
  @Prop({ default: null, type: String })
  image: string | null;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
