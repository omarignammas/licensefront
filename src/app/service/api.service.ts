import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


export interface SigninRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  email: string;
  fullname: string;
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
  dateCreation: string;
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




// Instance service
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




// Client service
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/apiv1';

  constructor(private http: HttpClient) {}


  
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients/getAll`);
  }
  

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients/save`, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/update/${id}`, client);
  }

  deleteClient(name: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${name}`);
  }


}





// Application service
@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8080/apiv1';

  constructor(private http: HttpClient) {}



  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/getAll`);
  }
  
  createApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/applications/save`, application);
  }
  
  updateApplication(id: number, application: Application): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/update/${id}`, application);
  }
  
  deleteApplication(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/applications/delete/${id}`);
  }

  

}



// Environment service
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private apiUrl = 'http://localhost:8080/apiv1';

  constructor(private http: HttpClient) {}


  getAllEnvironments(): Observable<Environment[]> {
    return this.http.get<Environment[]>(`${this.apiUrl}/environments/getAll`);
  }
  
  createEnvironment(environment: Environment): Observable<Environment> {
    return this.http.post<Environment>(`${this.apiUrl}/environments/save`, environment);
  }
  
  updateEnvironment(id: number, environment: Environment): Observable<any> {
    return this.http.put(`${this.apiUrl}/environments/update/${id}`, environment);
  }
  
  deleteEnvironment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/environmentS/delete/${id}`);
  }

  

}





// Auth service
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

 


  private currentUserSubject = new BehaviorSubject<any | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );

  public currentUser$ = this.currentUserSubject.asObservable();
  
  setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user)); // store in localStorage
    this.currentUserSubject.next(user);
  }
  
  getCurrentUser(): Observable<any | null> {
    return this.currentUser$;
  }
}

