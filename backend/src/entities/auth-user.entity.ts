import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth_user')
export class AuthUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
