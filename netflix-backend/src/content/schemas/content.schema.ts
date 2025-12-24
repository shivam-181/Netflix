import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContentDocument = Content & Document;

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  // Small image for rows (Portrait)
  @Prop({ required: true })
  thumbnailUrl: string;

  // Large image for Hero section (Landscape)
  @Prop({ required: true })
  backdropUrl: string;

  // "movie" or "series"
  @Prop({ required: true, enum: ['movie', 'series'] })
  type: string;

  @Prop({ required: true })
  genre: string; // e.g., "Action" (Simpler than array for now)

  @Prop({ required: true })
  ageRating: string; // e.g., "18+", "U/A"

  @Prop()
  trailerUrl: string; // For the hover preview

  @Prop({ default: 0 })
  viewCount: number; // To calculate "Trending"

  // Only for Movies
  @Prop()
  videoUrl?: string; 
  
  @Prop()
  duration?: string; // "2h 15m"

  // Only for Series
  @Prop({
    type: [{
      title: { type: String },
      season: { type: Number },
      episode: { type: Number },
      videoUrl: { type: String },
      duration: { type: String },
      thumbnailUrl: { type: String },
      overview: { type: String }
    }],
    default: []
  })
  episodes: {
    title: string;
    season: number;
    episode: number;
    videoUrl: string;
    duration: string;
    thumbnailUrl?: string; // Optional per episode
    overview?: string;
  }[];
}

// Create the Index for faster search
export const ContentSchema = SchemaFactory.createForClass(Content);
ContentSchema.index({ title: 'text', genre: 'text' }); // Enable text search