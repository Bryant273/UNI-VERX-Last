import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecretariatRoutingModule } from './secretariat-routing.module';
import { SecretariatComponent } from './secretariat.component';
import { SidebarComponent } from '../../shared/components/layout/sidebar/sidebar.component';

@NgModule({
  declarations: [
    SecretariatComponent
  ],
  imports: [
    CommonModule,
    SecretariatRoutingModule,
    SidebarComponent
  ]
})
export class SecretariatModule { }
