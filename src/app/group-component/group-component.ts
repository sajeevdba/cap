import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonServiceService } from '../services/common-service.service';
import { environment } from '../../environments/environment';
import { data, isNumeric } from 'jquery';



@Component({
  selector: 'group-component',
  templateUrl: './group-component.html',
  styleUrls: ['./group-component.scss']
})
export class GroupComponent implements OnInit, OnChanges {
  @Output() newItemEvent = new EventEmitter<object>();
  @Input()
  validate!: boolean;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  tooltip: any = "below"
  GroupformArray: FormGroup[] = [this.getNewGroup('Group')];
  GroupformArray1: FormGroup[] = [];
  calculateValue: any;
  grouparray: any = [];
  groupvalid: boolean = false;
  kpitypes: any = [];
  kpis: any = [];
  relations: any = [];
  kpimap = new Map();
  relationmap = new Map();

  getNewGroup(groupname: any): FormGroup {

    return this.fb.group({
      query: this.fb.array([this.getNewQuery()]),
      relation: '',
      groupNameforrelation: groupname,
      kpihistorymaintaned: ['', { value: [] }],

    })


  }

  getNewQuery(): FormGroup {
    return this.fb.group({
      kpitype: [null],
      kpi: [null, { disabled: true }],

      relation: [null, { disabled: true }],
      input: [null],
      input1: [null],
      input2: [null],
      kpirendered: ['', { value: [] }],
      relationrendered: ['', { value: [] }],
      kpidatarendered: ['', { value: [] }],
      renderedtext: ['false', { disabled: true }],
      renderedselect: ['false', { disabled: true }],
      renderedmultiselect: ['false', { disabled: true }],
      renderednumrange: ['false', { disabled: true }]

    })
  }




