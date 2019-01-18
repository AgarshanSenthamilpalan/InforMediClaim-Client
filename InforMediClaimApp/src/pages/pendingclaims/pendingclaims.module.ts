import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendingclaimsPage } from './pendingclaims';

@NgModule({
  declarations: [
    PendingclaimsPage,
  ],
  imports: [
    IonicPageModule.forChild(PendingclaimsPage),
  ],
})
export class PendingclaimsPageModule { }
