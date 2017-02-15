import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DatepickerModule, AlertModule } from 'ng2-bootstrap';
import { HttpModule }    from '@angular/http';
import { RouterModule }   from '@angular/router';
import { AppComponent } from './app.component';
import { AppList } from './list/app.list';
import { AppDetail } from './detail/app.detail';
import { AppService } from './app.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { CookieService } from 'angular2-cookie/services/cookies.service';

@NgModule({
  declarations: [AppList,AppDetail,AppComponent],
  imports: [
    RouterModule.forRoot([
      {
        //默认路径，即根路径/
        path: '',
        component: AppList
      },{
        path: 'detail/:id',
        component: AppDetail
      }
    ]),
    BrowserModule,
    FormsModule,
    AlertModule.forRoot(),
    DatepickerModule.forRoot(),
    HttpModule,
    Ng2Bs3ModalModule
  ],
  providers: [AppService,AppDetail,CookieService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
