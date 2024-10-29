import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AuthUrl = 'http://192.168.1.134:8000/api/register/'; 
  private loginurl = 'http://192.168.1.134:8000/api/login/'; 

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.AuthUrl, userData, { headers });
  }

  Login(userData:any):Observable<any>{

    return this.http.post(this.loginurl,userData)
  }


}
