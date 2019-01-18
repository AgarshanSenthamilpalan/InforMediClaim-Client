import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { storage } from 'firebase';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database'
import { Camera, CameraOptions } from "@ionic-native/camera"
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-patientdetails',
  templateUrl: 'patientdetails.html',
})
export class PatientdetailsPage {
  key;
  nameofpatient;
  patientrelationship;
  nameofdoctor;
  dateofExpen;
  natureofillness;
  ReceiptNo;
  amountofExpen;
  employeefile;
  myInput;
  myInputClaim;
  claimMonth;
  insurancecompany;
  NameOfEmployee;
  EpfNo;
  designation
  uploadButtonClicked
  uploadButtonHide
  userIdNo
  claimNo
  ReceiptUploaded
  loader
  availableBalance
  pendingCount
  maxDate: string = new Date().toISOString();
  public buttonClicked: boolean = false;



  requestDate: string = new Date().toLocaleDateString();
  constructor(public loadingCtrl: LoadingController, public storage: Storage, private alertCtrl: AlertController, public fdb: AngularFireDatabase, private camera: Camera, public navCtrl: NavController, public navParams: NavParams) {

    //current date/month/year
    var cur_day = new Date().getDate();
    var cur_month = new Date().getMonth() + 1;
    var cur_year = new Date().getFullYear();
    this.requestDate = cur_year + '-' + cur_month + '-' + cur_day;

    //get user id from session storage
    this.userIdNo = sessionStorage.getItem('userId');
    this.uploadButtonHide = true;

    //retrieve data from using users tabel using user id
    this.fdb.list('/users', ref => ref.orderByChild('user_id').equalTo(this.userIdNo)).valueChanges().subscribe(
      userData => {

        this.NameOfEmployee = userData[0]['name'];
        this.designation = userData[0]['designation'];
        this.EpfNo = userData[0]['epf_no'];
        this.availableBalance = userData[0]['balance'];
        this.pendingCount = userData[0]['pendingCount']
        this.claimNo = userData[0]['pendingCount'] + userData[0]['readyCount'] + userData[0]['rejectedCount']
          + userData[0]['acceptedCount'] + userData[0]['releaseCount'];
     
      }
    );

  }

 


  //upload receipt
  async takePhoto() {

    if (this.ReceiptNo) {


      try {

        const options: CameraOptions = {
          quality: 50,
          targetHeight: 600,
          targetWidth: 600,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        }

        const result = await this.camera.getPicture(options);

        const image = `data:image/jpeg;base64,${result}`;
        this.loader = this.loadingCtrl.create({
          content: "Uploading Reciept",

        });

        this.loader.present().then(() => {
          const pictures = storage().ref(this.userIdNo + "-" + (this.claimNo + 1));
          pictures.putString(image, 'data_url').then(data => {

            //get receipt url to upload it with forms
            this.getPhotoUrl();


          });
        })


        this.uploadButtonClicked = true;
        this.uploadButtonHide = false;
      }
      catch (e) {
        console.error(e);
      }

    } else {
      this.showAlert();
    }
  }


  //validate requested claim 
  submitButtonClicked() {



    if (this.nameofpatient && this.patientrelationship && this.nameofdoctor
      && this.dateofExpen && this.ReceiptNo &&
      this.amountofExpen && this.natureofillness && this.requestDate && this.claimMonth &&
      this.NameOfEmployee && this.designation && this.EpfNo &&
      this.employeefile && this.availableBalance >= this.amountofExpen
    ) {

      let alert = this.alertCtrl.create({
        title: 'Confirm Submission',
        message: 'Do you want to submit your claim',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
             
            }
          },
          {
            text: 'Confirm',
            handler: () => {
              this.callConfirmRequest();
            }
          }
        ]
      });
      alert.present();

    } else if (this.amountofExpen > this.availableBalance) {
      this.showExceedAmountAlert();
    }
    else {
      this.showAlert();
    }
  }


  //amount of expenditure and available balance validation
  showExceedAmountAlert() {

    const alert = this.alertCtrl.create({
      title: 'Amount of Expenditure Exceed available balance',
      subTitle: 'You cannot claim higher than the availble balance amount',
      buttons: ['OK']
    });
    alert.present();
  }


  // upload requested cliam to the firebase
  callConfirmRequest() {

    this.fdb.list("/forms/").push({
      "patientName": this.nameofpatient,
      "relationship": this.patientrelationship,
      "nameDoctor": this.nameofdoctor,
      "dateofExpenditure": this.dateofExpen,
      "recieptNo": this.ReceiptNo,
      "amount": this.amountofExpen,
      "NatureIllness": this.natureofillness,
      "status": "submitted",
      "employeefile": this.employeefile,
      "requestDate": this.requestDate,
      "claimMonth": this.claimMonth,
      "NameOfEmployee": this.NameOfEmployee,
      "Designation": this.designation,
      "EpfNo": this.EpfNo,
      "user_id": this.userIdNo,
      "ClaimNo": this.claimNo


    });

    this.fdb.list('/users', ref => ref.orderByChild('user_id').equalTo(this.userIdNo)).snapshotChanges().subscribe(data => {

      this.fdb.object('/users/' + data[0].key).update({ pendingCount: this.pendingCount + 1 });

    })



    let currentIndex = this.navCtrl.getActive().index;
    this.navCtrl.push(PatientdetailsPage).then(() => {
      this.navCtrl.remove(currentIndex);
    });
  }


  //get receipt url
  getPhotoUrl() {

    firebase.storage().ref().child(this.userIdNo + "-" + (this.claimNo + 1)).getDownloadURL()
      .then((url) => {
        this.employeefile = url;

        this.loader.dismiss().then(() => {
          this.ReceiptUploaded = true;
        });
      })
  }


  //alert for empty fields
  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Empty fields',
      subTitle: 'Please complete the form before continue',
      buttons: ['OK']
    });
    alert.present();
  }


  //reset claim
  cancelButtonClicked() {
    let alert = this.alertCtrl.create({
      title: 'Cancel Request',
      message: 'Do you want to cancel your claim',
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
            let currentIndex = this.navCtrl.getActive().index;
            this.navCtrl.push(PatientdetailsPage).then(() => {
              this.navCtrl.remove(currentIndex);
            });
          }
        }

      ]
    });
    alert.present();
  }

  //delete uploaded receipt 
  deleteButtonClicked() {
    firebase.storage().ref().child(this.userIdNo + "-" + (this.claimNo + 1)).delete();
    this.uploadButtonHide = true;
    this.uploadButtonClicked = false;
    this.ReceiptUploaded = false;
    this.employeefile = '';
  }


}
