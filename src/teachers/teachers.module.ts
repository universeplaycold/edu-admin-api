import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/entities/students.entity';
import { Teacher } from './entites/teachers.entity';
import { StudentTeacher } from '../students/entities/student-teacher.entity';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher, StudentTeacher, Student]),
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}