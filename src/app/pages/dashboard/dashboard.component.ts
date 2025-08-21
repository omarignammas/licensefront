 // dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatswidgetComponent } from "./statswidget/statswidget.component";

@Component({
  selector: 'app-dashboard',
  standalone: true, // ← Ajoutez ceci
  imports: [CommonModule, StatswidgetComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}