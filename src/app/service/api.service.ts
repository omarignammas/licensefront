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


export interface Instance {
  id: number;
  dateInstallation: string;
  status: string;
  tag: string;
  branchName: string;
  application: Application;
  client: Client;
  environment: Environment;
}

export interface Application {
  id: number;
  name: string;
  description: string;
  gitUrl: string;
}

export interface Client {
  id: number;
  name: string;
}

export interface Environment {
  id: number;
  name: string;
  isProduction: boolean;
  client: Client;
}

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  private apiUrl = 'http://localhost:8080/apiv1';

  constructor(private http: HttpClient) {}

  getAllInstances(): Observable<Instance[]> {
    return this.http.get<Instance[]>(`${this.apiUrl}/instances/getAll`);
  }

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/getAll`);
  }
  
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients/getAll`);
  }
  
  getAllEnvironments(): Observable<Environment[]> {
    return this.http.get<Environment[]>(`${this.apiUrl}/environments/getAll`);
  }

  

  createInstance(instance: Instance, clientId: number, applicationId: number, environmentId: number): Observable<Instance> {
    return this.http.post<Instance>(`${this.apiUrl}/instances/save?clientId=${clientId}&applicationId=${applicationId}&environmentId=${environmentId}`, instance);
  }

  updateInstance(tag: string, instance: Instance): Observable<Instance> {
    return this.http.put<Instance>(`${this.apiUrl}/instances/update/${tag}`, instance);
  }

  deleteInstance(tag: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${tag}`);
  }

  toggleActivation(tag: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/instances/activation/${tag}`, {}, { responseType: 'text' });
  }
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
    return this.http.post(`${this.apiUrl}/signup`, signupRequest);
  }

  
  
}


// postData(path: String, formData: FormData): Observable<any> {
  //   return this.http.post('http://localhost:8888/api/' + path, formData, {
  //       responseType: 'text'
  //   });
  // }
