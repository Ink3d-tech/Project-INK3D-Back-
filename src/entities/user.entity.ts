import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { Reviews } from './reviews.entity';
<<<<<<< HEAD
=======
import { Discounts } from './discounts.entity';
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

<<<<<<< HEAD
  @Column({ type: 'int' })
  phone: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
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
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  bio: string;

  @Column({ type: 'enum', enum: ['admin', 'user', 'mod'], default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.reviews)
  reviews: Reviews;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => Product, (product) => product.favoritedBy)
  @JoinTable({
    name: 'favorites',
  })
<<<<<<< HEAD
=======
  @OneToMany(() => Discounts, (discount) => discount.userId)
  @JoinTable({
    name: 'discounts',
  })
  discounts: Discounts[];

>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  favorites: Product[];
}
