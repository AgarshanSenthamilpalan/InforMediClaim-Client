import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { PatientdetailsPage } from '../patientdetails/patientdetails';
import { DecimalPipe } from '@angular/common';
declare var google;

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
 
})



export class DashboardPage {
  
  
  currentUser
  name
  limit
  requestedClaimAmount
  balance
  
  userIdNo
  reqDate
  dateType

  releaseTodayAmount = 0;

  releasedAmount =0;
  accpetedAmount = 0;
  rejectedAmount = 0;
  submittedAmount =0;
  readyAmount =0;


  submittedCount =0;
  releaseCount =0;
  acceptedCount =0;
  rejectedCount =0;
  readyCount =0;

  constructor(private decimalPipe: DecimalPipe,public fdb: AngularFireDatabase, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    //retrieve data of useres
    var cur_day = new Date().getDate();
    var cur_month = new Date().getMonth() + 1;
    var cur_year = new Date().getFullYear();
    this.reqDate = cur_year + '-' + cur_month + '-' + cur_day;
    this.dateType = "today";
    console.log("today" + this.reqDate);
    this.userIdNo=sessionStorage.getItem('userId');
        this.fetchDataFromUsers();
        this.retreiveTodayData();

  }

  ionViewDidLoad(){
   
  }

  //retrieve the current user details
  fetchDataFromUsers() {
    
    this.fdb.list('/users', ref => ref.orderByChild('user_id').equalTo(this.userIdNo)).valueChanges().subscribe(userData => {

      this.currentUser = userData[0];
      console.log(userData);
      this.populateUserDetails();
    }
    );
    
  }
  
  
  //populate user details in UI
  populateUserDetails() {
    this.name = this.currentUser.name;
   
    this.limit = this.currentUser.limit;
    this.balance = this.currentUser.balance;
    this.requestedClaimAmount = this.currentUser.requestedClaimAmount;
    console.log("requestedClaimAmount "+this.requestedClaimAmount)
    this.drawChart();
    
  }


  drawChart() {

    var data = google.visualization.arrayToDataTable([
      ["Claim Type", "", { role: "style" } ],
      ["Claim limit", this.limit, "#FF0000"],
      ["Available balance", this.balance, "#0000FF"],
      ["Requested claim amount", this.requestedClaimAmount, "#008000"],
      // ["Platinum", 21.45, "color: #e5e4e2"]
    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);

    var options = {
     chartArea: { left: "20%" },
      // width: 500,
      height: 300,
      // bar: {groupWidth: "95%"},
      // legend: { position: "none" },
    };
    var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
    chart.draw(view, options);

    


    // // Create the data table.
    // var data = new google.visualization.DataTable();
    // data.addColumn('string', 'Title');
    // data.addColumn('number', 'amount');
    // data.addRows([
    //   ['Claim limt', this.limit],
    //   ['Available balance', this.balance],
    //   ['Requested claim amount', this.requestedClaimAmount]
    // ]);

    // // Set chart options
    // var options = {
    //                'width':400,
    //                'height':300};

    // // Instantiate and draw our chart, passing in some options.
    // var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    // chart.draw(data, options);
  }


  drawTable(submittedCount,submittedAmount,readyCount,readyAmount,releaseCount,accpetedCount,rejectedCount,releasedAmount,accpetedAmount,rejectedAmount) {
    
    
    
    
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Type');
    data.addColumn('string', 'Amount');
    data.addColumn('string', 'Number of Request');
    data.addRows([
      ['Claimed', "LKR "+ this.decimalPipe.transform(this.releasedAmount, '1.2-2').toString(),releaseCount.toString()],
      ['ready', "LKR "+ this.decimalPipe.transform(this.readyAmount, '1.2-2').toString(),readyCount.toString()],
      ['accepted', "LKR "+ this.decimalPipe.transform(this.accpetedAmount, '1.2-2').toString(),accpetedCount.toString()],
      ['Submitted', "LKR "+ this.decimalPipe.transform(this.submittedAmount, '1.2-2').toString(),submittedCount.toString()],
      ['Rejected', "LKR "+ this.decimalPipe.transform(this.rejectedAmount, '1.2-2').toString(),rejectedCount.toString()],
    ]);

    var table = new google.visualization.Table(document.getElementById('table_div'));

    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
  }

retreiveMonthData(){
  this.fdb.list('/forms', ref => ref.orderByChild('user_id').equalTo(this.userIdNo)).valueChanges().subscribe(userData => {

    userData.forEach(element => {
      if(new Date(element['requestDate']).getMonth() ==new Date().getMonth()){
           
        this.retrieveData(element['status'],element['amount']);
        
      }
    }
    
    );


  }
);

  }


  retreiveTodayData(){
    this.fdb.list('/forms', ref => ref.orderByChild('user_id').equalTo(this.userIdNo)).valueChanges().subscribe(userData => {
  
      userData.forEach(element => {
        if(element['requestDate'] ==this.reqDate.toString()){
         
          this.retrieveData(element['status'],element['amount']);
              console.log(element['status'])
             
        }
      }
      );
    }
  );
  
    }

    retreiveYearData(){
      this.fdb.list('/forms', ref => ref.orderByChild('user_id').equalTo(this.userIdNo)).valueChanges().subscribe(userData => {
    
        userData.forEach(element => {
          if(new Date(element['requestDate']).getFullYear() ==new Date().getFullYear()){
           
            this.retrieveData(element['status'],element['amount']);
                console.log(element['status'])
               
          }
        }
        );
      }
    );
    
      }



  segmentChanged(type)
  {
    this.releasedAmount =0;
      this.accpetedAmount = 0;
      this.rejectedAmount = 0;
      this.submittedAmount =0;
      this.readyAmount =0;

      this.submittedCount =0;
      this.releaseCount =0;
      this.acceptedCount =0;
      this.rejectedCount =0;
      this.readyCount =0;

    console.log(type);
    if(type.value =="month"){

      this.retreiveMonthData();
    }

    if(type.value=="today"){

      this.retreiveTodayData();

    }
    
    if(type.value=="year"){

      this.retreiveYearData();

    }

  }
 
  retrieveData(elementStatus,elementAmount){
      if(elementStatus == "released")
          {
            this.releaseCount = this.releaseCount + 1;
            this.releasedAmount = this.releasedAmount + parseFloat(elementAmount);
            
            // console.log("amount" + this.releasedMonthAmount);
          }
          if(elementStatus == "accepted"){
  
            this.acceptedCount = this.acceptedCount + 1;
            this.accpetedAmount = this.accpetedAmount + parseFloat(elementAmount);
          }
          if(elementStatus== "rejected"){
  
            this.rejectedCount = this.rejectedCount + 1;
            this.rejectedAmount = this.rejectedAmount + parseFloat(elementAmount);
          }
  
          if(elementStatus== "submitted"){
  
            this.submittedCount = this.submittedCount + 1;
            this.submittedAmount = this.submittedAmount + parseFloat(elementAmount);
          }
  
          if(elementStatus == "ready"){
  
            this.readyCount = this.readyCount + 1;
            this.readyAmount = this.readyAmount + parseFloat(elementAmount);
          }

          this.drawTable(this.submittedCount,this.submittedAmount,this.readyCount,this.readyAmount,this.releaseCount,this.acceptedCount,this.rejectedCount,this.releasedAmount,this.accpetedAmount,this.rejectedAmount);
  }

  newRequestClicked(){
    let currentIndex = this.navCtrl.getActive().index;
    this.navCtrl.push(PatientdetailsPage).then(() => {
      this.navCtrl.remove(currentIndex);});
  }

}
