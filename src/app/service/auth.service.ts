import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SigninRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; 

  constructor(private http: HttpClient) {}

  signin(request: SigninRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/signin`, request);
  }

  signup(signupRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, signupRequest , {
       responseType: 'text'
    });
  }

  // postData(path: String, formData: FormData): Observable<any> {
  //   return this.http.post('http://localhost:8888/api/' + path, formData, {
  //       responseType: 'text'
  //   });
  // }
  
}
