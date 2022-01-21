import { Component, OnInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';


@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit, OnChanges {
  @ViewChild('mysidenav')
  sideNav!: ElementRef;

  @ViewChild('userInfo') userInfo!: ElementRef;
  username: any;
  name: any;
  constructor(private router: Router, public element: ElementRef, private authService: MsalService) { }
  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnInit(): void {
    
  }
  ngAfterViewInit() {
    console.log(this.sideNav.nativeElement.value);

    
  }



  routeTo(url: any) {
    this.router.navigate([url]);
  }
  openNav() {
    this.sideNav.nativeElement.style.width = "250px";
    //document.getElementById("mySidenav").style.width = "250px";
  }

  openUserInfo(){
    console.log("header : ",this.authService.getAccount());
    if (this.authService.getAccount().userName !== undefined) {
      let enterpriseId = this.authService.getAccount().userName;
      this.username = enterpriseId;
      this.name = this.authService.getAccount().name;
      console.log("username : "+enterpriseId);
    }
    else {
      console.log("Guest");
    }
    // this.userInfo.nativeElement.style.width = "350px";
    // this.userInfo.nativeElement.style.height = "250px";
  }

  closeNav() {
    this.sideNav.nativeElement.style.width = "0";

    //  document.getElementById("mySidenav").style.width = "0";
  }
  closeuserInfo(){
    this.userInfo.nativeElement.style.width = "0";
  }

  // logOut(){
  //   this.authService.logout();
  // }
}
