import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  BaseEntity
} from "typeorm";
import { Receipt } from "./receipt";

@Entity()
export class User {
  @PrimaryColumn({type : 'real'})
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Receipt, (receipt) => receipt.user)
  @JoinColumn({ name: "user_id", referencedColumnName: "user_id" })
  receipts: Receipt[];
}
