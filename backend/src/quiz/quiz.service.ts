import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './quiz.schema';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
  ) {}

  // Create a new question
  async create(data: Partial<Quiz>) {
    const quiz = new this.quizModel(data);
    return quiz.save();
  }

  // Get ALL questions (public — used by mobile app)
  async findAll() {
    return this.quizModel.find().exec();
  }

  // Get one question by ID
  async findOne(id: string) {
    const quiz = await this.quizModel.findById(id);
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  // Update a question
  async update(id: string, data: Partial<Quiz>) {
    const quiz = await this.quizModel.findByIdAndUpdate(id, data, { new: true });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  // Delete a question
  async remove(id: string) {
    const quiz = await this.quizModel.findByIdAndDelete(id);
    if (!quiz) throw new NotFoundException('Quiz not found');
    return { message: 'Quiz deleted successfully' };
  }
}