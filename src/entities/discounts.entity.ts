// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   CreateDateColumn,
// } from 'typeorm';
// import { User } from './user.entity';

// @Entity()
// export class Discounts {
//   @PrimaryGeneratedColumn('uuid')
//   id: string; // Se usará como código de descuento

//   @Column('decimal')
//   amount: number;

//   @Column({ default: false })
//   isUsed: boolean;

//   @CreateDateColumn()
//   createdAt: Date; // Fecha de creación del descuento

//   @Column({ type: 'timestamp', nullable: true })
//   expiresAt: Date | null; // Fecha de expiración

//   @Column({
//     type: 'enum',
//     enum: ['active', 'expired', 'used', 'inactive'],
//     default: 'inactive',
//   })
//   status: 'active' | 'expired' | 'used' | 'inactive'; // Estado del descuento

//   @ManyToOne(() => User, (user) => user.discounts, { nullable: true })
//   userId: User | null;
// }



import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Discounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // Código de descuento (ejemplo: "BlackFriday")

  @Column('decimal')
  amount: number;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ default: 0 })
  currentUses: number; // Veces que se ha usado el código

  @Column()
  maxUses: number; // Límite de usos

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({
    type: 'enum',
    enum: ['active', 'expired', 'used', 'inactive'],
    default: 'inactive',
  })
  status: 'active' | 'expired' | 'used' | 'inactive';

  @ManyToOne(() => User, (user) => user.discounts, { nullable: true })
  userId: User | null;
}
