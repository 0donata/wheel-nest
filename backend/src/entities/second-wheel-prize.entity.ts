import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Segment } from './segment.entity';

@Entity()
export class SecondWheelPrize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  weight: number;

  @ManyToOne(() => Segment, (segment) => segment.secondWheelPrizes)
  segment: Segment;
}
