import { Component, ViewChild, OnInit, OnChanges, AfterViewInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';
import { PushPopupComponent } from '../push-popup/push-popup.component';
import { MatPaginator } from '@angular/material/paginator';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import { data } from 'jquery';
import { CommonServiceService } from '../services/common-service.service';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-app-track',
  templateUrl: './app-track.component.html',
  styleUrls: ['./app-track.component.scss']
})
export class AppTrackComponent implements OnInit, OnChanges, AfterViewInit  {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageSize = 10;

  displayedColumns: string[] = ['position', 'cTag', 'sTag', 'cDate', 'Tbefore', 'Tpost', 'Tcost','new'];

  campaignInfo: any[] = [
    {campaign_id: 'All', campaign_name: 'All'},
    {campaign_id: 'Season-Sale-winter', campaign_name: 'Season-Sale-winter'},
    {campaign_id: 'product-launch-shirt-x', campaign_name: 'product-launch-shirt-x'},
  ];
  contactForm: FormGroup;
  campaignSelected = "All";


  constructor(public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder, private commonServiceService: CommonServiceService) { 
    this.contactForm = this.formBuilder.group({
      campaignName: ['']
    });
  }
  ngAfterViewInit(): void {
    // this.commonServiceService.getDataFromDataSource('assets/data.json',environment.localEndPoint,'get','null').subscribe((data)=>{
    //   console.log("fetched the data : "+data);
    //   this.data = data;
    //   this.dataSource = new MatTableDataSource(this.data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // })

    let params = new HttpParams();
    params = params.append('user_id', this.commonServiceService.getUserName());

    this.commonServiceService.getDataFromDataSource('segment',environment.apiEndPoint,'get',params).subscribe((data)=>{
      console.log("Table data : "+data);
       this.data = data;
       this.dataSource = new MatTableDataSource(this.data);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
     })
  }

  data: any = [];


  dataSource!: MatTableDataSource<any>; 
  cloneData: any;
  deliverySysInfo: any;
  ngOnInit(): void {

    console.log("The username fetched : "+this.commonServiceService.getUserName());
    
    this.campaignSelected = 'All';
    let params = new HttpParams();
    params = params.append('user_id', this.commonServiceService.getUserName());
    this.commonServiceService.getDataFromDataSource('campaign',environment.apiEndPoint,'get',params).subscribe((data)=>{
      console.log("fetched the data : "+data);
      this.campaignInfo = data;
      this.campaignInfo.push({
        campaign_id: 9999,
        campaign_name: "All"
      });
    })

   
   



    let dlParams = new HttpParams();
    dlParams = dlParams.append('del_sys', "true");


    this.commonServiceService.getDataFromDataSource('base-config',environment.apiEndPoint,'get',dlParams).subscribe((data)=>{
      console.log("fetched the data : "+data.del_sys[0].delivery_system_name);
      this.deliverySysInfo = data.del_sys;
    })
    
  }

  ngOnChanges(){
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
  }

  openPopup(event: any){
    console.log("clicked on update");
    this.openDialog(event);
  }

  openDialog(event: any) {
    

    let params = new HttpParams();
    params = params.append('user_id', this.commonServiceService.getUserName());
    params = params.append('campaign_id', event.campaign_id);
    params = params.append('segment_id', event.segment_id);
    params = params.append('kpi_config', "true");

    this.commonServiceService.getDataFromDataSource('segment',environment.apiEndPoint,'get',params).subscribe((data)=>{
      console.log("Table data : "+data);
      console.log(JSON.parse(data[0].segment_query_config));
      // let output = this.generateKpiQuery(JSON.parse(data[0].segment_query_config));
      console.log("output");
      const dialogRef = this.dialog.open(PopupComponent, {
        width: '75%',
        height:'75%',
        autoFocus: false,
        data: {track:true,trackTitle:"DB TRACK INFO",trackInfo: this.trackInfo, cId:"	Season-Sale-winter",sId:"Older-Women", cDate: "22/10/2021 00:00:00", status:"Success", query: JSON.parse(data[0].segment_query_config)},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
     })

    
  }

  editClicked(){
    this.router.navigate(['create']);
  }

  deleteRow(element: any){
    // this.dataSource = this.dataSource.filter(u => u.id !== id);

    let params = new HttpParams();
    params = params.append('user_id', this.commonServiceService.getUserName());
    params = params.append('campaign_id', element.campaign_id);
    params = params.append('segment_id', element.segment_id);

    this.commonServiceService.deleteDataFromDataSource('custom-segment',environment.apiEndPoint,'DELETE',params,"").subscribe((output)=>{
      this.dataSource.data.splice(this.data.indexOf(element),1);
      this.dataSource = new MatTableDataSource<any>(this.dataSource.data);
      this.dataSource.paginator = this.paginator;
      if(this.campaignSelected === 'All'){
        this.dataSource.filter = '0';
      }else{
        this.dataSource.filter = this.campaignSelected;
      }
      this.dataSource.sort = this.sort;
    });


    
  }

  foods: any[] = [
    {value: 'steak', viewValue: 'Steak'},
    {value: 'pizza', viewValue: 'Pizza'},
    {value: 'tacos', viewValue: 'Tacos'},
  ];
  
  pushToDB(){
    const dialogRef = this.dialog.open(PushPopupComponent,{
      width: '50%',
      height:'40%',
      data: {dlInfo: this.deliverySysInfo, campInfo: this.campaignInfo }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }  

  capmpaignChanged(val: any){
    this.campaignSelected = val;
    if(val === 'All'){
      this.dataSource.filter = '0';
    }else{
      this.dataSource.filter = val;
    }
  }

  sortData(event: any){
    console.log("sort : "+event);
    this.dataSource.sortData
  }

  onRefreshClick(){
    console.log("Refreshed click");
    // this.commonServiceService.getDataFromDataSource('assets/data.json','','get','').subscribe((data)=>{
    //   console.log("fetched the data : "+data);
    //   this.data = data;
    //   this.dataSource = new MatTableDataSource(this.data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // })

    let params = new HttpParams();
    params = params.append('user_id', this.commonServiceService.getUserName());

    this.commonServiceService.getDataFromDataSource('segment',environment.apiEndPoint,'get',params).subscribe((data)=>{
      console.log("Table data : "+data);
       this.data = data;
       this.dataSource = new MatTableDataSource(this.data);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
     })
  }

  trackInfo = " Learn one way to build applications with Angular and reuse your code and abilities to build apps for any deployment target. For web, mobile web, native mobile and native desktop. "



}

