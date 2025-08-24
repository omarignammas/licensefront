import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SplitButtonModule } from 'primeng/splitbutton';


@Component({
  selector: 'app-dropmenu',
  standalone: true,
  imports: [SplitButtonModule, ToastModule],
  templateUrl: './dropmenu.component.html',
  styleUrl: './dropmenu.component.scss',
  providers: [MessageService]
})
export class DropmenuComponent {
  items: MenuItem[];
  fullName: string = "Omar Ignammas"; // تجي من auth service مثلا

  constructor(private messageService: MessageService) {
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

  logout() {

    localStorage.removeItem("token");
    sessionStorage.clear();

    window.location.href = "/login";
  }


}
