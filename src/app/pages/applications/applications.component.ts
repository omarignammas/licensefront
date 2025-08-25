import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule, formatDate } from '@angular/common';
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
import { ScrollerModule } from 'primeng/scroller';

import { Application, ApplicationService,InstanceService } from '../../service/api.service';

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
  selector: 'app-applications',
  standalone: true,
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
    IftaLabelModule,
    DatePickerModule,
    ScrollerModule
  ],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  providers: [MessageService, InstanceService, ConfirmationService],
})
export class ApplicationsComponent implements OnInit {
  instanceDialog = false;
  applications = signal<Application[]>([]);   
  application: Partial<Application> = {};    
  selectedApplication: Application[] | null = null;
  submitted = false;

  cols: Column[] = [];
  exportColumns: ExportColumn[] = [];
  @ViewChild('dt') dt!: Table;

  constructor(
    private applicationService: ApplicationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.applicationService.getAllApplications().subscribe((data) => {
      this.applications.set(data);
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'dateCreation', header: 'Date Creation' },
      { field: 'gitUrl', header: 'Git URL' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  getSeverity(status: string) { switch (status) { case 'ACTIVE': return 'success'; case 'INACTIVE': return 'danger'; default: return 'info'; } }


  onGlobalFilter(table: Table, event: Event) { table.filterGlobal((event.target as HTMLInputElement).value, 'contains'); }

  openNew() {
    this.application = { name: '', description: '',dateCreation : '', gitUrl: '' };
    this.submitted = false;
    this.instanceDialog = true;
  }

      // Open dialog with existing values
    editInstance(application: Application) {
      this.application = { ...application };   // clone bach ma ymodifich direct f table
      this.submitted = false;
      this.instanceDialog = true;
    }

    async deleteSelectedApplication() {
      if (!this.selectedApplication || this.selectedApplication.length === 0) return;
    
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected instances?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            // Loop through selectedInstances and delete each
            for (const instance of this.selectedApplication!) {
              await this.applicationService.deleteApplication(instance.id!).toPromise();
            }
    
            this.loadApplications(); // reload from backend
            this.selectedApplication = null;
    
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Selected applications deleted',
              life: 4000,
            });
          } catch (err) {
            console.error(err);
            this.messageService.add({
              
              severity: 'error',
              summary: 'Error',
              detail:  'Cannot delete applications',
              life: 5000,
            });
          }
        }
      });
    }

  saveApplication() {
    this.submitted = true;

    if (this.application.name?.trim()) {
      if (this.application.id && this.findIndexById(this.application.id) !== -1) {
        if (this.application.dateCreation) {
          this.application.dateCreation = formatDate(this.application.dateCreation, 'yyyy-MM-dd', 'en-US');
        }

        // Update
        this.applicationService.updateApplication(this.application.id, this.application as Application).subscribe({
          next: () => {
            const _applications = [...this.applications()];
            const index = this.findIndexById(this.application.id!);
            _applications[index] = this.application as Application;
            this.applications.set(_applications);

            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Application Updated', life: 3000 });
            this.instanceDialog = false;
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update Failed', life: 3000 });
          }
        });
      } else {
        // Create
        if (this.application.dateCreation) {
          this.application.dateCreation = formatDate(this.application.dateCreation, 'yyyy-MM-dd', 'en-US');
        }

        this.applicationService.createApplication(this.application as Application).subscribe({
          next: (created) => {
            this.applications.set([...this.applications(), created]);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Application Created', life: 3000 });
            this.instanceDialog = false;
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Create Failed', life: 3000 });
          }
        });

      }
    }
  }


  deleteApplication(application: Application) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + application.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.applicationService.deleteApplication(application.id).subscribe({
          next: () => {
            this.applications.set(this.applications().filter(val => val.id !== application.id));
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Application Deleted', life: 3000 });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'Delete Failed', life: 3000 });
          }
        });
      }
    });
  }

  hideDialog() {
    this.instanceDialog = false;
    this.submitted = false;
  }

  findIndexById(id: number): number {
    return this.applications().findIndex(app => app.id === id);
  }
}
