import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/components/login/login.component';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';

import { UploadComponent } from './features/inspection/components/upload/upload.component';
import { HistoryComponent } from './features/inspection/components/history/history.component';
import { ValidationResultComponent } from './features/inspection/components/validation-result/validation-result.component';
import { ReportPreviewComponent } from './features/inspection/components/report-preview/report-preview.component';

import { PartListComponent } from './features/part-master/components/part-list/part-list.component';
import { PartAddComponent } from './features/part-master/components/part-add/part-add.component';

import { ReportViewComponent } from './features/report/components/report-view/report-view.component';
import { authGuard } from './auth.guard';

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
    canActivate: [authGuard],
    component: DashboardComponent
  },

  {
    path: 'inspection/upload',
    canActivate: [authGuard],
    component: UploadComponent
  },

  {
    path: 'inspection/history',
    canActivate: [authGuard],
    component: HistoryComponent
  },

  {
    path: 'inspection/validation',
    canActivate: [authGuard],
    component: ValidationResultComponent
  },

  {
    path: 'inspection/report-preview',
    canActivate: [authGuard],
    component: ReportPreviewComponent
  },

  {
    path: 'part-master',
    canActivate: [authGuard],
    component: PartListComponent
  },

  {
    path: 'part-master/add',
    canActivate: [authGuard],
    component: PartAddComponent
  },

  {
    path: 'part-master/edit/:id',
    canActivate: [authGuard],
    component: PartAddComponent
  },

  {
    path: 'report',
    canActivate: [authGuard],
    component: ReportViewComponent
  }

];