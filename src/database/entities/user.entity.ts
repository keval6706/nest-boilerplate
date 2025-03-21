import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../enums/user.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'character varying', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'character varying', select: false })
  password: string;

  @Column({ type: 'character varying' })
  firstName: string;

  @Column({ type: 'character varying' })
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
