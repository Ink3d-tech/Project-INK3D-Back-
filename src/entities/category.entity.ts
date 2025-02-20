// import {
//   Column,
//   Entity,
//   JoinColumn,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Product } from './product.entity';

// @Entity('category')
// export class Category {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ unique: true })
//   name: string;

//   @OneToMany(() => Product, (product) => product.category)
//   @JoinColumn()
//   products: Product[];
// }


import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
