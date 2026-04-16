import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
  @Prop({ required: true, unique: true })
  email: string = '';  // ← added = ''

  @Prop({ required: true })
  password: string = '';  // ← added = ''
}

export const AdminSchema = SchemaFactory.createForClass(Admin);