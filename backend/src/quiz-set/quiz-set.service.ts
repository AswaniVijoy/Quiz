import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizSet, QuizSetDocument } from './quiz-set.schema';

@Injectable()
export class QuizSetService {
  constructor(
    @InjectModel(QuizSet.name) private quizSetModel: Model<QuizSetDocument>,
  ) {}

  async create(data: Partial<QuizSet>) {
    const quizSet = new this.quizSetModel(data);
    return quizSet.save();
  }

  async findAll() {
    return this.quizSetModel.find().exec();
  }

  async findOne(id: string) {
    const quizSet = await this.quizSetModel.findById(id);
    if (!quizSet) throw new NotFoundException('Quiz set not found');
    return quizSet;
  }

  async update(id: string, data: Partial<QuizSet>) {
    const quizSet = await this.quizSetModel.findByIdAndUpdate(id, data, { new: true });
    if (!quizSet) throw new NotFoundException('Quiz set not found');
    return quizSet;
  }

  async remove(id: string) {
    const quizSet = await this.quizSetModel.findByIdAndDelete(id);
    if (!quizSet) throw new NotFoundException('Quiz set not found');
    return { message: 'Quiz set deleted' };
  }

  // Add a question ID to a quiz set
  async addQuestion(id: string, questionId: string) {
    const quizSet = await this.quizSetModel.findByIdAndUpdate(
      id,
      { $addToSet: { questionIds: questionId } },
      { new: true },
    );
    if (!quizSet) throw new NotFoundException('Quiz set not found');
    return quizSet;
  }

  // Remove a question ID from a quiz set
  async removeQuestion(id: string, questionId: string) {
    const quizSet = await this.quizSetModel.findByIdAndUpdate(
      id,
      { $pull: { questionIds: questionId } },
      { new: true },
    );
    if (!quizSet) throw new NotFoundException('Quiz set not found');
    return quizSet;
  }
}