import { AppConfigurator } from '../configurator/configurator.component';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../service/layout.service';
import {Component, computed, inject, input} from '@angular/core';



@Component({
  selector: 'app-floatingconfigurator',
  imports: [CommonModule, ButtonModule, StyleClassModule, AppConfigurator],
  templateUrl: './floatingconfigurator.component.html',
  styleUrl: './floatingconfigurator.component.css'
})
export class AppFloatingconfigurator {
  LayoutService = inject(LayoutService);

    float = input<boolean>(true);

    isDarkTheme = computed(() => this.LayoutService.layoutConfig().darkTheme);

    toggleDarkMode() {
        this.LayoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }


}
