import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Content } from '../../content/schemas/content.schema';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ required: true })
  name: string;

  // "Child references Parent" - The most scalable way in MongoDB
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ default: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png' })
  avatarUrl: string;

  @Prop({ default: false })
  isKid: boolean;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Content' }] })
  myList: Content[];

  @Prop({
    type: [{
      contentId: { type: String, required: true }, // Store as String to support both TMDB IDs and local ObjectIds
      progress: { type: Number, default: 0 }, // in seconds
      duration: { type: Number, default: 0 }, // in seconds
      lastWatched: { type: Date, default: Date.now },
      title: { type: String }, // Cache title for easier display
      thumbnailUrl: { type: String }, // Cache thumb
    }],
    default: []
  })
  watchHistory: {
    contentId: string;
    progress: number;
    duration: number;
    lastWatched: Date;
    title?: string;
    thumbnailUrl?: string;
  }[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);