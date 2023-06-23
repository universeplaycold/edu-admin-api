import { Injectable, ConflictException, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entites/teachers.entity';
import { Student } from '../students/entities/students.entity';
import { StudentTeacher } from '../students/entities/student-teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherWithStudents } from './interface/teacher-with-students.interface'
import { In } from 'typeorm';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher) private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(StudentTeacher) private readonly studentTeacherRepository: Repository<StudentTeacher>,
    @InjectRepository(Student) private readonly studentRepository: Repository<Student>,
  ) {}

  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<void> {
    const { email, name } = createTeacherDto;

    try {
      const teacher = this.teacherRepository.create({ email, name });
      await this.teacherRepository.save(teacher);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Teacher already exists');
      }
      throw error;
    }
  }

  async registerStudents(teacherEmail: string, studentEmails: string[]): Promise<void> {
    const teacher = await this.teacherRepository.findOne({ where: { email: teacherEmail } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with email ${teacherEmail} not found.`);
    }
  
    const students = await this.studentRepository.find({ where: { email: In(studentEmails) } });
    if (students.length !== studentEmails.length) {
      const foundEmails = students.map(student => student.email);
      const missingEmails = studentEmails.filter(email => !foundEmails.includes(email));
      throw new NotFoundException(`Students with emails ${missingEmails.join(', ')} not found.`);
    }

    const studentTeacherRecords = students.map(student => {
      const studentTeacher = new StudentTeacher();
      studentTeacher.studentId = student.id;
      studentTeacher.teacherId = teacher.id;
      return studentTeacher;
    });
  
    await this.studentTeacherRepository.save(studentTeacherRecords);
  }

  async deregisterStudent(teacherEmail: string, studentEmail: string, reason: string): Promise<void> {
    const teacher = await this.teacherRepository.findOne({ where: { email: teacherEmail } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with email ${teacherEmail} not found.`);
    }

    const student = await this.studentRepository.findOne({ where: { email: studentEmail } });
    if (!student) {
      throw new NotFoundException(`Student with email ${studentEmail} not found.`);
    }

    const studentTeacher = await this.studentTeacherRepository.findOne({
      where: { teacherId: teacher.id, studentId: student.id },
    });

    if (!studentTeacher) {
      throw new NotFoundException(`Student ${studentEmail} is not registered to Teacher ${teacherEmail}.`);
    }

    await this.studentTeacherRepository.remove(studentTeacher);

    return;
  }

  async getCommonStudents(teachers: string | string[]): Promise<string[]> {
    const teacherEmails = Array.isArray(teachers) ? teachers.map(teacher => teacher.toLowerCase()) : [teachers.toLowerCase()];
  
    const teacherIds = await this.getTeacherIdsByEmails(teacherEmails);
    if (teacherIds.length !== teacherEmails.length) {
      const foundEmails = teacherIds.map(teacher => teacher.email);
      const missingEmails = teacherEmails.filter(email => !foundEmails.includes(email));
      throw new NotFoundException(`Teachers with emails ${missingEmails.join(', ')} not found.`);
    }
  
    const commonStudents = await this.findCommonStudents(teacherIds);
    const studentEmails = commonStudents.map(student => student.email);
  
    return studentEmails;
  }

  private async getTeacherIdsByEmails(emails: string[]): Promise<Teacher[]> {
    return this.teacherRepository.find({ where: { email: In(emails) } });
  }

  private async findCommonStudents(teachers: Teacher[]): Promise<Student[]> {
    const teacherIds = teachers.map(teacher => teacher.id);

    const studentIds = await this.studentTeacherRepository
      .createQueryBuilder('studentTeacher')
      .select('studentTeacher.studentId', 'studentId')
      .groupBy('studentTeacher.studentId')
      .having('COUNT(studentTeacher.studentId) = :teacherCount', { teacherCount: teacherIds.length })
      .andWhere('studentTeacher.teacherId IN (:...teacherIds)', { teacherIds })
      .getRawMany();

    const students = await this.studentRepository.findByIds(studentIds.map(({ studentId }) => studentId));
    return students;
  }

  async getAllTeachersWithStudents(): Promise<TeacherWithStudents[]> {
    const query = `
      SELECT teacher.email AS teacherEmail, ARRAY_AGG(student.email) AS studentEmails
      FROM teacher
      LEFT JOIN student_teacher ON teacher.id = student_teacher.teacher_id
      LEFT JOIN student ON student.id = student_teacher.student_id
      GROUP BY teacher.email
    `;

      const result = await this.teacherRepository.query(query);

      const teachersWithStudents: TeacherWithStudents[] = result.map(row => ({
        email: row.teacheremail,
        students: row.studentemails, 
      }));

      return teachersWithStudents;
  }
  
}