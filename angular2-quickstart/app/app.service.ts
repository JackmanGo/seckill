import { Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { Seckill } from './model/seckill';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Rx";


@Injectable()
export class AppService {
	  private listUrl = "http://localhost:8080/seckill/listGoods";
    private detail = "http://localhost:8080/seckill/detail/";
    private nowTime = "http://localhost:8080/seckill/time/now";

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

  private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
  }



}
