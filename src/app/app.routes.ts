import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/components/login/login.component';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';

import { UploadComponent } from './features/inspection/components/upload/upload.component';
import { ValidationResultComponent } from './features/inspection/components/validation-result/validation-result.component';
import { ReportPreviewComponent } from './features/inspection/components/report-preview/report-preview.component';

import { PartListComponent } from './features/part-master/components/part-list/part-list.component';
import { PartAddComponent } from './features/part-master/components/part-add/part-add.component';

import { ReportViewComponent } from './features/report/components/report-view/report-view.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
    path: 'inspection/upload',
    component: UploadComponent
  },

  {
    path: 'inspection/validation',
    component: ValidationResultComponent
  },

  {
    path: 'inspection/report-preview',
    component: ReportPreviewComponent
  },

  {
    path: 'part-master',
    component: PartListComponent
  },

  {
    path: 'part-master/add',
    component: PartAddComponent
  },

  {
    path: 'part-master/edit/:id',
    component: PartAddComponent
  },

  {
    path: 'report',
    component: ReportViewComponent
  }

];