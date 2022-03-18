import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Receipt} from "./receipt";

@Entity()
export class Good {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  name: string;

  @Column({type:"real"})
  quantity: number;

  @Column()
  sum: number;

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date

  @ManyToOne(() => Receipt, receipt => receipt.goods)
  receipt: Receipt;
}