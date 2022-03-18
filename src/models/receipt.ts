import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "./user";
import { Good } from "./good";
import { ReceiptStatus, FnsStatus } from "../enums";
import { IPhoto, IQrCode } from "../interfaces";

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({ default: null, nullable: true })
  fn: string;

  @Column({ default: null, nullable: true })
  fd: string;

  @Column({ default: null, nullable: true })
  fpd: string;

  @Column({ default: null, nullable: true })
  n: number;

  @Column({ default: null, nullable: true })
  boughtAt: Date;

  @Column({ type: "real", default: null, nullable: true })
  s: number;

  @Column({ default: ReceiptStatus.HOLD })
  status: number;

  @Column({ default: FnsStatus.NOT_CHECKED })
  fnsStatus: number;

  @Column({ default: null, nullable: true })
  inn: string;

  @Column({ default: null, nullable: true })
  address: string;

  @Column({ default: null, nullable: true })
  lastCheck: Date;

  @Column({ default: null, nullable: true })
  marketName: string;

  @Column({ default: null, nullable: true })
  checkErrorText: string;

  @Column({ default: null, nullable: true })
  checkErrorCode: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.receipts)
  user: User;

  @OneToMany(() => Good, (good) => good.receipt)
  goods: Good[];

  @Column({ type: "json", nullable: false })
  photo: IPhoto;

  getQrCodeObject(): IQrCode {
    return {
      fn: this.fn as string,
      fd: this.fd as string,
      fpd: this.fpd as string,
      n: this.n as number,
      s: this.s as number,
      boughtAt: this.boughtAt as Date
    } as IQrCode;
  }
}
