import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../menuitem/menuitem.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class AppSidebar {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }]
            },
            {
                label: 'Instances',
                items: [
                    { label: 'Instances List', icon: 'pi pi-fw pi-id-card', routerLink: ['/instances'] },
                    // { label: 'Add Client', icon: 'pi pi-fw pi-check-square', routerLink: ['dashboard/addClient/clients'] },
                    
                ]
            },
            {
                label: 'Applications',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Applications List',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/applications']
                    },
                    {
                        label: 'Add application',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/addApplication']
                    },
                    // {
                    //     label: 'Auth',
                    //     icon: 'pi pi-fw pi-user',
                    //     items: [
                    //         {
                    //             label: 'Login',
                    //             icon: 'pi pi-fw pi-sign-in',
                    //             routerLink: ['/auth/login']
                    //         },
                    //         {
                    //             label: 'Error',
                    //             icon: 'pi pi-fw pi-times-circle',
                    //             routerLink: ['/auth/error']
                    //         },
                    //         {
                    //             label: 'Access Denied',
                    //             icon: 'pi pi-fw pi-lock',
                    //             routerLink: ['/auth/access']
                    //         }
                    //     ]
                    // },
                    // {
                    //     label: 'Crud',
                    //     icon: 'pi pi-fw pi-pencil',
                    //     routerLink: ['/pages/crud']
                    // },
                    // {
                    //     label: 'Not Found',
                    //     icon: 'pi pi-fw pi-exclamation-circle',
                    //     routerLink: ['/pages/notfound']
                    // },
                    // {
                    //     label: 'Empty',
                    //     icon: 'pi pi-fw pi-circle-off',
                    //     routerLink: ['/pages/empty']
                    // }
                ]
            },
            {
                label: 'Environements',
                items: [
                    {
                        label: 'Environement List',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Env1.0.0',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Env 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Env 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Env 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Env1.1.0',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Env 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    // {
                    //     label: 'Submenu 2',
                    //     icon: 'pi pi-fw pi-bookmark',
                    //     items: [
                    //         {
                    //             label: 'Submenu 2.1',
                    //             icon: 'pi pi-fw pi-bookmark',
                    //             items: [
                    //                 { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                    //                 { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                    //             ]
                    //         },
                    //         {
                    //             label: 'Submenu 2.2',
                    //             icon: 'pi pi-fw pi-bookmark',
                    //             items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    //         }
                    //     ]
                    // }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/primefaces/sakai-ng',
                        target: '_blank'
                    }
                ]
            }
        ];
    }
}