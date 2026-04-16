import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

class Option {
  @Prop() label: string = '';
  @Prop() text: string = '';
}

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true })
  question: string = '';

  @Prop({ type: [{ label: String, text: String }] })
  options: Option[] = [];

  @Prop({ required: true })
  correctAnswer: string = '';

  @Prop()
  category: string = '';
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);