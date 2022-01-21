import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

 
 
  constructor(private http: HttpClient) { }

  getDataFromDataSource(apiName: any, endPoint: any, apiTye:any, queryParam: any):Observable<any> {
    if(apiTye === 'get' || apiTye==='GET'){
      return this.http.get(endPoint+apiName,{params: queryParam}).pipe(tap(_ => console.log('get api call'))
      );
    }else{
      let  headers= new HttpHeaders()
      .set('content-type', 'application/json')
    /*   .set('Access-Control-Allow-Origin', '*'); */
      console.log('queryParam'+queryParam)
      
      return this.http.post(endPoint+apiName,
        queryParam ,{ 'headers': headers },).pipe(tap(_ => console.log('post api call'))
      );
    }
    
  }

  getPostDataFromDataSource(apiName: any, endPoint: any, apiTye:any, queryParam: any, postBody: any) :Observable<any>{
    return this.http.post(endPoint+apiName,
      postBody ,{params: queryParam}).pipe(tap(_ => console.log('post api call'))
    );
  }

  deleteDataFromDataSource(apiName: any, endPoint: any, apiTye:any, queryParam: any, postBody: any) :Observable<any>{
    return this.http.delete(endPoint+apiName ,{params: queryParam}).pipe(tap(_ => console.log('post api call'))
    );
  }

  userName: any;

  setUserName(id: any){
    this.userName = id;
  }

  getUserName(){
    return this.userName;
  }

 
}
