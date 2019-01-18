import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  users
  usercount
  currentUser
  name
  limit
  balance
  releaseCount
  readyCount
  acceptedCount
  pendingCount
  rejectedCount
  val
  constructor(public fdb: AngularFireDatabase, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    //retrieve data of useres
    this.fdb.list('/users').valueChanges().subscribe(
      data => {
        this.users = data;
        this.usercount = data.length;
        this.fetchDataFromUsers(sessionStorage.getItem('userId'));

      }
    );
  }

  //retrieve the current user details
  fetchDataFromUsers(userId) {
    
    for (let i = 0; i < this.usercount; i++) {
     
      if (this.users[i].user_id == userId) {

        this.currentUser = this.users[i];
        this.populateUserDetails();
        break;
      } else {
        continue;
      }
    }
  }
  //populate user details in UI
  populateUserDetails() {
    this.name = this.currentUser.name;
    this.limit = this.currentUser.limit;
    this.balance = this.currentUser.balance;
    this.releaseCount = this.currentUser.releaseCount;
    this.readyCount = this.currentUser.readyCount;
    this.acceptedCount = this.currentUser.acceptedCount;
    this.pendingCount = this.currentUser.pendingCount;
    this.rejectedCount = this.currentUser.rejectedCount;
  }

}
