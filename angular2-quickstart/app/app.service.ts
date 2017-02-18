import { Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { Seckill } from './model/seckill';
import { Result} from './model/result';
import { Exposer} from './model/exposer';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Rx";


@Injectable()
export class AppService {
	private listUrl = "http://localhost:8080/seckill/listGoods";
    private detail = "http://localhost:8080/seckill/detail/";
    private nowTime = "http://localhost:8080/seckill/time/now";
    private exposer = "http://localhost:8080/seckill/exposer/";
    private execution = "http://localhost:8080/seckill/execution/";

	constructor(private http:Http) {}

	requestGoodsList(): Promise<Seckill[]> {
        return this.http.get(this.listUrl).toPromise()
            .then(response => response.json() as Seckill[])
            .catch(this.handleError);
    }

    requestGoodsDetail(id:number): Promise<Seckill> {
	    return this.http.get(this.detail+id).toPromise()
			      .then(response=>response.json() as Seckill)
						.catch(this.handleError);
	}

	requestNowTime(): Promise<number>{
        return this.http.get(this.nowTime).toPromise()
			       .then(response=>response.json().data as number)
						.catch(this.handleError);
	}
	requestSeckillUrl(seckillId:number):Promise<Exposer>{
        return this.http.get(this.exposer+seckillId).toPromise()
                   .then(response=>response.json() as Exposer) 
                         .catch(this.handleError);
	}
	executionSeckill(seckillId:number,md5:number):Promise<Result>{
        return this.http.get(this.execution+seckillId+md5).toPromise()
                   .then(response=>response.json() as Result) 
                         .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
