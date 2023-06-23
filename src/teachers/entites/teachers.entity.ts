import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Student } from '../../students/entities/students.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @ManyToMany(() => Student, student => student.teachers)
  @JoinTable({ name: 'student_teacher' })
  students: Student[];
}