import {Component,OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {Seckill} from "../model/seckill";


@Component({
  selector: 'list',
  template:`<div class="container">
      <div class="panel panel-default">
          <div class="panel-heading text-center">
              <h2>秒杀列表</h2>
          </div>
          <div class="panel-body">
              <table class="table table-hover">
                  <thead>
                  <tr>
                    <th>名称</th>
                    <th>库存</th>
                    <th>开始时间</th>
                    <th>结束时间</th>
                    <th>创建时间</th>
                    <th>详情页</th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let sk of seckills;let i=index">
                      <td>{{sk.name}}</td>
                      <td>{{sk.number}}</td>
                      <td>{{getTime(sk.startTime)}}</td>
                      <td>{{getTime(sk.endTime)}}</td>
                      <td>{{getTime(sk.createTime)}}</td>
                      <td><a class="btn btn-info" routerLink="/detail/{{sk.seckillId}}" target="_blank">详情</a></td>
                    </tr>
                  </tbody>
              </table>
          </div>
      </div>
  </div>`
})
export class AppList implements OnInit{
  seckills:Seckill[];
  countdownTimeStr = '01:12:07:13';
  countdownFlipTimeStr = '00:04:13:17';
  constructor(private appService:AppService){}
  ngOnInit():void {
    this.appService.requestGoodsList().then(results=>{
      this.seckills = results;
    })
  }

  onElapse(): void {
    alert('Countdown is finished!');
  }

  onChange(value: any) {
    console.log(value);
  }
  getTime(data: number): string{
    var date = new Date(data); //传个时间戳过去就可以了
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = (date.getMinutes()+1 < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
    return Y+M+D+h+m;
  }
}
