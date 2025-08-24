import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Application, Client, Environment, Instance, InstanceService } from '../../service/api.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-instances',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
  ],
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.scss'],
  providers: [MessageService, InstanceService, ConfirmationService],
})
export class InstancesComponent implements OnInit {
  instanceDialog: boolean = false;

  instances = signal<Instance[]>([]);


  instance!: Partial<Instance> & {
    application: Application;
    client: Client;
    environment: Environment;
  };
   

  selectedInstances!: Instance[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  constructor(
    private instanceService: InstanceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  exportCSV() {
    this.dt.exportCSV();
  }

  
  loadInstances() {
    this.instanceService.getAllInstances().subscribe((data) => {
      this.instances.set(data);
    });

    this.statuses = [
      { label: 'ACTIVE', value: 'ACTIVE' },
      { label: 'INACTIVE', value: 'INACTIVE' },
    ];

    this.cols = [
      { field: 'tag', header: 'Tag' },
      { field: 'branchName', header: 'Branch Name' },
      { field: 'dateInstallation', header: 'Date Installation' },
      { field: 'application.name', header: 'Application' },
      { field: 'client.name', header: 'Client' },
      { field: 'environment.name', header: 'Environment' },
      { field: 'status', header: 'Status' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  

  
  applications: Application[] = [];
  clients: Client[] = [];
  environments: Environment[] = [];

ngOnInit() {
  this.loadInstances();
  this.loadDropdowns();
}

loadDropdowns() {
  this.instanceService.getAllApplications().subscribe(apps => this.applications = apps);
  this.instanceService.getAllClients().subscribe(clients => this.clients = clients);
  this.instanceService.getAllEnvironments().subscribe(envs => this.environments = envs);
}

// openNew with defaults
openNew() {
  this.instance = {
    tag: '',
    branchName: '',
    dateInstallation: '',
    status: 'INACTIVE',
    application: { id: 0, name: '', description: '', gitUrl: '' },
    client: { id: 0, name: '' },
    environment: { id: 0, name: '', isProduction: false, client: { id: 0, name: '' } }
  };
  this.submitted = false;
  this.instanceDialog = true;
}

  
// Open dialog with existing values
editInstance(instance: Instance) {
  this.instance = { ...instance };   // clone bach ma ymodifich direct f table
  this.submitted = false;
  this.instanceDialog = true;
}

// Save => create or update
saveInstance() {
  this.submitted = true;

  if (this.instance.branchName?.trim()) {
    if (this.instance.tag && this.findIndexById(this.instance.tag) !== -1) {
      // Update
      this.instanceService.updateInstance(this.instance.tag, this.instance as Instance).subscribe({
        next: (updated) => {
          const _instances = [...this.instances()];
          const index = this.findIndexById(this.instance.tag!);
          _instances[index] = updated;
          this.instances.set(_instances);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Instance Updated', life: 3000 });
          this.instanceDialog = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update Failed', life: 3000 });
        }
      });
    } else {
      // Create
      this.instanceService.createInstance(this.instance as Instance, 1, 1, 1).subscribe({
        next: (created) => {
          this.instances.set([...this.instances(), created]);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Instance Created', life: 3000 });
          this.instanceDialog = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Create Failed', life: 3000 });
        }
      });
    }
  }
}



async deleteSelectedInstances() {
  if (!this.selectedInstances || this.selectedInstances.length === 0) return;

  this.confirmationService.confirm({
    message: 'Are you sure you want to delete the selected instances?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        // Loop through selectedInstances and delete each
        for (const instance of this.selectedInstances!) {
          await this.instanceService.deleteInstance(instance.tag!).toPromise();
        }

        this.loadInstances(); // reload from backend
        this.selectedInstances = null;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Selected instances deleted',
          life: 4000,
        });
      } catch (err) {
        console.error(err);
        this.messageService.add({
          
          severity: 'error',
          summary: 'Error',
          detail: 'Cannot delete instances',
          life: 5000,
        });
      }
    }
  });
}



  hideDialog() {
    this.instanceDialog = false;
    this.submitted = false;
  }

  deleteInstance(instance: Instance) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to change activation for ' + instance.tag + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.instanceService.toggleActivation(instance.tag).subscribe({
          next: (res: string) => {
            // reload instances from backend
            this.loadInstances(); 
  
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res,
              life: 4000,
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err?.error || 'Cannot toggle activation',
              life: 5000,
            });
          }
        });
      }
    });
  }
  
  

  findIndexById(tag: string): number {
    let index = -1;
    for (let i = 0; i < this.instances().length; i++) {
      if (this.instances()[i].tag === tag) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): string {
    let id = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'danger';
      default:
        return 'info';
    }
  }

  // saveInstance() {
  //   this.submitted = true;
  
  //   if (this.instance.branchName?.trim()) {
  //     // if (this.instance.tag) {
  //     //   // Update
  //     //   this.instanceService.updateInstance(this.instance.tag, this.instance as Instance).subscribe((updated) => {
  //     //     const _instances = [...this.instances()];
  //     //     const index = this.findIndexById(this.instance.tag!);
  //     //     _instances[index] = updated;
  //     //     this.instances.set(_instances);
  //     //     this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Instance Updated', life: 3000 });
  //     //     this.instanceDialog = false;
  //     //   });
  //     // } else {
      
  //       this.instanceService.createInstance(this.instance as Instance, 1, 1, 1).subscribe((created) => {
  //         this.instances.set([...this.instances(), created]);
  //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Instance Created', life: 3000 });
  //         this.instanceDialog = false;
  //       });
  //     }
  //   }
 }

