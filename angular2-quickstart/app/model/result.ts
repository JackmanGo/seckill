import { Seckill } from './seckill';

export class Result{
    success:boolean;
    data: {
       seckillId: number,
       state: number,
       stateInfo: string,
       successKilled: {
       	 seckillId: number,
       	 userPhone: number,
       	 state: number,
       	 createTime: number
       },
       seckill: Seckill
    };
    error: string;
}