import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SignupComponent } from './pages/signup/signup.component';
import { InstancesComponent } from './pages/instances/instances.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { EnvironmentsComponent } from './pages/environments/environments.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { LicensesComponent } from './pages/licenses/licenses.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        
      },
      {
        path: 'instances',
        component: InstancesComponent
      },
      {
        path: 'applications',
        component: ApplicationsComponent
      },
      {
        path: 'environments',
        component: EnvironmentsComponent
      },
      {
        path: 'clients',
        component: ClientsComponent
      },
      {
        path: 'licenses',
        component: LicensesComponent
      }
    ]
  }

];
