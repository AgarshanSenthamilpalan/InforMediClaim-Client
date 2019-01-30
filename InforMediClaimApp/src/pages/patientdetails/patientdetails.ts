import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { storage } from 'firebase';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database'
import { Camera, CameraOptions } from "@ionic-native/camera"
import { AlertController } from 'ionic-angular';
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
  employeefile = [];
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
  receiptCount = 0;
  receiptDatabaseNumber;
  requestedClaimAmount;
  maxDate: string = new Date().toISOString();
  public buttonClicked: boolean = false;


  requestedClaimData
  requestDate

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
        this.requestedClaimAmount = userData[0]['requestedClaimAmount'];
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

          const pictures = storage().ref(this.userIdNo + "/" + ((parseInt(this.claimNo) + 1))).child(this.userIdNo + "-" + (this.claimNo + 1) + "-" + this.receiptCount);
          pictures.putString(image, 'data_url').then(data => {


            //get receipt url to upload it with forms
            this.getPhotoUrl();


          });
        })


        this.uploadButtonClicked = true;
        // this.uploadButtonHide = false;
      }
      catch (e) {
      alert("theradfdf" + e);
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
      this.employeefile && (this.availableBalance - this.requestedClaimAmount) >= this.amountofExpen
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

    } else if ((this.availableBalance - this.requestedClaimAmount) < this.amountofExpen) {
      this.showExceedAmountAlert();
    }
    else {
      this.showAlert();
    }
  }


  //claimable amount exceed
  showExceedAmountAlert() {

    const alert = this.alertCtrl.create({
      title: 'Amount of Expenditure Exceed claimable amount',
      subTitle: 'You cannot claim higher than the claimable amount',
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
    var finalRequestedClaimAmount = parseFloat(this.requestedClaimAmount) + parseFloat(this.amountofExpen);
    var updateCount = this.fdb.list('/users', ref => ref.orderByChild('user_id').equalTo(this.userIdNo)).snapshotChanges().subscribe(data => {

      this.fdb.object('/users/' + data[0].key).update({ pendingCount: this.pendingCount + 1, requestedClaimAmount: finalRequestedClaimAmount });
      updateCount.unsubscribe();
    })


    var remainingClaimBalance = this.availableBalance - this.requestedClaimAmount
    document.getElementById("validate_balance").innerHTML = "Maximum claimable amount " + remainingClaimBalance.toString();

    let currentIndex = this.navCtrl.getActive().index;
    this.navCtrl.push(PatientdetailsPage).then(() => {
      this.navCtrl.remove(currentIndex);
    });
    
    

    
  }


  //get receipt url
  getPhotoUrl() {

    firebase.storage().ref(this.userIdNo + "/" + (parseInt(this.claimNo) + 1)).child(this.userIdNo + "-" + (this.claimNo + 1) + "-" + this.receiptCount).getDownloadURL()
      .then((url) => {

        this.employeefile[this.receiptCount] = url;
        this.loader.dismiss().then(() => {
          // this.ReceiptUploaded = true;
          this.receiptCount = this.receiptCount + 1;

          this.receiptDatabaseNumber = this.userIdNo + "-" + (this.claimNo + 1) + "-" + this.receiptCount;
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

  // delete uploaded receipt 
  deleteButtonClicked(element) {

    let alert = this.alertCtrl.create({
      title: 'Delete Receipt',
      message: 'Do you want to delete the receipt',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            firebase.storage().ref(this.userIdNo + "/" + (parseInt(this.claimNo) + 1)).child(this.userIdNo + "-" + (this.claimNo + 1) + "-" + (this.receiptCount - 1)).delete();
            this.uploadButtonHide = true;
            this.uploadButtonClicked = false;
            if (element !== -1) {
              this.employeefile.splice(element, 1);
              console.log(this.employeefile);
            }

          }
        }
      ]
    });
    alert.present();


  }


}
