import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { CustomValidationPipe } from '../common/validation.pipe';

@Controller('api')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('students')
  @UsePipes(new CustomValidationPipe())
  async create(@Body() createStudentDto: CreateStudentDto): Promise<void> {
    await this.studentsService.createStudent(createStudentDto);
  }
}