import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Segment } from './segment.entity';

@Entity('second_wheel_prizes')
export class SecondWheelPrize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  weight: number;

  @ManyToOne(() => Segment, (segment) => segment.secondWheelPrizes)
  @JoinColumn({ name: 'segment_id' })
  segment: Segment;
}
