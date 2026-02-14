import { Routes } from '@angular/router';
import { CreateReportComponent } from './components/create-report/create-report.component';
import { ReportListComponent } from './components/report-list/report-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'reports', pathMatch: 'full' },
    { path: 'reports', component: ReportListComponent },
    { path: 'create-report', component: CreateReportComponent }
];
