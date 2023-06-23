import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from '../../src/students/students.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../../src/students/entities/students.entity';
import { CreateStudentDto } from '../../src/students/dto/create-student.dto';

describe('StudentsService', () => {
  let studentsService: StudentsService;
  let studentRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    studentsService = module.get<StudentsService>(StudentsService);
    studentRepository = module.get(getRepositoryToken(Student));
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const createStudentDto: CreateStudentDto = {
        email: 'studentjane@gmail.com',
        name: 'Jane',
      };

      await studentsService.createStudent(createStudentDto);

      expect(studentRepository.create).toHaveBeenCalledWith(createStudentDto);
      expect(studentRepository.save).toHaveBeenCalled();
    });
  });
});