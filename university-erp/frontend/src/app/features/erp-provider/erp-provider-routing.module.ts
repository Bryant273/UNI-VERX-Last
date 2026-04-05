import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SupervisionComponent } from './pages/supervision/supervision.component';

const routes: Routes = [
  { path: 'supervision', component: SupervisionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErpProviderRoutingModule { }
