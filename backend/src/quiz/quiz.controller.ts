import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  // ✅ PUBLIC — mobile app uses this (no login needed)
  // GET /quiz
  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  // ✅ PUBLIC — get single quiz
  // GET /quiz/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  // 🔐 PROTECTED — admin only routes below
  // POST /quiz
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.quizService.create(body);
  }

  // PUT /quiz/:id
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.quizService.update(id, body);
  }

  // DELETE /quiz/:id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(id);
  }
}