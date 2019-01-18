import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FormdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formdetails',
  templateUrl: 'formdetails.html',
})
export class FormdetailsPage {
  formDetails

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    //retrive form details from history/pending pages
    this.formDetails = navParams.get("formdetails");

  }



}
