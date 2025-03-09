import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
