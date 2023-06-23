import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudentsController } from "./students/students.controller";
import { TeachersController } from "./teachers/teachers.controller";
import { StudentsService } from "./students/students.service";
import { TeachersService } from "./teachers/teachers.service";
import { Student } from "./students/entities/students.entity";
import { Teacher } from "./teachers/entites/teachers.entity";
import { StudentTeacher } from "./students/entities/student-teacher.entity";
import { CustomValidationPipe } from "./common/validation.pipe";
import { DatabaseConfigService } from "./services/database-config.service";
import { TeachersModule } from "./teachers/teachers.module";
import { StudentsModule } from "./students/student.module";
import { Repository } from "typeorm";
import { GlobalExceptionFilter } from "./exception/global-exception.filter";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    TypeOrmModule.forFeature([Student, Teacher, StudentTeacher]),
    TeachersModule,
    StudentsModule,
  ],
  controllers: [StudentsController, TeachersController],
  providers: [
    StudentsService,
    TeachersService,
    CustomValidationPipe,
    Repository,
    GlobalExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [CustomValidationPipe],
})
export class AppModule {}
