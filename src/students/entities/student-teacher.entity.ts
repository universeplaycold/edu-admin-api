import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Student } from '../entities/students.entity';
import { Teacher } from '../../teachers/entites/teachers.entity';

@Entity( { name: 'student_teacher'})
export class StudentTeacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'teacher_id' })
  teacherId: number;

  @ManyToMany(() => Student, student => student.teachers)
  @JoinTable({ name: 'student_teacher', joinColumn: { name: 'student_id' }, inverseJoinColumn: { name: 'teacher_id' } })
  students: Student[];

  @ManyToMany(() => Teacher, teacher => teacher.students)
  @JoinTable({ name: 'student_teacher', joinColumn: { name: 'teacher_id' }, inverseJoinColumn: { name: 'student_id' } })
  teachers: Teacher[];
}