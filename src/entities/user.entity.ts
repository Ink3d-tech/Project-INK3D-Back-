import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { Reviews } from './reviews.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true }) // ✅ Permitir NULL para usuarios de Google
  password?: string;

  @Column()
  name: string;

  @Column({ type: 'int', nullable: true }) // ✅ Permitir NULL
  phone?: number;
  

 
  @Column({ nullable: true }) // ✅ Permitir NULL
  address?: string;

 
  @Column({ nullable: true }) // ✅ Permitir NULL
  city?: string;

 
  @Column({ nullable: true }) // ✅ Permitir NULL
  country?: string;

  @Column({ nullable: true }) // ✅ Permitir NULL
  bio?: string;
 

  @Column({ type: 'enum', enum: ['admin', 'user', 'mod'], default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true }) // ✅ Asegurar que los usuarios sean activos por defecto
  isActive: boolean;

  @OneToMany(() => Reviews, (review) => review.user) // ✅ Corregir relación
  reviews: Reviews[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => Product, (product) => product.favoritedBy)
  @JoinTable({
    name: 'favorites',
  })
  favorites: Product[];
}
