import { HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonServiceService } from '../services/common-service.service';
export interface DialogData {
  dlInfo: any;
  campInfo: any;
}
@Component({
  selector: 'app-push-popup',
  templateUrl: './push-popup.component.html',
  styleUrls: ['./push-popup.component.scss']
})
export class PushPopupComponent implements OnInit {

  items!: FormArray;
  constructor(private formBuilder: FormBuilder, private router: Router,@Inject(MAT_DIALOG_DATA) public data: DialogData, private commonServiceService: CommonServiceService) { 
    this.contactForm = this.formBuilder.group({
      campaignName: ['', Validators.required],
      dl1:[''],
      dl2:[''],
      dl3:[''],
      dl4:[''],
      myCategory: this.formBuilder.array(data.dlInfo)
    });
  }

  ngOnInit(): void {
    // this.addItem();
    // this.data.campInfo.re
    // this.data.campInfo =  this.data.campInfo.filter(item => item !== data_item);
    console.log("The data campInfo: "+this.data.dlInfo);
  }

  getPhonesFormControls(): any {
    return (<FormArray> this.contactForm.get('myCategory')).controls
  }
  contactForm: FormGroup;

  foods: any[] = [
    {value: 'Season-Sale-winter', viewValue: 'Season-Sale-winter'},
    {value: 'product-launch-shirt-x', viewValue: 'product-launch-shirt-x'},
  ];

  submit(){
    console.log('Your form data : ', this.contactForm.value);

    let dlParams = new HttpParams();
    dlParams = dlParams.append('user_id', this.commonServiceService.getUserName());
    dlParams = dlParams.append('campaign_id', this.contactForm.value.campaignName);

    let selectedDL = [];

    for(let obj of this.contactForm.value.myCategory){
      if(obj !== false){
        selectedDL.push(obj.delivery_system_id);
      }
    }

    console.log(selectedDL);

    this.commonServiceService.getPostDataFromDataSource('campaign-push',environment.apiEndPoint,'post',dlParams,selectedDL).subscribe((data)=>{
      console.log("Push to delivery :: : "+data);
      
    })
    this.router.navigate(['dlsystem'])
  }

}
