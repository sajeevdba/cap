import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { CommonServiceService } from './services/common-service.service';
import { environment } from '../environments/environment';
import { MsalService } from '@azure/msal-angular';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CAP';
  empForm: FormGroup;
  foods: any[] = [
    {value: 'steak', viewValue: 'Steak'},
    {value: 'pizza', viewValue: 'Pizza'},
    {value: 'tacos', viewValue: 'Tacos'},
  ];
 
  constructor(private fb: FormBuilder,private commonServiceService: CommonServiceService, private authService: MsalService) {
    this.empForm = this.fb.group({
      employees: this.fb.array([])
    });
  }
 
  ngOnInit() {
    // this.addEmployee();
    // this.addEmployeeSkill(0);
    // let params = new HttpParams();
    // params = params.append('user_id', this.commonServiceService.getUserName());
    // // params = params.append('_limit', "10");
    // this.commonServiceService.getDataFromDataSource('campaign',environment.apiEndPoint,'get',params).subscribe((data)=>{
    //   console.log("fetched the data : "+data);
    // })

    if (this.authService.getAccount().userName !== undefined) {
      let enterpriseId = this.authService.getAccount().userName;
      this.commonServiceService.setUserName(enterpriseId);
      // this.username = enterpriseId;
      // this.name = this.authService.getAccount().name;
      console.log("username : "+enterpriseId);
    }
    else {
      console.log("Guest");
    }
  }
 
  employees(): FormArray {
    return this.empForm.get('employees') as FormArray;
  }
 
  newEmployee(): FormGroup {
    return this.fb.group({
      skills: this.fb.array([])
    });
  }
 
  addEmployee() {
    this.employees().push(this.newEmployee());
  }
 
  removeEmployee(empIndex: number) {
    this.employees().removeAt(empIndex);
  }
 
  employeeSkills(empIndex: number): FormArray {
    return this.employees()
      .at(empIndex)
      .get('skills') as FormArray;
  }
 
  newSkill(): FormGroup {
    return this.fb.group({
      one: '',
      two: '',
      three: ''
    });
  }
 
  addEmployeeSkill(empIndex: number) {
    console.log("Index : "+empIndex);
    this.employeeSkills(empIndex).push(this.newSkill());
  }
 
  removeEmployeeSkill(empIndex: number, skillIndex: number) {
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }
 
  onSubmit() {
    console.log(this.empForm.value);
  }

}
