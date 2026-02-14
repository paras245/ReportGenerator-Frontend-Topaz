import { Component, OnInit, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { SignalRService } from '../../services/signalr.service';
import { ReportJob, ReportStatus } from '../../models';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css'
})
export class ReportListComponent implements OnInit, OnDestroy {
  private reportService = inject(ReportService);
  private signalRService = inject(SignalRService);
  private pollSubscription: Subscription | undefined;

  reports = signal<ReportJob[]>([]);
  isLoading = signal<boolean>(true);

  constructor() {
    // Effect to react to SignalR updates
    effect(() => {
      const updatedJob = this.signalRService.jobUpdate();
      if (updatedJob) {
        console.log('Component: Received job update', updatedJob);
        this.updateReportList(updatedJob);
      }
    });
  }

  ngOnInit() {
    this.initialLoad();
    this.signalRService.startConnection();

    this.pollSubscription = interval(5000).subscribe(() => {
      this.fetchReports(true);
    });
  }

  ngOnDestroy() {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  initialLoad() {
    this.fetchReports(false);
  }

  fetchReports(isPolling: boolean) {
    this.reportService.getReports().subscribe({
      next: (data) => {
        this.reports.set(data);
        if (!isPolling) {
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error fetching reports', err);
        if (!isPolling) {
          this.isLoading.set(false);
        }
      }
    });
  }

  updateReportList(updatedJob: ReportJob) {
    this.reports.update(currentReports => {
      const index = currentReports.findIndex(r => r.id === updatedJob.id);
      if (index !== -1) {
        // Update existing
        const newReports = [...currentReports];
        newReports[index] = updatedJob;
        return newReports;
      } else {
        // Add new (at top)
        return [updatedJob, ...currentReports];
      }
    });
  }

  getStatusLabel(status: ReportStatus): string {
    return ReportStatus[status];
  }

  getStatusClass(status: ReportStatus): string {
    switch (status) {
      case ReportStatus.Pending: return 'status-pending';
      case ReportStatus.Processing: return 'status-processing';
      case ReportStatus.Completed: return 'status-completed';
      default: return 'status-failed';
    }
  }
}
