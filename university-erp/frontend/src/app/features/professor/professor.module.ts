import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorRoutingModule } from './professor-routing.module';
import { ProfessorComponent } from './professor.component';
import { SidebarComponent } from '../../shared/components/layout/sidebar/sidebar.component';

@NgModule({
  declarations: [
    ProfessorComponent
  ],
  imports: [
    CommonModule,
    ProfessorRoutingModule,
    SidebarComponent
  ]
})
export class ProfessorModule { }
