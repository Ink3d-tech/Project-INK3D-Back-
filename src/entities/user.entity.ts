import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
<<<<<<< HEAD
=======
  ManyToOne,
>>>>>>> aaa0d488f8e722660ad105f48c6c21aa070c76d8
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

<<<<<<< HEAD
  @Column({ nullable: true }) // ✅ Permitir NULL para usuarios de Google
  password?: string;
=======
  @Column()
  password: string;
>>>>>>> aaa0d488f8e722660ad105f48c6c21aa070c76d8

  @Column()
  name: string;

<<<<<<< HEAD
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
 
=======
  @Column({ type: 'int', nullable: true })
  phone: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  bio: string;
>>>>>>> aaa0d488f8e722660ad105f48c6c21aa070c76d8

  @Column({ type: 'enum', enum: ['admin', 'user', 'mod'], default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

<<<<<<< HEAD
  @Column({ default: true }) // ✅ Asegurar que los usuarios sean activos por defecto
  isActive: boolean;

  @OneToMany(() => Reviews, (review) => review.user) // ✅ Corregir relación
  reviews: Reviews[];
=======
  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.reviews)
  reviews: Reviews;
>>>>>>> aaa0d488f8e722660ad105f48c6c21aa070c76d8

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => Product, (product) => product.favoritedBy)
  @JoinTable({
    name: 'favorites',
  })
  favorites: Product[];
}
