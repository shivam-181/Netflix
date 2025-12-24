import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto, user: UserDocument) {
    // 1. Check if user already has 4 profiles
    // We use "countDocuments" which is faster than fetching all data
    const count = await this.profileModel.countDocuments({ userId: user._id } as any);
    
    if (count >= 4) {
      throw new BadRequestException('You can only have up to 4 profiles.');
    }

    // 2. Create the profile
    const newProfile = new this.profileModel({
      ...createProfileDto,
      avatarUrl: createProfileDto.avatarUrl || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
      userId: user._id, // Link to the logged-in user
    });

    return newProfile.save();
  }

  async getUserProfiles(user: UserDocument) {
    return this.profileModel.find({ userId: user._id } as any);
  }

  async deleteProfile(profileId: string, user: UserDocument) {
    // Ensure the user owns the profile they are trying to delete
    const profile = await this.profileModel.findOneAndDelete({ 
      _id: profileId, 
      userId: user._id 
    } as any);

    if (!profile) {
      throw new BadRequestException('Profile not found or you do not have permission.');
    }
    return { message: 'Profile deleted successfully' };
  }

  async addToList(profileId: string, contentId: string, user: UserDocument) {
    const profile = await this.profileModel.findOne({ _id: profileId, userId: user._id } as any);
    if (!profile) throw new BadRequestException('Profile not found');

    // Add to set (avoid duplicates)
    return this.profileModel.findByIdAndUpdate(
      profileId,
      { $addToSet: { myList: contentId } },
      { new: true }
    ).populate('myList');
  }

  async removeFromList(profileId: string, contentId: string, user: UserDocument) {
    const profile = await this.profileModel.findOne({ _id: profileId, userId: user._id } as any);
    if (!profile) throw new BadRequestException('Profile not found');

    return this.profileModel.findByIdAndUpdate(
      profileId,
      { $pull: { myList: contentId } },
      { new: true }
    ).populate('myList');
  }

  async getList(profileId: string, user: UserDocument) {
    const profile = await this.profileModel.findOne({ _id: profileId, userId: user._id } as any).populate('myList');
    if (!profile) throw new BadRequestException('Profile not found');
    return profile.myList;
  }
  async updateHistory(
    profileId: string, 
    data: { contentId: string; progress: number; duration: number; title?: string; thumbnailUrl?: string },
    user: UserDocument
  ) {
    const profile = await this.profileModel.findOne({ _id: profileId, userId: user._id } as any);
    if (!profile) throw new BadRequestException('Profile not found');

    // 1. Remove existing entry for this content (to move it to top)
    await this.profileModel.updateOne(
        { _id: profileId },
        { $pull: { watchHistory: { contentId: data.contentId } } }
    );

    // 2. Push new entry to the front
    return this.profileModel.findByIdAndUpdate(
        profileId,
        { 
          $push: { 
            watchHistory: {
               $each: [{ ...data, lastWatched: new Date() }],
               $position: 0 // Add to TOP
            } 
          } 
        },
        { new: true }
    );
  }
}