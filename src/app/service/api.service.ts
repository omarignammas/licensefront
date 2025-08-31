import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';


export interface SigninRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  email: string;
  fullname: string;
}

export interface GenericResponse<T> {
  message: string;
  data: T;
}


export interface PagingResult<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  page: number;
  empty: boolean;
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


// user.service
export interface User {
  id?: number;
  username: string;
  fullName: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) { }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getAll`);
  }

  // Get user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/userid/${id}`);
  }

  // Get user by username
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/username/${username}`);
  }

  // Create new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/save`, user);
  }

  // Update existing user
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/update/${id}`, user);
  }

  // Delete user by ID
  deleteUserById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // Delete user by username
  deleteUserByUsername(username: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${username}`);
  }
}


// license.service.ts

export interface License {
  id?: number;
  key?: string;
  startDate?: string;   // LocalDate arrives as string in JSON
  endDate?: string;
  status?: 'ACTIVE' | 'INACTIVE'; // if you added it in backend DTO
  user?: User;
  instance?: Instance;
}


@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  private apiUrl = 'http://localhost:8080/api/v1/licences';

  constructor(private http: HttpClient) {}

  getAllLicenses(): Observable<License[]> {
    return this.http.get<License[]>(`${this.apiUrl}/getAll`);
  }

  getLicenseById(id: number): Observable<License> {
    return this.http.get<License>(`${this.apiUrl}/${id}`);
  }

  createLicense(license: License ,userId:number , instanceId :number ): Observable<License> {
    return this.http.post<License>(`${this.apiUrl}/save?userId=${userId}&instanceId=${instanceId}`, license);
  }

  updateLicense(id: number, license: License): Observable<License> {
    return this.http.put<License>(`${this.apiUrl}/update/${id}`, license);
  }

  deleteLicense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getLicensesByUsername(username: string): Observable<License[]> {
    return this.http.get<License[]>(`${this.apiUrl}/user/${username}`);
  }

  getLicensesByInstanceTag(tag: string): Observable<License[]> {
    return this.http.get<License[]>(`${this.apiUrl}/instance/${tag}`);
  }
}



// Instance service
@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  private apiUrl = 'http://localhost:8080/api/v1';

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
    return this.http.delete<void>(`${this.apiUrl}/instances/delete/${tag}`);
  }

  toggleActivation(tag: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/instances/activation/${tag}`, {}, { responseType: 'text' });
  }

  getByFilters(tag: string, client: string, app: string, env: string): Observable<Instance[]> {
    return this.http.get<Instance[]>(`${this.apiUrl}/instances/filter`, {
      params: { tag, clientName: client, appName: app, envName: env }
    });
  }

  getInstances(
    page: number,
    size: number,
    sortField: string,
    direction: string,
    clientId?: number,
    applicationId?: number,
    environmentId?: number
  ): Observable<PagingResult<Instance>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortField', sortField)
      .set('direction', direction);
  
    if (clientId) params = params.set('clientId', clientId);
    if (applicationId) params = params.set('applicationId', applicationId);
    if (environmentId) params = params.set('environmentId', environmentId);
  
    // debugging pagination dataFetching
    //console.log("Page envoyée au backend:", page, size, sortField, direction);
  
    return this.http
      .get<GenericResponse<PagingResult<Instance>>>('/api/v1/instances/getAllInstances', { params })
      .pipe(map(res => res.data)); // Angular ghatjib data JSON
      
  }
  

}


// Client service
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/api/v1';

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
  private apiUrl = 'http://localhost:8080/api/v1';

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
  private apiUrl = 'http://localhost:8080/api/v1';

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
  private apiUrl = 'http://localhost:8080/api/v1/auth'; 



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

