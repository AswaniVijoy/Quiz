import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { QuizSetService } from './quiz-set.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quiz-sets')
export class QuizSetController {
  constructor(private quizSetService: QuizSetService) {}

  // PUBLIC — mobile app uses these
  @Get()
  findAll() { return this.quizSetService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.quizSetService.findOne(id); }

  // PROTECTED — admin only
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) { return this.quizSetService.create(body); }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.quizSetService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.quizSetService.remove(id); }

  @UseGuards(JwtAuthGuard)
  @Post(':id/questions/:questionId')
  addQuestion(@Param('id') id: string, @Param('questionId') questionId: string) {
    return this.quizSetService.addQuestion(id, questionId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/questions/:questionId')
  removeQuestion(@Param('id') id: string, @Param('questionId') questionId: string) {
    return this.quizSetService.removeQuestion(id, questionId);
  }
}