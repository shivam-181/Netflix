// src/auth/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Typescript type for the User Document
export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Adds createdAt, updatedAt automatically
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // We will store the HASH here, not plain text

  @Prop({ default: false })
  isAdmin: boolean;

  // We will add 'profiles' relation later when we build the Profile module
}

export const UserSchema = SchemaFactory.createForClass(User);