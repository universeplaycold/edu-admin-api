import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Teacher } from '../../teachers/entites/teachers.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @ManyToMany(() => Teacher, teacher => teacher.students)
  @JoinTable({ name: 'student_teacher' })
  teachers: Teacher[];

}
