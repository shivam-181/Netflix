import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard'; // Import AdminGuard
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';

@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  // 1. Create Content
  @Post()
  // @UseGuards(AuthGuard('jwt'), AdminGuard) // Temporarily disabled for easy testing/seeding
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  // Admin Delete
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  delete(@Param('id') id: string) {
    return this.contentService.delete(id);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.contentService.search(query);
  }

  // 2. Get a specific movie
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.contentService.getById(id);
  }

  // 3. Get rows (e.g., /content?type=movie&genre=Action)
  @Get()
  getMany(
    @Query('type') type: string,
    @Query('genre') genre: string,
    @Query('search') search: string, // Add this
    @Query('limit') limit: string,
  ) {
    if (search) {
      return this.contentService.search(search); // Call the search method
    }
    return this.contentService.getByFilter(type, genre, limit ? parseInt(limit) : 10);
  }
}