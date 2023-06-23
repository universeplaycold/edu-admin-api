import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from '../../src/students/students.controller';
import { StudentsService } from '../../src/students/students.service';
import { CreateStudentDto } from '../../src/students/dto/create-student.dto';

describe('StudentsController', () => {
    let studentsController: StudentsController;
    let studentsService: StudentsService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [StudentsController],
        providers: [StudentsService],
      }).compile();
  
      studentsController = module.get<StudentsController>(StudentsController);
      studentsService = module.get<StudentsService>(StudentsService);
    });
  
    describe('create', () => {
      it('should create a new student', async () => {
        const createStudentDto: CreateStudentDto = {
          email: 'studentjane@gmail.com',
          name: 'Jane',
        };
  
        jest.spyOn(studentsService, 'createStudent').mockResolvedValueOnce(undefined as any);
  
        const result = await studentsController.create(createStudentDto);
  
        expect(result).toBeDefined();
        expect((studentsService.createStudent as jest.Mock).mock.calls[0][0]).toEqual(createStudentDto);
      });
    });
});