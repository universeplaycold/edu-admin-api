import { Test, TestingModule } from "@nestjs/testing";
import { TeachersController } from "../../src/teachers/teachers.controller";
import { TeachersService } from "../../src/teachers/teachers.service";
import { CreateTeacherDto } from "../../src/teachers/dto/create-teacher.dto";
import { RegisterStudentsDto } from "../../src/teachers/dto/register-students.dto";
import { DeregisterDto } from "../../src/teachers/dto/deregister-students.dto";
import { HttpStatus, Response } from "@nestjs/common";

describe("TeachersController", () => {
  let controller: TeachersController;
  let service: TeachersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersController],
      providers: [TeachersService],
    }).compile();

    controller = module.get<TeachersController>(TeachersController);
    service = module.get<TeachersService>(TeachersService);
  });

  describe("create", () => {
    it("should create a new teacher", async () => {
      const createTeacherDto: CreateTeacherDto = {
        email: "teacher@example.com",
        name: "John Doe",
      };

      jest.spyOn(service, "createTeacher").mockImplementation(async () => {
        // Mock implementation for the createTeacher service method
      });

      await controller.create(createTeacherDto);

      expect(service.createTeacher).toHaveBeenCalledWith(createTeacherDto);
    });
  });

  describe("registerStudents", () => {
    it("should register students to a teacher", async () => {
      const registerStudentsDto: RegisterStudentsDto = {
        teacher: "teacher@example.com",
        students: ["student1@example.com", "student2@example.com"],
      };

      jest.spyOn(service, "registerStudents").mockImplementation(async () => {
        // Mock implementation for the registerStudents service method
      });

      const response: Response = {
        status: jest.fn().mockReturnThis() as any,
        send: jest.fn(),
      } as any;

      await controller.registerStudents(registerStudentsDto, response as any);

      expect(service.registerStudents).toHaveBeenCalledWith(
        registerStudentsDto.teacher,
        registerStudentsDto.students
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(response.json).toHaveBeenCalled();
    });
  });

  describe("deregisterStudent", () => {
    it("should deregister a student from a teacher", async () => {
      const deregisterStudentDto: DeregisterDto = {
        teacher: "teacher@example.com",
        student: "student1@example.com",
        reason: "Withdrawn from class",
      };

      jest.spyOn(service, "deregisterStudent").mockImplementation(async () => {
        // Mock implementation for the deregisterStudent service method
      });

      const response: Response = {
        status: jest.fn().mockReturnThis() as any,
        send: jest.fn(),
      } as any;

      await controller.deregisterStudent(deregisterStudentDto, response as any);

      expect(service.deregisterStudent).toHaveBeenCalledWith(
        deregisterStudentDto.teacher,
        deregisterStudentDto.student,
        deregisterStudentDto.reason
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalled();
    });
  });

  describe("getCommonStudents", () => {
    it("should get common students for multiple teachers", async () => {
      const teachers = ["teacher1@example.com", "teacher2@example.com"];

      jest.spyOn(service, "getCommonStudents").mockImplementation(async () => {
        // Mock implementation for the getCommonStudents service method
        return ["student1@example.com", "student2@example.com"];
      });

      const result = await controller.getCommonStudents(teachers);

      expect(service.getCommonStudents).toHaveBeenCalledWith(teachers);
      expect(result).toEqual({
        students: ["student1@example.com", "student2@example.com"],
      });
    });
  });

  describe("getAllTeachersWithStudents", () => {
    it("should get all teachers with their students", async () => {
      jest
        .spyOn(service, "getAllTeachersWithStudents")
        .mockImplementation(async () => {
          // Mock implementation for the getAllTeachersWithStudents service method
          return [
            {
              email: "teacher1@example.com",
              students: ["student1@example.com", "student2@example.com"],
            },
            {
              email: "teacher2@example.com",
              students: ["student3@example.com", "student4@example.com"],
            },
          ];
        });
      const result = await controller.getAllTeachersWithStudents();

      expect(service.getAllTeachersWithStudents).toHaveBeenCalled();
      expect(result).toEqual({
        teachers: [
          {
            email: "teacher1@example.com",
            students: ["student1@example.com", "student2@example.com"],
          },
          {
            email: "teacher2@example.com",
            students: ["student3@example.com", "student4@example.com"],
          },
        ],
      });
    });
  });
});
