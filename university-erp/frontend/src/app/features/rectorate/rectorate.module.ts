import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RectorateRoutingModule } from './rectorate-routing.module';
import { RectorateComponent } from './rectorate.component';
import { SidebarComponent } from '../../shared/components/layout/sidebar/sidebar.component';

@NgModule({
  declarations: [
    RectorateComponent
  ],
  imports: [
    CommonModule,
    RectorateRoutingModule,
    SidebarComponent
  ]
})
export class RectorateModule { }
