import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Content, ContentSchema } from './schemas/content.schema';
import { AuthModule } from '../auth/auth.module'; // Needed for protection later

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
    AuthModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}