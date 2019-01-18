import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormdetailsPage } from '../formdetails/formdetails';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the PendingclaimsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pendingclaims',
  templateUrl: 'pendingclaims.html',
})
export class PendingclaimsPage {
  forms;
  temp;
  users;
  count;
  formkeys;
  constructor(private alertCtrl: AlertController, public fdb: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.fetchDataFromForms();
  }

  

  //join the key with the prior form object
  reMapDataWithKeys() {

    for (var i = 0; i < this.count; i++) {
      this.temp[i].key = this.formkeys[i].key;
    }
  }
  fetchDataFromForms() {
    this.fdb.list('/users').valueChanges().subscribe(
      data => {
        this.users = data;
       
      }
    );

    this.fdb.list('/forms').valueChanges().subscribe(
      data => {
        this.forms = data;
      

        this.temp = data;
        this.count = data.length;
      }
    );
    this.fdb.list('/forms').snapshotChanges().subscribe(
      data => {
        this.formkeys = data;
        

      }
    );


  }


  //delete submitted claim
  deleteDetails(item) {



    let alert = this.alertCtrl.create({
      title: 'Delete Request',
      message: 'Do you want to delete your claim',
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
            this.reMapDataWithKeys();
            
            this.fdb.object('/forms/' + item.key).remove();
          }
        }

      ]
    });
    alert.present();
  }



  //view requested claim
  viewDetails(form) {
    this.navCtrl.push(FormdetailsPage, { formdetails: form });
  }

}
