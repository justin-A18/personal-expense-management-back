import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 200 })
  username: string;

  @Column('varchar', { length: 300, unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('boolean', { default: false })
  isEmailVerified: boolean;
}
