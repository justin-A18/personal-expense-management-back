import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('varchar', { length: 300, unique: true })
  email: string;

  @Column('text', { nullable: true })
  avatar?: string;

  @Column('text')
  password: string;

  @Column('boolean', { default: false })
  isEmailVerified: boolean;
}
