import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database'
import { FormdetailsPage } from '../formdetails/formdetails';


@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  forms;
  temp;
  users;
  count;
  formkeys;
  constructor(public fdb: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.fetchDataFromForms();
  }

 
  //retrieve forms of current user
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
  
  viewDetails(form) {
    this.navCtrl.push(FormdetailsPage, { formdetails: form });
  }


}
