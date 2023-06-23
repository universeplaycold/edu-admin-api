import { Test, TestingModule } from "@nestjs/testing";
import { TeachersController } from "../../src/teachers/teachers.controller";
import { TeachersService } from "../../src/teachers/teachers.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Teacher } from "../../src/teachers/entites/teachers.entity";
import { StudentTeacher } from "../../src/students/entities/student-teacher.entity";
import { Student } from "../../src/students/entities/students.entity";
import { NotFoundException } from "@nestjs/common";
import { CreateTeacherDto } from "../../src/teachers/dto/create-teacher.dto";
import { RegisterStudentsDto } from "../../src/teachers/dto/register-students.dto";
import { DeregisterDto } from "../../src/teachers/dto/deregister-students.dto";

describe("TeachersController", () => {
  let controller: TeachersController;
  let service: TeachersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersController],
      providers: [
        TeachersService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: {},
        },
        {
          provide: getRepositoryToken(StudentTeacher),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Student),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TeachersController>(TeachersController);
    service = module.get<TeachersService>(TeachersService);
  });

  describe("create", () => {
    it("should call createTeacher method of the service", async () => {

        const createTeacherDto: CreateTeacherDto = {
          email: "test@example.com",
          name: "John Doe",
        };
        const spy = jest.spyOn(service, "createTeacher");

        await controller.create(createTeacherDto);

      expect(spy).toHaveBeenCalledWith(createTeacherDto);
    });
  });

  describe("registerStudents", () => {
    it("should call registerStudents method of the service", async () => {
      const registerStudentsDto: RegisterStudentsDto = {
        teacher: "teacher@example.com",
        students: ["student1@example.com", "student2@example.com"],
      };

      const spy = jest.spyOn(service, "registerStudents");

      const response: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.registerStudents(registerStudentsDto, response);

      expect(spy).toHaveBeenCalledWith(
        registerStudentsDto.teacher,
        registerStudentsDto.students
      );
    });

    it("should throw NotFoundException if teacher is not found", async () => {
      const registerStudentsDto = {}; // Add your test data for the registerStudentsDto
      jest.spyOn(service, "registerStudents").mockImplementation(() => {
        throw new NotFoundException("Teacher not found");
      });

      const response: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const registerStudentsDto2: RegisterStudentsDto = {
        teacher: "teacher@example.com",
        students: ["student1@example.com", "student2@example.com"],
      };

      await expect(
        controller.registerStudents(registerStudentsDto2, response)
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe("TeachersController", () => {
    // ...

    describe("deregisterStudent", () => {
      it("should call deregisterStudent method of the service", async () => {
        const spy = jest.spyOn(service, "deregisterStudent");

        const deregisterStudentDto: DeregisterDto = {
          teacher: "teacher@example.com",
          student: "student@example.com",
          reason: "Some reason",
        };

        const response: any = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };

        await expect(
          controller.deregisterStudent(deregisterStudentDto, response)
        ).resolves.toBeUndefined();

        expect(spy).toHaveBeenCalledWith(
          deregisterStudentDto.teacher,
          deregisterStudentDto.student,
          deregisterStudentDto.reason
        );
      });

      it("should throw NotFoundException if teacher is not found", async () => {
        jest.spyOn(service, "deregisterStudent").mockImplementation(() => {
          throw new NotFoundException("Teacher not found");
        });

        const response: any = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };

        const deregisterStudentDto: DeregisterDto = {
          teacher: "teacher@example.com",
          student: "student@example.com",
          reason: "Some reason",
        };

        await expect(
          controller.deregisterStudent(deregisterStudentDto, response)
        ).rejects.toThrowError(NotFoundException);
      });
    });

    describe("getCommonStudents", () => {
      it("should call getCommonStudents method of the service", async () => {
        const teachers = []; // Add your test data for the teachers
        const spy = jest.spyOn(service, "getCommonStudents");

        const commonStudents = ['student1@example.com', 'student2@example.com'];

        jest.spyOn(service, 'getCommonStudents').mockResolvedValue(commonStudents);

        const result = await controller.getCommonStudents(teachers);

        expect(service.getCommonStudents).toHaveBeenCalledWith(teachers);
        expect(result).toEqual({ students: commonStudents });

        expect(spy).toHaveBeenCalledWith(teachers);
      });

      it("should return an object with students property", async () => {
        const teachers = []; // Add your test data for the teachers
        const commonStudents = []; // Add your test data for the commonStudents
        jest
          .spyOn(service, "getCommonStudents")
          .mockResolvedValue(commonStudents);
      
        const result = await controller.getCommonStudents(teachers);
      
        expect(service.getCommonStudents).toHaveBeenCalledWith(teachers);
        expect(result).toEqual({ students: commonStudents });
      });
    });

    describe("getAllTeachersWithStudents", () => {
      it("should call getAllTeachersWithStudents method of the service", async () => {
        const spy = jest.spyOn(service, "getAllTeachersWithStudents");

        await controller.getAllTeachersWithStudents();

        expect(spy).toHaveBeenCalled();
      });

      it("should return an object with teachers property", async () => {
        const teachersWithStudents = [];
        jest
          .spyOn(service, "getAllTeachersWithStudents")
          .mockResolvedValue(teachersWithStudents);

        const result = await controller.getAllTeachersWithStudents();

        expect(result).toEqual({ teachers: teachersWithStudents });
      });
    });
  });
});
