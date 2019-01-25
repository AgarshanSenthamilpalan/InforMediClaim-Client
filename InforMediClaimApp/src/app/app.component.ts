import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PendingclaimsPage } from '../pages/pendingclaims/pendingclaims';
import { HistoryPage } from '../pages/history/history';
import { DashboardPage } from '../pages/dashboard/dashboard'
import { PatientdetailsPage } from '../pages/patientdetails/patientdetails';
import { LoginPage } from '../pages/login/login'



import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html',
  
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(
    private alertCtrl: AlertController,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
 
    
    this.pages = [{title: 'Dashboard' , component: DashboardPage},
      {title: 'New Request' , component: PatientdetailsPage},
      {title: 'Pending Claims' , component: PendingclaimsPage},
      {title: 'History' , component: HistoryPage},
      
      
    ];

  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
 

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
  logout(){
    let alert = this.alertCtrl.create({
      title: 'Logut',
      message: 'Do you want to Logut',
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          role: 'Yes',
          handler: () => {
            let currentIndex = this.nav.getActive().index;
            this.nav.push(LoginPage).then(() => {
                this.nav.remove(currentIndex);
            });
          }
        }
        
      ]
    });
    alert.present();
  }
 

  }