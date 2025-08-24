import { Component,OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AuthService } from '../../service/api.service';


@Component({
  selector: 'app-dropmenu',
  standalone: true,
  imports: [SplitButtonModule, ToastModule],
  templateUrl: './dropmenu.component.html',
  styleUrl: './dropmenu.component.scss',
  providers: [MessageService]
})
export class DropmenuComponent implements OnInit {
  items: MenuItem[];
  fullName: string = ""; // ghadi njibha mn auth service

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.items = [
      { label: 'Account', url: '/account' },
      { label: 'Notifications', url: '/notifications' },
      { separator: true },
      { 
        label: 'Log Out',
        command: () => this.logout()
      }
    ];
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if(user) {
        this.fullName = user.fullname; // ola user.fullName ila kayn f backend
      }
    });
  }

  logout() {
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location.href = "/login";
  }
}
