
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CommonServiceService } from '../services/common-service.service';

@Component({
  selector: 'app-app-create-segment',
  templateUrl: './app-create-segment.component.html',
  styleUrls: ['./app-create-segment.component.scss']
})
export class AppCreateSegmentComponent implements OnInit {
  campaignForm!: FormGroup;
  campaignerror: boolean = false;
  segmenterror: boolean = false;
  validate: boolean = true;
  groupFormarray: FormGroup[] = [];
  options = [
    'campaign1',
    'campaign2',
    'campaigntest',
    'campaign4',
    'campaign5',
    'campaigntes6',
  ];
  filteredOptions!: Observable<string[]>;

  constructor(private fb: FormBuilder, private router: Router, private commonServiceService: CommonServiceService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }


  ngOnInit(): void {
    this.campaignForm = this.fb.group({
      campaign: [null, Validators.required],
      segmentName: [null, Validators.required],
    });
    this.filteredOptions = this.campaignForm.controls['campaign'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  validatefield(value: any) {
    let campaign = this.campaignForm.controls['campaign'].value;
    let segmentName = this.campaignForm.controls['segmentName'].value;
    if (value == "campaign") {
      if (campaign == null || campaign == undefined || campaign == '') {
        this.campaignerror = true;
      }
      else {
        this.campaignerror = false;
      }
    }
    else if (value == "segment") {
      if (segmentName == null || segmentName == undefined || segmentName == '') {
        this.segmenterror = true;
      }
      else {
        this.segmenterror = false;
      }
    }
    if (this.campaignerror || this.segmenterror) {
      this.validate = true;
    }
    else {
      this.validate = false;
    }

  }

  getandsubmit(newItem: object) {
    let obj = {
      campaignName: "",
      segmentName: "",
      segmentReach: 0,
      treatmentSplit: 0,
      campaignId: 0,
      segmentId: 0,
      groups: new Object,
    }
    let campaign = this.campaignForm.controls['campaign'].value;
    let segmentName = this.campaignForm.controls['segmentName'].value;
    obj.campaignName = campaign;
    obj.segmentName = segmentName;
    obj.groups = newItem;

    obj.segmentReach = 0;
    obj.treatmentSplit = 0;
    obj.campaignId = 0;
    obj.segmentId = 0;


    // console.log("obj==>", obj);
    console.log(JSON.stringify(obj));

    let dlParams = new HttpParams();
    dlParams = dlParams.append('user_id', this.commonServiceService.getUserName());

    this.commonServiceService.getPostDataFromDataSource('custom-segment',environment.apiEndPoint,'post',dlParams,obj).subscribe((data)=>{
      console.log("create segment success:: : "+data);
      this.router.navigate(['track'])
      
    })
  }








}