  constructor(private fb: FormBuilder, public dialog: MatDialog, private _snackBar: MatSnackBar, private commonServiceService: CommonServiceService) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.validate)
  }
  ngOnInit(): void {
    console.log('baseconfig', sessionStorage.getItem('base-config'))
    if (sessionStorage.getItem('base-config') == null && sessionStorage.getItem('base-config') == undefined) {
      this.commonServiceService.getDataFromDataSource('base-config', environment.apiEndPoint, 'GET', null).subscribe(
        (data) => {
          const jsonData = JSON.stringify(data)
          sessionStorage.setItem('base-config', jsonData);
          this.createQuerydropdownvalues(data)
        },
        error => {
          console.log(error)
        }
      )


    } else {
      let jsonvalue = sessionStorage.getItem('base-config');
      if (jsonvalue != null) {
        const jsonobj = JSON.parse(jsonvalue)
        this.createQuerydropdownvalues(jsonobj)
      }


    }

  }

  addformGroup() {
    let group: boolean = false;
    const count = this.GroupformArray.length;

    const groupname = "Group" + count;
    const count1 = count > 1 ? "-" + (count - 1) : '';
    const groupname1 = "Group  " + count1;

    for (let gi = 0; gi < this.GroupformArray.length; gi++) {
      let grp = this.GroupformArray[gi];
      let querys = this.getquerys(count - 1) as FormArray;
      console.log('addformgroup', querys.length)
      for (let qr = 0; qr < querys.length; qr++) {
        let query = querys.controls[qr];
        if (!(query.get('kpitype')?.value == null || query.get('kpitype')?.value == undefined)) {

          group = true;

        }
        else {
          group = false;
        }



      }
    }
    if (group) {
      this.GroupformArray.push(this.getNewGroup(groupname));

    } else {
      let msg = "Please Complete the  " + groupname1 + "Information"
      this.openSnackBar(msg, 'close');
    }
  }



  getquerys(index: any): FormArray {
    return this.GroupformArray[index].get('query') as FormArray;
  }
  addquerys(index: any) {
    const querys = this.GroupformArray[index].get('query') as FormArray

    let query = querys.controls[querys.length - 1];
    if (!(query.get('kpitype')?.value == null || query.get('kpitype')?.value == undefined)) {
      querys.push(this.getNewQuery())

    }
    else {
      this.openSnackBar('Please Complete the Query  Information', 'close');
    }





  }
  deletequerys(groupindex: any, query: any) {
    const querys = this.GroupformArray[groupindex].get('query') as FormArray
    const kpivalue = querys.controls[query].get('kpi')?.value
    const kpihistory = this.GroupformArray[groupindex].get('kpihistorymaintaned')?.value
    console.log('kpihisotye', kpihistory)
    console.log(kpivalue)
    let kpihistoryarr=[];

    for (let kh = 0; kh < kpihistory.length; kh++) {
      kpihistoryarr.push(kpihistory[kh])
    }
    console.log('kpihistorylength', kpihistoryarr.length)
    for (let itr = 0; itr < kpihistoryarr.length; itr++) {

      let kpid = kpivalue.id;
      console.log(kpid)
      let kpihistoryid = kpihistoryarr[itr].id
      console.log(kpihistoryid)

      if (kpid == kpihistoryid) {
        kpihistoryarr.splice(itr,1);
        break;
      }
    }
    console.log(kpihistoryarr)
    querys.removeAt(query);
  }

  deleteform(index: any) {
    this.GroupformArray.splice(index, 1)
    this.generateKpiQuery();
  }

  submitform() {
    console.log(this.GroupformArray.length)
    this.GroupformArray1 = this.GroupformArray
    this.GroupformArray = [this.getNewGroup('Group')];
  }

  editform() {
    console.log(this.GroupformArray1)
    this.GroupformArray = this.GroupformArray1;
  }

  kpitypeChange(event: any, groupindex: any, qu: any) {
    const querys = this.GroupformArray[groupindex].get('query') as FormArray
    //querys.controls[qu].get('kpirendered')?.setValue(false)
    querys.controls[qu].get('kpi')?.enabled
    this.kpimap.get(event.value);
    console.log(this.kpimap.get(event.value))
    querys.controls[qu].get('kpirendered')?.setValue(this.kpimap.get(event.value))
    //this.generateKpiBasedonIndex(groupindex, qu, event.value)



    // this.kpis = this.kpiselectedMap.get(groupindex+'-'+qu);


  }


  relation(event: any, groupindex: any, qu: any) {
    let kpihistoryarr = [];
    const kpihistory = this.GroupformArray[groupindex].get('kpihistorymaintaned')?.value
    console.log('kpihisotye', kpihistory)
    for (let kh = 0; kh < kpihistory.length; kh++) {
      kpihistoryarr.push(kpihistory[kh])
    }
    let kpidvalue: boolean = false;
    console.log('kpihistorylength', kpihistoryarr.length)
    for (let itr = 0; itr < kpihistoryarr.length; itr++) {

      let kpid = event.value.id;
      console.log(kpid)
      let kpihistoryid = kpihistoryarr[itr].id
      console.log(kpihistoryid)

      if (kpid == kpihistoryid) {
        kpidvalue = true;
        break;
      }
    }
    if (!kpidvalue) {
      const querys = this.GroupformArray[groupindex].get('query') as FormArray
      querys.controls[qu].get('relation')?.enabled


      console.log(event.value)
      let kpivalue = event.value;
      let relationkey = "relation-" + event.value.kpiRelationGroupId
      let value = this.relationmap.get(relationkey);
      console.log(relationkey)
      console.log(value)
      querys.controls[qu].get('relationrendered')?.setValue(value);
    }
    else {
      this.openSnackBar('Already Kpi have value either update /Add new group for query', 'close');
    }

  }
  final(event: any, groupindex: any, qu: any) {
    sessionStorage.removeItem(groupindex + qu)

    const kpirendertype = event.value.type;

    console.log(event.value.type)
    const querys = this.GroupformArray[groupindex].get('query') as FormArray

    const kpivalue = querys.controls[qu].get('kpi')?.value

    console.log('value of kpi', kpivalue)

    if (kpirendertype == "text") {

      querys.controls[qu].get('renderedtext')?.setValue(true)
      querys.controls[qu].get('renderedselect')?.setValue(false);
      querys.controls[qu].get('renderedmultiselect')?.setValue(false)

      querys.controls[qu].get('renderednumrange')?.setValue(false)
    }
    else if (kpirendertype == "select") {
      querys.controls[qu].get('renderedtext')?.setValue(false)
      querys.controls[qu].get('renderedselect')?.setValue(true);
      querys.controls[qu].get('renderedmultiselect')?.setValue(false)

      querys.controls[qu].get('renderednumrange')?.setValue(false)
      this.generatekpidata(groupindex, qu, kpivalue)

    }
    else if (kpirendertype == "multiSelect") {
      querys.controls[qu].get('renderedtext')?.setValue(false)
      querys.controls[qu].get('renderedselect')?.setValue(false);
      querys.controls[qu].get('renderedmultiselect')?.setValue(true)

      querys.controls[qu].get('renderednumrange')?.setValue(false)
      this.generatekpidata(groupindex, qu, kpivalue)

    }
    else if (kpirendertype == "numberRange") {
      querys.controls[qu].get('renderedtext')?.setValue(false)
      querys.controls[qu].get('renderedselect')?.setValue(false);
      querys.controls[qu].get('renderedmultiselect')?.setValue(false)

      querys.controls[qu].get('renderednumrange')?.setValue(true)
    }



  }


  generateKpiQuery() {
    let grouparray = this.GroupformArray;
    const groupmap = new Map();
    const groupRelation=new Map();
    for (let gi = 0; gi < grouparray.length; gi++) {
      let grp = grouparray[gi];
      const groupname = grp.get('groupNameforrelation')?.value;
      const relation = grp.get('relation')?.value;
      groupRelation.set(groupname,relation)
      let querys = grp.get('query') as FormArray;
      let queryarray = [];
      for (let qr = 0; qr < querys.length; qr++) {
        let query = querys.controls[qr];
        if (query.get('kpitype') != null) {

        }
        let kpitype = query.get('kpitype')?.value;
        let kpi = query.get('kpi')?.value;
        console.log(kpi);
        let qrelation = query.get('relation')?.value;
        console.log(qrelation)
        let input = query.get('input')?.value;
        console.log(input)
        let input1 = query.get('input1')?.value;
        console.log(input1)

        let querydata = '';

        if (qrelation.type == 'numberRange') {
          querydata = kpi.name + ' ' + qrelation.value + ' ' + input + ',' + input1;


        }
        else if(qrelation.type =="select"){
          querydata = kpi.name + ' ' + qrelation.value + ' ' + input.name ;


        }

        else if(qrelation.type =="multiSelect"){
          let value=[]
          for (let ins=0;ins<input.length;ins++){
              value.push(input[ins].name)
          }
          querydata = kpi.name + ' ' + qrelation.value + ' ' +value;


        }
        else {
          querydata = kpi.name + ' ' + qrelation.value + ' ' + input
        }
        console.log("querydata", querydata.length)
        if (querydata) {
          queryarray.push(querydata)
        }
        //console.log(queryarray)
        groupmap.set(groupname, queryarray)
      }
      //  console.log('group value',groupname)
    }
    console.log(groupmap)
    let grouparrobj: any = [];
    groupmap.forEach((value: boolean, key: string) => {
      console.log(key, value);
      let obj = {
        'groupName': key,
        'configkey': value,
        'relation':groupRelation.get(key)
      }
      grouparrobj.push(obj)

    });
    console.log(grouparrobj)
    this.grouparray = grouparrobj;
  }



  submitformArray() {

    let grouparray = this.GroupformArray;
    const grouparrayval = [];



    for (let gi = 0; gi < grouparray.length; gi++) {

      let groupobj = {
        'groupName': '',
        'kpiobject': new Array,
        'grouplevelRelation': ''
      }
      let grp = grouparray[gi];
      const groupname = grp.get('groupNameforrelation')?.value;

      const relation = grp.get('relation')?.value;
      let querys = grp.get('query') as FormArray;
      let queryarray = [];
      for (let qr = 0; qr < querys.length; qr++) {
        let query = querys.controls[qr];
        let kpiobject = {
          'kpitype': "",
          'kpi': "",
          'relation': "",
          'input': new Array
        }
        let kpitype = query.get('kpitype')?.value;
        let kpiobj = query.get('kpi')?.value;
        let kpi = kpiobj.name
        let qrelationobj = query.get('relation')?.value;
        let qrelation = qrelationobj?.value
        let qrelationtype = qrelationobj?.type
        console.log('qrelationtype', qrelationtype)
        let input = query.get('input')?.value;
        let input1 = query.get('input1')?.value;


        kpiobject.kpitype = kpitype;
        kpiobject.kpi = kpi;
        kpiobject.relation = qrelation
        let inputdata: any;
        if (qrelationtype == "select") {

          inputdata = input.name

        }
        else if (qrelationtype == "multiSelect") {
          console.log("multi select", input)
          let inputarray = input
          let obj = []
          for (let inp = 0; inp < inputarray.length; inp++) {
            console.log(inputarray[inp])
            obj.push(inputarray[inp].name)


          }
          inputdata = obj
        }
        else if (qrelationtype == "numberRange") {
          console.log("numberRange")
          let obj = [];
          obj.push(input)
          obj.push(input1)
          inputdata = obj
        }

        else {
          inputdata = input
        }
        kpiobject.input = inputdata


        queryarray.push(kpiobject);

      }
      groupobj.groupName = groupname;
      groupobj.grouplevelRelation = relation
      groupobj.kpiobject = queryarray;
      grouparrayval.push(groupobj)
    }
    this.newItemEvent.emit(grouparrayval)
  }

  calculate() {
    this.calculateValue = "2345";
  }

  generatekpidata(groupIndex: any, qu: any, kpiobj: any) {
    const querys = this.GroupformArray[groupIndex].get('query') as FormArray
    const obj = {
      "kpiDependency": new Array,
      "kpiId": kpiobj.id
    }

    let kpihistoryarr = [];
    let kpiDependency=[];
    const kpihistory = this.GroupformArray[groupIndex].get('kpihistorymaintaned')?.value
    console.log('kpihisotye', kpihistory)
   
      // kpihistoryarr.push(kpihistory)
      kpihistoryarr = kpihistory;
   
    kpiDependency=kpiobj.kpiDependency
    console.log('kpihistorylength', kpihistoryarr)
    if(kpiDependency.length>0){
      for (let kpidep = 0; kpidep < kpiDependency.length; kpidep++) {
        let kpiId=kpiDependency[kpidep]
        for (let itr = 0; itr < kpihistoryarr.length; itr++) {

          console.log(kpiId)
          let kpihistoryid = kpihistoryarr[itr].id
          console.log(kpihistoryid)
    
          if (kpiId == kpihistoryid) {
            obj.kpiDependency.push(kpihistoryarr[itr])
          }
        }
      }
    }
   
    const body = JSON.stringify(obj);
    this.commonServiceService.getDataFromDataSource('kpi-data', environment.apiEndPoint, 'POST', body).subscribe(
      (data) => {
        console.log('value of data', data.data)

        sessionStorage.setItem(groupIndex + qu, JSON.stringify(data.data))
        querys.controls[qu].get('kpidatarendered')?.setValue(data.data);

      }
    )
  }

  showpopup() {
    this.generateKpiQuery();

    const dialogRef = this.dialog.open(PopupComponent, {
      width: '50%',
      height: '50%',
      hasBackdrop: true,
      disableClose: true,




      data: { show: true, queryarray: this.grouparray },
    });


  }
  openSnackBar(msg: string, action: string) {
    this._snackBar.open(msg, action, {
      panelClass: ['snack-bar-container-val'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }



  change(gridx: any, qu: any, event: any) {
    const querys = this.GroupformArray[gridx].get('query') as FormArray
    const kpivalue = querys.controls[qu].get('kpi')?.value
    let kpidatas: any = [];
    //console.log('value of kpi', kpivalue)
    if (sessionStorage.getItem(gridx + qu) != null) {
      console.log('sessionvalue', sessionStorage.getItem(gridx + qu))
      let jsonobj: any = []
      jsonobj = sessionStorage.getItem(gridx + qu)

      kpidatas = JSON.parse(jsonobj)
    }


    const val = event.target.value;
    const filterValue = val.toLowerCase();
    console.log(filterValue)

    const kpidata1 = kpidatas.filter(function (kpidata: any) {
      if (kpidata.name.toLowerCase().includes(filterValue)) {
        return kpidata
      }

    });

    console.log(kpidata1.length)

    if (kpidata1.length == 0) {
      querys.controls[qu].get('kpidatarendered')?.setValue(kpidatas)

    }
    else {
      console.log(kpidata1)
      querys.controls[qu].get('kpidatarendered')?.setValue(kpidata1)
    }

  }







  createQuerydropdownvalues(data: any) {

    if (data != null && data != undefined) {
      const kpitypes = data.kpitypes;
      console.log(kpitypes)

      for (let kpitype = 0; kpitype < kpitypes.length; kpitype++) {
        this.kpitypes.push(kpitypes[kpitype].name);
        if (this.kpimap.get(kpitypes[kpitype].name) == undefined || this.kpimap.get(kpitypes[kpitype].name) == null) {
          const kpiarray = kpitypes[kpitype].kpis;

          this.kpimap.set(kpitypes[kpitype].name, kpiarray)
        }
      }

      if (data.relation != null && data.relation != undefined) {

        console.log(data.relation)
        const keys = Object.keys(data.relation);
        //  console.log(keys)
        console.log(Object.keys(data.relation)[0], Object.values(data.relation)[0])
        for (let key = 0; key < keys.length; key++) {

          this.relationmap.set("relation-" + Object.keys(data.relation)[key], Object.values(data.relation)[key])
        }

      }

    }


  }

  input(event: any, gridx: any, qu: any) {
    console.log(event.value)
    let value = []
    console.log("input method", event.value)
    if (event.value.length > 1) {
      for (let e = 0; e < event.value.length; e++) {
        let eobj = event.value[e];
        value.push(eobj.value)
      }

    }
    else {
      value.push(event.value[0].value)
    }
    const kpihistorymaintaned = this.GroupformArray[gridx].get('kpihistorymaintaned')?.value
    console.log('kpihistory maintained', kpihistorymaintaned)
    const querys = this.GroupformArray[gridx].get('query') as FormArray
    const kpivalue = querys.controls[qu].get('kpi')?.value
    const relation = querys.controls[qu].get('relation')?.value
    console.log(relation)
    let obj = { 'id': kpivalue.id, 'relation': relation.value, 'value': value, 'kpidep': kpivalue.kpiDependency }
    console.log('obj', obj)
    console.log('grouparrr',)
    if (kpihistorymaintaned != null && kpihistorymaintaned != undefined && kpihistorymaintaned != "") {
      let value = [];
      // value.push(kpihistorymaintaned);
      value = kpihistorymaintaned;
      let valuepresnet: boolean = false;
      if (relation.type == "multiSelect") {
        for (let val = 0; val < value.length; val++) {
          let index = value[val];
          if (index.id == obj.id) {
            value[val] = obj
            valuepresnet = true;

            break;
          }

        }
        if (!valuepresnet) {
          value.push(obj);
        }
      }
      else {
        value.push(obj);

      }
      console.log('inside of input', kpihistorymaintaned)
      //value.push(obj)
      // kpihistorymaintaned.push(obj);
      console.log('final value', value)
      this.GroupformArray[gridx].get('kpihistorymaintaned')?.setValue(value)
    }
    else {
      this.GroupformArray[gridx].get('kpihistorymaintaned')?.setValue([obj])

    }
    console.log(kpivalue)
    console.log(relation)
  }

}
