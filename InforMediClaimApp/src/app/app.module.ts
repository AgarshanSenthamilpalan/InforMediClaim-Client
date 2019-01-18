import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Loading } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { PendingclaimsPage } from '../pages/pendingclaims/pendingclaims';
import { HistoryPage  } from '../pages/history/history';
import { PatientdetailsPage } from '../pages/patientdetails/patientdetails';


import { FormdetailsPage } from '../pages/formdetails/formdetails';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { LoginPage } from '../pages/login/login'

import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import {Camera} from '@ionic-native/camera'
import{AngularFireDatabaseModule} from 'angularfire2/database';
import { AngularFireModule } from '@angular/fire';

var config = {
  apiKey: "AIzaSyBRJFbY1J2LEDad9sN6f53wq3Fa9ee9VyM",
  authDomain: "expense-management-e1e6d.firebaseapp.com",
  databaseURL: "https://expense-management-e1e6d.firebaseio.com",
  projectId: "expense-management-e1e6d",
  storageBucket: "expense-management-e1e6d.appspot.com",
  messagingSenderId: "687363091029"
};
@NgModule({
  declarations: [
    MyApp,
    PendingclaimsPage,
    HistoryPage,
    PatientdetailsPage,
  
    FormdetailsPage,
    DashboardPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      tabsPlacement:'top',
    }),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(config),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PendingclaimsPage,
    HistoryPage,
    PatientdetailsPage,

 
    FormdetailsPage,
    DashboardPage,
    LoginPage

  ],
  providers: [
    StatusBar,
    SplashScreen,Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FileChooser,File,
    Network
  ]
})
export class AppModule {}
