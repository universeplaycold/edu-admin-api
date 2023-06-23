import { Controller, Post, Body, UsePipes, HttpStatus, Res, Query, Get} from '@nestjs/common';
import { Response } from 'express';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { DeregisterDto } from './dto/deregister-students.dto'
import { RegisterStudentsDto } from './dto/register-students.dto';
import { TeacherWithStudents } from './interface/teacher-with-students.interface'
import { CustomValidationPipe } from '../common/validation.pipe';

@Controller('api')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post('teachers')
  @UsePipes(new CustomValidationPipe())
  async create(@Body() createTeacherDto: CreateTeacherDto): Promise<void> {
    await this.teachersService.createTeacher(createTeacherDto);
  }

  @Post('register')
  async registerStudents(@Body() registerStudentsDto: RegisterStudentsDto, @Res() res: Response): Promise<void> {
    const { teacher, students } = registerStudentsDto;
    await this.teachersService.registerStudents(teacher, students);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post('deregister')
  async deregisterStudent(@Body() deregisterStudentDto: DeregisterDto, @Res() res: Response): Promise<void> {
    const { teacher, student, reason } = deregisterStudentDto;
    await this.teachersService.deregisterStudent(teacher, student, reason);
  res.status(HttpStatus.OK).send();
  }

  @Get('commonstudents')
  async getCommonStudents(@Query('teacher') teachers: string[]): Promise<{ students: string[] }> {
    const commonStudents = await this.teachersService.getCommonStudents(teachers);
    return { students: commonStudents };
  }

  @Get('teachers')
  async getAllTeachersWithStudents(): Promise<{ teachers: TeacherWithStudents[] }> {
    const teachers = await this.teachersService.getAllTeachersWithStudents();
    return { teachers };
  }
  

  
}
