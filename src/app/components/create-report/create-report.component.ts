import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { CreateReportDto } from '../../models';

@Component({
    selector: 'app-create-report',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-report.component.html',
    styleUrl: './create-report.component.css'
})
export class CreateReportComponent {
    private reportService = inject(ReportService);
    private router = inject(Router);

    reportTypes = ['Sales', 'UserActivity', 'Inventory', 'AuditLog'];

    model: CreateReportDto = {
        reportType: '',
        startDate: '',
        endDate: ''
    };

    isLoading = false;

    errorMessage = '';

    onSubmit() {
        this.errorMessage = '';
        if (this.model.reportType && this.model.startDate && this.model.endDate) {
            if (new Date(this.model.endDate) <= new Date(this.model.startDate)) {
                this.errorMessage = 'End Date must be greater than Start Date.';
                return;
            }

            this.isLoading = true;
            this.reportService.createReport(this.model).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    console.log('Report created', res);
                    // Navigate to list
                    this.router.navigate(['/reports']);
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('Error creating report', err);
                    this.errorMessage = 'Failed to submit report request.';
                }
            });
        }
    }

    onClose() {
        this.router.navigate(['/reports']);
    }
}
