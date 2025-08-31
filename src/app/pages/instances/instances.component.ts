import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
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
import { IftaLabelModule } from 'primeng/iftalabel';
import { DatePickerModule } from 'primeng/datepicker';
import { Application, Client, Environment, Instance, InstanceService } from '../../service/api.service';
import { DropdownModule } from 'primeng/dropdown';


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
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    IftaLabelModule,
    DatePickerModule,
    SelectModule
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


  totalRecords: number = 0;
  loading: boolean = false;

  // Filters
  selectedClientId?: number;
  selectedApplicationId?: number;
  selectedEnvironmentId?: number;


 

  loadInstancesLazy(event: TableLazyLoadEvent) {

    this.loading = true;
  
    const first = event.first ?? 1;
    const rows = event.rows ?? 10;  // default if null
    const page = Math.floor(first / rows) + 1;
    const size = rows;
  
    let sortField: string;

    if (Array.isArray(event.sortField)) {
      sortField = event.sortField[0] || 'id'; // take the first sort field or default
    } else {
      sortField = event.sortField || 'id';    // default if undefined
    }
  
    const direction = event.sortOrder === 1 ? 'ASC' : 'DESC';
  
    this.instanceService.getInstances(
      page,
      size,
      sortField,
      direction,
      this.selectedClientId,
      this.selectedApplicationId,
      this.selectedEnvironmentId
    ).subscribe(res => {
      this.instances.set(res.content);   // signal
      this.totalRecords = res.totalElements;
      this.loading = false;
    });
  }
  



  filteredInstances: Instance[] = [];


  loadInstances() {
    this.instanceService.getAllInstances().subscribe((data) => {
      this.instances.set(data);
      this.filteredInstances = [...data]; // default = all instances
    });
  
    // statuses & cols
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


 

  clients: Client[] = [];
  applications: Application[] = [];
  environments: Environment[] = [];



  filterInstances() {
    this.loadInstancesLazy({first: 0, rows: 10});
    this.filteredInstances = this.instances().filter(instance => {
      return (!this.selectedClientId || instance.client?.id === this.selectedClientId) &&
             (!this.selectedApplicationId || instance.application?.id === this.selectedApplicationId) &&
             (!this.selectedEnvironmentId || instance.environment?.id === this.selectedEnvironmentId);
    });
  }
  

ngOnInit() {
  this.loadInstances();
  this.loadDropdowns();
}

loadDropdowns() {
  this.instanceService.getAllApplications().subscribe(apps => this.applications = apps);
  this.instanceService.getAllClients().subscribe(clients => this.clients = clients);
  this.instanceService.getAllEnvironments().subscribe(envs => this.environments = envs);
}

filters: any = {
  tag: '',
  client: '',
  app: '',
  env: '',
  status: ''
};

// Client filter
onClientFilter(event: any) {
  this.filters.client = event.value || '';
  this.applyFilters();
}

// Application filter
onApplicationFilter(event: any) {
  this.filters.app = event.value || '';
  this.applyFilters();
}

// Environment filter
onEnvironmentFilter(event: any) {
  this.filters.env = event.value || '';
  this.applyFilters();
}


// Send request to backend
applyFilters() {
  if (this.filters.tag || this.filters.client || this.filters.app || this.filters.env) {
    this.instanceService.getByFilters(
      this.filters.tag,
      this.filters.client,
      this.filters.app,
      this.filters.env
    ).subscribe((data) => {
      this.instances.set(data);  // signal
    });
  } else {
    this.loadInstances(); // default load
  }
}


// openNew with defaults
openNew() {
  // Vérifier si les listes sont vides
  if (!this.applications.length) {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Application',
      detail: 'Please create an application first',
      life: 4000,
    });
    return;
  }

  if (!this.clients.length) {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Client',
      detail: 'Please create a client first',
      life: 4000,
    });
    return;
  }

  if (!this.environments.length) {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Environment',
      detail: 'Please create an environment first',
      life: 4000,
    });
    return;
  }

  // sinon on ouvre le dialog
  this.instance = {
    tag: '',
    branchName: '',
    dateInstallation: '',
    status: 'ACTIVE',
    application: { id: 0, name: '', description: '', gitUrl: '', dateCreation: ''},
    client: { id: 0, name: '' },
    environment: { id: 0, name: '', isProduction: false, client: { id: 0, name: '' } }
  };
  this.submitted = false;
  this.instanceDialog = true;
}


  
// Open dialog with existing values
editInstance(instance: Instance) {
  this.instance = { ...instance };   // clone bach ma ymodifich direct f table
  this.loadInstances();
  this.submitted = false;
  this.instanceDialog = true;
}

// Save => create or update
saveInstance() {
  this.submitted = true;

  if (this.instance.branchName?.trim()) {
    if (this.instance.tag && this.instance.id && this.findIndexById(this.instance.id) !== -1) {
      // Update
      this.instanceService.updateInstance(this.instance.tag, this.instance as Instance).subscribe({
        next: (updated) => {
          const _instances = [...this.instances()];
          const index = this.findIndexById(this.instance.id!);
          _instances[index] = updated;
          this.instances.set(_instances);
          this.loadInstances();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Instance Updated', life: 3000 });
          
          this.instanceDialog = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'Update Failed', life: 3000 });
        }
      });
    } else {
      // Create
      this.instanceService.createInstance(this.instance as Instance, this.instance.client.id, this.instance.application.id, this.instance.environment.id).subscribe({
        next: (created) => {
          this.instances.set([...this.instances(), created]);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Instance Created', life: 3000 });
          this.instanceDialog = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'Create Failed', life: 3000 });
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
  
  

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.instances().length; i++) {
      if (this.instances()[i].id === id) {
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

