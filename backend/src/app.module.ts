import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { AdminModule } from './admin/admin.module';
import { QuizSetModule } from './quiz-set/quiz-set.module';
import { UserModule } from './user/user.module';
import { UserAuthModule } from './user-auth/user-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ BETTER: ensures env is loaded properly
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');

        if (!uri) {
          throw new Error('❌ MONGO_URI is not defined in .env');
        }

        return { uri };
      },
    }),

    AuthModule,
    QuizModule,
    AdminModule,
    QuizSetModule,
    UserModule,
    UserAuthModule,
  ],
})
export class AppModule {}