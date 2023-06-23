import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './entities/students.entity';
import { StudentTeacher } from './entities/student-teacher.entity';
import { Teacher } from '../teachers/entites/teachers.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher, StudentTeacher, ])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
