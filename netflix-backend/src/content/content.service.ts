import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content, ContentDocument } from './schemas/content.schema';
import { CreateContentDto } from './dto/create-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
  ) {}

  async create(createContentDto: CreateContentDto) {
    const newContent = new this.contentModel(createContentDto);
    return newContent.save();
  }

  async getById(id: string) {
    const content = await this.contentModel.findById(id);
    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  // Generic filter for rows like "Action Movies" or "Trending"
  async getByFilter(type?: string, genre?: string, limit: number = 10) {
    const filter: any = {};
    if (type) filter.type = type;
    if (genre) filter.genre = genre;

    // In a real app, "Trending" would sort by viewCount. 
    // Here we sort by createdAt for "New Releases".
    return this.contentModel.find(filter).limit(limit).sort({ createdAt: -1 });
  }

  // Feature: Search
  async search(query: string) {
    return this.contentModel.find({
      $text: { $search: query }, // Uses the index we created
    });
  }

  async delete(id: string) {
    const deleted = await this.contentModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Content not found');
    return { message: 'Content deleted successfully' };
  }
}