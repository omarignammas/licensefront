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
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { InputSwitchModule } from 'primeng/inputswitch';

import { Client, Environment } from '../../service/api.service';
import { InstanceService, EnvironmentService } from '../../service/api.service';

interface Column {
  field: string;
  header: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-environments',
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
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    SelectModule,
    InputSwitchModule
  ],
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class EnvironmentsComponent implements OnInit {
  dialogOpen = false;

  environments = signal<Environment[]>([]);
  environment: Partial<Environment> = {};
  selectedEnvironments: Environment[] | null = null;

  clients: Client[] = [];
  selectedClientId: number | null = null;

  cols: Column[] = [];
  exportColumns: ExportColumn[] = [];
  @ViewChild('dt') dt!: Table;

  constructor(
    private envService: EnvironmentService,
    private instanceService: InstanceService,
    private toast: MessageService,
    private confirm: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadEnvironments();
    this.instanceService.getAllClients().subscribe((c) => (this.clients = c));
  }

  loadEnvironments() {
    this.envService.getAllEnvironments().subscribe((data) => {
      this.environments.set(data);
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'isProduction', header: 'Production?' },
      { field: 'client.name', header: 'Client' }
    ];

    this.exportColumns = this.cols.map((c) => ({ title: c.header, dataKey: c.field }));
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  onGlobalFilter(table: Table, e: Event) {
    table.filterGlobal((e.target as HTMLInputElement).value, 'contains');
  }

  openNew() {

    if (!this.clients.length) {
      this.toast.add({
        severity: 'warn',
        summary: 'No Client',
        detail: 'Please create a client first',
        life: 4000,
      });
      return;
    }

    this.environment = { name: '', isProduction: false };
    this.selectedClientId = null;
    this.dialogOpen = true;
  }

  editEnvironment(env: Environment) {
    this.environment = { ...env };
    this.selectedClientId = env.client?.id ?? null;
    this.dialogOpen = true;
  }

  selectedClient: Client | null = null;


  saveEnvironment() {
    if (!this.environment.name?.trim()) return;
  
    const payload = {
      name: this.environment.name,
      isProduction: this.environment.isProduction,
      client: this.selectedClient ? { id: this.selectedClient.id, name: this.selectedClient.name } : undefined
    };
    


    if (this.environment.id) {
      // UPDATE
      this.envService.updateEnvironment(this.environment.id, payload as Environment).subscribe({
        next: (updated) => {
          const arr = [...this.environments()];
          const idx = arr.findIndex(e => e.id === updated.id);
          if (idx !== -1) arr[idx] = updated;
          this.environments.set(arr);
          this.loadEnvironments();
          this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Environment Updated', life: 3000 });
          this.dialogOpen = false;
        },
        error: (err) => this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Environment Update Failed',
          life: 3000
        })
      });
    } else {
      // CREATE
      this.envService.createEnvironment(payload as Environment).subscribe({
        next: (created) => {
          this.environments.set([...this.environments(), created]);
          this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Environment Created', life: 3000 });
          this.dialogOpen = false;
        },
        error: () => this.toast.add({ severity: 'error', summary: 'Error', detail: 'Create Failed', life: 3000 })
      });
    }
  }
  

  deleteEnvironment(env: Environment) {
    this.confirm.confirm({
      message: 'Are you sure you want to delete ' + env.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.envService.deleteEnvironment(env.id).subscribe({
          next: () => {
            this.environments.set(this.environments().filter(e => e.id !== env.id));
            this.toast.add({ severity: 'success', summary: 'Successful', detail: 'Environment Deleted', life: 3000 });
          },
          error: (err) => this.toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message || 'Delete Failed',
            life: 3000
          })
        });
      }
    });
  }

  async deleteSelectedEnvironments() {
    if (!this.selectedEnvironments?.length) return;
    this.confirm.confirm({
      message: 'Are you sure you want to delete the selected environments?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          for (const env of this.selectedEnvironments!) {
            await this.envService.deleteEnvironment(env.id).toPromise();
          }
          this.loadEnvironments();
          this.selectedEnvironments = null;
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Selected environments deleted', life: 4000 });
        } catch {
          this.toast.add({ severity: 'error', summary: 'Error', detail: 'Cannot delete environments', life: 5000 });
        }
      }
    });
  }

  hideDialog() {
    this.dialogOpen = false;
  }
}
