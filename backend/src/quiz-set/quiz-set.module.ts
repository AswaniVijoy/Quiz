import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSet, QuizSetSchema } from './quiz-set.schema';
import { QuizSetService } from './quiz-set.service';
import { QuizSetController } from './quiz-set.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QuizSet.name, schema: QuizSetSchema }]),
    AuthModule,
  ],
  providers: [QuizSetService],
  controllers: [QuizSetController],
})
export class QuizSetModule {}