import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
@UseGuards(AuthGuard()) // Protect ALL routes in this controller
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto, @Req() req) {
    // req.user comes from the JwtStrategy we built earlier
    return this.profilesService.createProfile(createProfileDto, req.user);
  }

  @Get()
  getAll(@Req() req) {
    return this.profilesService.getUserProfiles(req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.profilesService.deleteProfile(id, req.user);
  }

  // --- MY LIST ENDPOINTS ---

  @Get(':id/list')
  getList(@Param('id') id: string, @Req() req) {
     return this.profilesService.getList(id, req.user);
  }

  @Post(':id/list')
  addToList(@Param('id') id: string, @Body() body: { contentId: string; type?: string }, @Req() req) {
    return this.profilesService.addToList(id, { id: body.contentId, type: body.type || 'movie' }, req.user);
  }

  @Delete(':id/list/:contentId')
  removeFromList(
    @Param('id') id: string, 
    @Param('contentId') contentId: string, 
    @Req() req
  ) {
    return this.profilesService.removeFromList(id, contentId, req.user);
  }

  // --- HISTORY ENDPOINTS ---

  @Post(':id/history')
  updateHistory(
    @Param('id') id: string,
    @Body() body: { contentId: string; progress: number; duration: number; title?: string; thumbnailUrl?: string },
    @Req() req
  ) {
    return this.profilesService.updateHistory(id, body, req.user);
  }
}