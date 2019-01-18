import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-login',

  templateUrl: 'login.html',
})
export class LoginPage {
  users
  username
  usercount
  userpassword
  jsonData
  userId
  name
  loginfail = true;
  constructor(private network: Network, private toast: ToastController, private menu: MenuController, public storage: Storage, public alertCtrl: AlertController, public fdb: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {

    this.checkInternet();

    this.fetchDataFromUsers();

  }

  //alert for network availability
  displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type;
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }

  //check network connectivity
  checkInternet() {

    if (this.network.type == 'none') {
      this.toast.create({
        message: 'No Internet Connection Detected !',
        duration: 2000
      }).present();
    }
    this.menu.enable(false);
    this.network.onConnect().subscribe(data => {
     
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }


  //enable side menu
  ionViewWillLeave() {

    this.menu.enable(true);
  }




  //retrieve data of users
  fetchDataFromUsers() {
    this.fdb.list('/users').valueChanges().subscribe(
      data => {
        this.users = data;
        this.usercount = data.length;

      }
    );
  }


  // validate username and password
  loginButtonClicked() {


    for (let i = 0; i < this.usercount; i++) {
      if (this.users[i].username == this.username && this.users[i].password == this.userpassword) {
        this.name = this.users[i].name;
        this.userId = this.users[i].user_id;
        this.jsonData = this.users[i];
        sessionStorage.setItem('userId', this.userId);
        this.navCtrl.push(DashboardPage);
        this.loginfail = false;
        break;
      } else {
        continue;

      }
    }

    if (this.loginfail == true) {
      this.showFailAlert();
    }


  }



  //login failed
  showFailAlert() {
    const alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: 'Incorrect username or password, Please try again.',
      buttons: ['Ok']
    });
    alert.present();
  }

}
