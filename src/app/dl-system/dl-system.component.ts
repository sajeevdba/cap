import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-dl-system',
  templateUrl: './dl-system.component.html',
  styleUrls: ['./dl-system.component.scss']
})
export class DlSystemComponent implements OnInit, AfterViewInit, OnChanges {

  pageSize = 10;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'cTag', 'sDate', 'cDate','status', 'new'];
  trackInfo = " Learn one way to build applications with Angular and reuse your code and abilities to build apps for any deployment target. For web, mobile web, native mobile and native desktop. ";

  data: any = [
    {position: 1, cTag: 'Season-Sale-winter',sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Success'},
    {position: 2, cTag: 'Season-Sale-winter', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00' ,status: 'In Progress'},
    {position: 3, cTag: 'Season-Sale-winter', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Failed'},
    {position: 4, cTag: 'product-launch-shirt-x', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Failed'},
    {position: 5, cTag: 'Season-Sale-winter',sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Success'},
    {position: 6, cTag: 'Season-Sale-winter', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'In Progress' },
    {position: 7, cTag: 'Season-Sale-winter', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Failed'},
    {position: 8, cTag: 'product-launch-shirt-x', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Success'},
    {position: 9, cTag: 'Season-Sale-winter', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'In Progress' },
    {position: 10, cTag: 'Season-Sale-winter', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Failed'},
    {position: 11, cTag: 'product-launch-shirt-x', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Success'},
    {position: 12, cTag: 'Season-Sale-winter', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'In Progress' },
    {position: 13, cTag: 'Season-Sale-winter', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Failed'},
    {position: 14, cTag: 'product-launch-shirt-x', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Success'},
    {position: 15, cTag: 'product-launch-shirt-x', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'In Progress'},
    {position: 16, cTag: 'product-launch-shirt-x', sDate: '22/10/2021 00:00:00', cDate: '22/10/2021 00:00:00',status: 'Failed'},
    
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource(this.data);

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(){
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
  }



  openDialog(){
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '75%',
      height:'75%',
      autoFocus: false,
      data: {track:true,trackTitle:"DB TRACK INFO",trackInfo: this.trackInfo, cId:"	Season-Sale-winter",sId:"Older-Women", cDate: "22/10/2021 00:00:00", status:"Success" },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
