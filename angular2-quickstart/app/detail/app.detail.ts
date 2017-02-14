import {Component,OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {Seckill} from "../model/seckill";
import { ActivatedRoute, Params } from '@angular/router';
import { Router }  from '@angular/router';


declare var $:any;

@Component({
  selector: 'detail',
  template:`<div class="container">
    <div class="panel panel-default text-center">
        <div class="pannel-heading">
            <h1>{{seckill.name}}</h1>
        </div>

        <div class="panel-body">
            <h2 class="text-danger">
                <span class="glyphicon glyphicon-time"></span>
                <span class="glyphicon" id="seckill-box"></span>
            </h2>
        </div>
    </div>
</div>
<div id="killPhoneModal" class="modal fade">

    <div class="modal-dialog">

        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title text-center">
                    <span class="glyphicon glyphicon-phone"> </span>秒杀电话:
                </h3>
            </div>

            <div class="modal-body">
                <div class="row">
                    <div class="col-xs-8 col-xs-offset-2">
                        <input type="text" name="killPhone" id="killPhoneKey"
                               placeholder="填写手机号^o^" class="form-control" (click)="killPhoneKey(this.value)">
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <span id="killPhoneMessage" class="glyphicon"> </span>
                <button type="button" id="killPhoneBtn" class="btn btn-success">
                    <span class="glyphicon glyphicon-phone"></span>
                    Submit
                </button>
            </div>

        </div>
    </div>

</div>`
})
export class AppDetail implements OnInit{
  //点击的某个商品
  seckill:Seckill;
  //当前时间
  nowTime:number;
  constructor(private appService:AppService,private router: ActivatedRoute){}
  ngOnInit():void {
    this.router.params.forEach( (params: Params) => {
      console.log(params);
      this.appService.requestGoodsDetail(params['id']).then(results=>{
        this.seckill = results;
        //手机验证和登录,计时交互
        //规划我们的交互流程
        //在cookie中查找手机号
        const userPhone = $.cookie('userPhone');
        //验证手机号
        if (!this.validatePhone(userPhone)) {
          //绑定手机 控制输出
          const killPhoneModal = $('#killPhoneModal');
          killPhoneModal.modal({
            show: true,//显示弹出层
            backdrop: 'static',//禁止位置关闭
            keyboard: false//关闭键盘事件
          });
        }
        //已经登录
        //计时交互
        this.appService.requestNowTime().then(nowTime=>{
          this.nowTime = nowTime;
          //时间判断 计时交互
          this.countDown(this.seckill.seckillId, this.nowTime, this.seckill.startTime,this.seckill.endTime);
        });
      })
    })
  }
  killPhoneKey(inputPhone:any):void {
    console.log("inputPhone: " + inputPhone);
    if (this.validatePhone(inputPhone)) {
      //电话写入cookie(7天过期)
      $.cookie('userPhone', inputPhone, {expires: 7, path: '/seckill'});
      //验证通过　　刷新页面
      window.location.reload();
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
  countDown(seckillId:number, nowTime:number, startTime:number, endTime:number):void {
    console.log(seckillId + '_' + nowTime + '_' + startTime + '_' + endTime);
    const seckillBox = $('#seckill-box');
    if (nowTime > endTime) {
      //秒杀结束
      seckillBox.html('秒杀结束!');
    } else if (nowTime < startTime) {
      //秒杀未开始,计时事件绑定
      const killTime = new Date(startTime + 1000);//todo 防止时间偏移
      //计时时间
      seckillBox.countdown(killTime, function (event:any) {
      //时间格式
      const format = event.strftime('秒杀倒计时: %D天 %H时 %M分 %S秒 ');
        seckillBox.html(format);
      }).on('finish.countdown', function () {
        //时间完成后回调事件
        //获取秒杀地址,控制现实逻辑,执行秒杀
        console.log('______fininsh.countdown');
        //handlerSeckill(seckillId, seckillBox);
      });
    } else {
      //秒杀开始
      //handlerSeckill(seckillId, seckillBox);
    }
  }

}
