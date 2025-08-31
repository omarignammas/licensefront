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
import { IftaLabelModule } from 'primeng/iftalabel';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';

import { License, LicenseService, User, Instance,UserService , InstanceService} from '../../service/api.service';



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
  selector: 'app-licenses',
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
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss'],
  providers: [MessageService, LicenseService, ConfirmationService],
})
export class LicensesComponent implements OnInit {


  licenses = signal<License[]>([]);
  license!: Partial<License>;

  users: User[] = [];
  instances: Instance[] = [];

  licenseDialog: boolean = false;
  selectedLicenses!: License[] | null;
  submitted: boolean = false;
  statuses!: any[];
  @ViewChild('dt') dt!: Table;
  exportColumns!: ExportColumn[];
  cols!: Column[];

  constructor(
    private licenseService: LicenseService,
    private UserService: UserService,
    private instanceService: InstanceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadLicenses();
    this.loadDropdowns();
    this.statuses = [
      { label: 'ACTIVE', value: 'ACTIVE' },
      { label: 'INACTIVE', value: 'INACTIVE' },
    ];

    this.cols = [
      { field: 'key', header: 'Key' },
      { field: 'user.username', header: 'Username' },  // nested
      { field: 'instance.tag', header: 'Instance Tag' }, // nested
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },
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

  loadLicenses() {
    this.licenseService.getAllLicenses().subscribe(data => {
      this.licenses.set(data);
    });
  }

  loadDropdowns() {
    this.UserService.getAllUsers().subscribe(users => this.users = users);
    this.instanceService.getAllInstances().subscribe(instances => this.instances = instances);
  }

  openNew() {
    this.license = {
      key: '',
      status: 'ACTIVE',
      user: { } as User,     // ✅ cast to User
      instance: {} as Instance
    };
    this.submitted = false;
    this.licenseDialog = true;
  }
  
  editLicense(license: License) {
    this.license = { ...license };
    this.submitted = false;
    this.licenseDialog = true;
  }

  saveLicense() {
    this.submitted = true;
    if (!this.license.key?.trim()) return;
  
    if (this.license.id) {
      // update flow
      this.licenseService.updateLicense(this.license.id, this.license as License).subscribe({
        next: (updated) => {
          const arr = [...this.licenses()];
          const idx = arr.findIndex(l => l.id === this.license.id);
          if (idx !== -1) arr[idx] = updated;
          this.licenses.set(arr);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'License Updated', life: 3000 });
          this.licenseDialog = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'license update Failed', life: 3000 });
        }
      });
    } else {
      // ✅ make sure we have IDs
      const userId = this.license.user?.id;
      const instanceId = this.license.instance?.id;
      if (!userId || !instanceId) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'User & Instance required', life: 3000 });
        return;
      }
  
      this.licenseService.createLicense(this.license as License, userId, instanceId).subscribe({
        next: (created) => {
          this.licenses.set([...this.licenses(), created]);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'License Created', life: 3000 });
          this.licenseDialog = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'license creation Failed', life: 3000 });
        }
      });
    }
  }
  

  deleteLicense(license: License) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete license ' + license.key + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.licenseService.deleteLicense(license.id!).subscribe({
          next: () => {
            this.loadLicenses();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'License deleted', life: 4000 });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot delete license', life: 5000 });
          }
        });
      }
    });
  }

  deleteSelectedLicenses() {
    if (!this.selectedLicenses?.length) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete selected licenses?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedLicenses!.forEach(l => {
          this.licenseService.deleteLicense(l.id!).subscribe();
        });
        this.loadLicenses();
        this.selectedLicenses = null;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Selected licenses deleted', life: 4000 });
      }
    });
  }

  findIndexById(id: number): number {
    return this.licenses().findIndex(l => l.id === id);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'danger';
      default: return 'info';
    }
  }


  hideDialog() {
    this.licenseDialog = false;
    this.submitted = false;
  }
}
