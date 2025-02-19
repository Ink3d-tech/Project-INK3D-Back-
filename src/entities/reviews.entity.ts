import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Reviews {
  @PrimaryGeneratedColumn('uuid') // 🔥 Asegura que haya una clave primaria
  id: string;


  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}
