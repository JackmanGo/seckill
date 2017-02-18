import {Component,OnInit,ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import { Seckill } from "../model/seckill";
import { Result } from "../model/result";
import { ActivatedRoute, Params } from '@angular/router';
import { Router }  from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {CookieService} from 'angular2-cookie/core';
import {Observable} from 'rxjs/Rx';

declare const $:any;

@Component({
  selector: 'detail',
  template:`<div class="container">
    <div class="panel panel-default text-center">
        <div class="pannel-heading">
            <h1></h1>
        </div>
        <div class="panel-body">
            <h2 class="text-danger">
                <span class="glyphicon glyphicon-time"></span>
                <span class="glyphicon" id="seckill-box"></span>
            </h2>
        </div>
    </div>
</div>
<modal [animation]="true" [keyboard]="false" [backdrop]="false"
    [cssClass]="cssClass" #killPhoneModal>
        <form #modalForm="ngForm">
            <modal-header [show-close]="true">
                <h3 class="modal-title text-center">
                    <span class="glyphicon glyphicon-phone"> </span>秒杀电话:
                </h3>
            </modal-header>
            <modal-body>
                <div class="row">
                    <div class="col-xs-8 col-xs-offset-2">
                        <input type="text" name="killPhone" placeholder="填写手机号^o^" class="form-control" #phoneInput>
                    </div>
                </div>
            </modal-body>
            <modal-footer>
                <span id="killPhoneMessage" class="glyphicon"> </span>
                <button type="button" id="killPhoneBtn" class="btn btn-success" (click)="killPhoneKey(phoneInput.value)">
                    <span class="glyphicon glyphicon-phone"></span>
                    Submit
                </button>
            </modal-footer>
        </form>
</modal>`
})
export class AppDetail implements OnInit{
  @ViewChild('killPhoneModal')
  modal: ModalComponent;
  //点击的某个商品
  seckill:Seckill;
  //当前时间
  nowTime:number;
  selected: string;
  output: string;
  countTimeMessage:string;
  countTimeDiff:number;
  constructor(private appService:AppService,private router: ActivatedRoute,private cookieService:CookieService){}
  ngOnInit():void {
    this.router.params.forEach( (params: Params) => {
      this.appService.requestGoodsDetail(params['id']).then(results=>{
        this.seckill = results;
        console.log(this.seckill);
        this.checkUserInfo();
      })
    })
  }
  checkUserInfo(){
    //手机验证和登录,计时交互
    //规划我们的交互流程
    //在cookie中查找手机号
    const userPhone = this.cookieService.get("userPhone");
    //验证手机号
    if (!this.validatePhone(userPhone)) {
      //绑定手机
      this.modal.open();
    }else{
      this.modal.close();
      this.userCompleteLogin();
    }
  }
  userCompleteLogin():void{
    //已经登录
    //计时交互
    this.appService.requestNowTime().then(nowTime=>{
      this.nowTime = nowTime;
      //时间判断 计时交互
      this.calculateCountDown(this.seckill.seckillId, this.nowTime, this.seckill.startTime,this.seckill.endTime);
    });
  }
  killPhoneKey(inputPhone:any):void {
    console.log("inputPhone: " + inputPhone+this.validatePhone(inputPhone));
    if (this.validatePhone(inputPhone)) {
      //电话写入cookie(7天过期)
      this.cookieService.put('userPhone', inputPhone);
      //验证通过
      const userPhone = this.cookieService.get("userPhone");;
      this.userCompleteLogin();
    } else {
      //todo 错误文案信息抽取到前端字典里
      $('#killPhoneMessage').hide().html('<label class="label label-danger">手机号错误!</label>').show(300);
    }
  }
  validatePhone(phone:any):boolean{
    if (phone && phone.length == 11 && !isNaN(phone)) {
      return true;//直接判断对象会看对象是否为空,空就是undefine就是false; isNaN 非数字返回true
    } else {
      return false;
    }
  }
  calculateCountDown(seckillId:number, nowTime:number, startTime:number, endTime:number):void {
    const seckillBox = $('#seckill-box');
    console.log("nowTime:"+nowTime);
    console.log("startTime:"+startTime);
    console.log("endTime:"+endTime);
    //test data
    nowTime = 1487214167223;
    startTime = 1487224167223;
    endTime = 1487214367223;
    if (nowTime > endTime) {
      //秒杀结束
      seckillBox.html('秒杀结束!');
    } else if (nowTime < startTime) {
      //秒杀未开始,计时事件绑定
      console.log(startTime);
      const killTime = new Date(startTime + 1000);//todo 防止时间偏移
      this.countTimeDiff = startTime-nowTime;
      console.log(this.countTimeDiff);
      Observable.interval(1000).map((x:any) => {
        this.countTimeDiff = Math.floor((killTime.getTime() - new Date().getTime()) / 1000);
      }).subscribe((x) => { 
          this.countTimeMessage = this.dhms(this.countTimeDiff);
          console.log(this.countTimeMessage);
          seckillBox.html('秒杀开始时间!'+this.countTimeMessage);
          //秒杀开始
          this.handlerSeckill(seckillId, seckillBox);
        });
    } else {
      //秒杀开始
      this.handlerSeckill(seckillId, seckillBox);
    }
  }
  handlerSeckill(seckillId:number,node:any):void{
    //获取秒杀地址,控制显示器,执行秒杀
    node.hide().html('<button class="btn btn-primary btn-lg" id="killBtn">开始秒杀</button>');
    //开启秒杀
    //获取秒杀地址
    this.appService.requestSeckillUrl(seckillId).then(exposer=>{
      if(exposer.data.exposed){
        let md5 = exposer.data.md5;
        //绑定一次点击事件
        $('#killBtn').one('click', function () {
          //执行秒杀请求
          //1.先禁用按钮
          $(this).addClass('disabled');
          //2.发送秒杀请求执行秒杀
            this.appService.executionSeckill(seckillId,md5).then((seckilledResult:Result)=>{
              if (seckilledResult.success) {
                let killResult = seckilledResult.data;
                let state = killResult.state;
                let stateInfo = killResult.stateInfo;
                //显示秒杀结果
                node.html('<span class="label label-success">' + stateInfo + '</span>');
              }      
            });
        });
        node.show();
      }else{
        //未开启秒杀(浏览器计时偏差)
        var now = exposer['now'];
        var start = exposer['start'];
        var end = exposer['end'];
        //seckill.countDown(seckillId, now, start, end);
      }
    });
  }
  //calculate time
  dhms(t:any){
     let days, hours, minutes, seconds;
     days = Math.floor(t / 86400);
     t -= days * 86400;
     hours = Math.floor(t / 3600) % 24;
     t -= hours * 3600;
     minutes = Math.floor(t / 60) % 60;
     t -= minutes * 60;
     seconds = t % 60;
     return [
             days + '天',
             hours + '小时',
             minutes + '分钟',
             seconds + '秒'
            ].join(' ');                              
  }

}
