import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

import { Client } from '../../service/api.service';
import { ClientService } from '../../service/api.service';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    DialogModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    TagModule
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ClientsComponent implements OnInit {
  dialogOpen = false;

  clients = signal<Client[]>([]);
  client: Partial<Client> = {};
  selectedClients: Client[] | null = null;

  cols: Column[] = [];
  @ViewChild('dt') dt!: Table;

  constructor(
    private clientService: ClientService,
    private toast: MessageService,
    private confirm: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAllClients().subscribe((data) => {
      this.clients.set(data);
    });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' }
    ];
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  onGlobalFilter(table: Table, e: Event) {
    table.filterGlobal((e.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.client = { name: '' };
    this.dialogOpen = true;
  }

  editClient(client: Client) {
    this.client = { ...client };
    this.dialogOpen = true;
  }

  saveClient() {
    if (!this.client.name?.trim()) return;

    if (this.client.id) {
      // UPDATE
      this.clientService.updateClient(this.client.id, this.client as Client).subscribe({
        next: (updated) => {
          const arr = [...this.clients()];
          const idx = arr.findIndex(c => c.id === updated.id);
          if (idx !== -1) arr[idx] = updated;
          this.clients.set(arr);
          this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Client Updated', life: 3000 });
          this.dialogOpen = false;
        },
        error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'Update Failed', life: 3000 })
      });
    } else {

      // CREATE
      this.clientService.createClient(this.client as Client).subscribe({
        next: (created) => {
          this.clients.set([...this.clients(), created]);
          this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Client Created', life: 3000 });
          this.dialogOpen = false;
        },
        error: (err) => this.toast.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'Client creation Failed', life: 3000 })
      });
    }
  }

  deleteClient(client: Client) {
    this.confirm.confirm({
      message: 'Are you sure you want to delete ' + client.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.deleteClient(client.name!).subscribe({
          next: () => {
            this.clients.set(this.clients().filter(c => c.name !== client.name));
            this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Client Deleted', life: 3000 });
          },
          error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'Delete Failed', life: 3000 })
        });
      }
    });
  }

  deleteSelectedClients() {
    if (!this.selectedClients?.length) return;
    this.confirm.confirm({
      message: 'Are you sure you want to delete the selected clients?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          for (const client of this.selectedClients!) {
            await this.clientService.deleteClient(client.name!).toPromise();
          }
          this.loadClients();
          this.selectedClients = null;
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Selected clients deleted', life: 4000 });
        } catch {
          this.toast.add({ severity: 'error', summary: 'Error', detail: 'Cannot delete clients', life: 5000 });
        }
      }
    });
  }

  hideDialog() {
    this.dialogOpen = false;
  }
}
