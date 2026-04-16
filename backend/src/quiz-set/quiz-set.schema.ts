import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizSetDocument = QuizSet & Document;

@Schema({ timestamps: true })
export class QuizSet {
  @Prop({ required: true })
  title: string = '';           // e.g. "General Knowledge"

  @Prop()
  description: string = '';     // e.g. "Test your general knowledge!"

  @Prop()
  category: string = '';        // e.g. "General"

  @Prop({ type: [String], default: [] })
  questionIds: string[] = [];   // array of Quiz _id references
}

export const QuizSetSchema = SchemaFactory.createForClass(QuizSet);