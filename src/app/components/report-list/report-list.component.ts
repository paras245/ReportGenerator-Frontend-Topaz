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
      try {
        const updatedJob = this.signalRService.jobUpdate();
        if (updatedJob) {
          console.log('Component: Received job update', updatedJob);
          this.updateReportList(updatedJob);
        }
      } catch (error) {
        console.error('Error processing SignalR update', error);
      }
    });
  }

  // Initialize component and start signalR connection
  ngOnInit() {
    try {
      this.initialLoad();
      this.signalRService.startConnection();

      this.pollSubscription = interval(5000).subscribe(() => {
        this.fetchReports(true);
      });
    } catch (error) {
      console.error('Error in ngOnInit', error);
    }
  }

  // Cleanup subscriptions on destroy
  ngOnDestroy() {
    try {
      if (this.pollSubscription) {
        this.pollSubscription.unsubscribe();
      }
    } catch (error) {
      console.error('Error in ngOnDestroy', error);
    }
  }

  // Initial fetch of reports
  initialLoad() {
    this.fetchReports(false);
  }

  // Fetch reports from service with polling flag
  fetchReports(isPolling: boolean) {
    try {
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
    } catch (error) {
      console.error('Error initiating fetchReports', error);
      if (!isPolling) {
        this.isLoading.set(false);
      }
    }
  }

  // Update the local signal safely
  updateReportList(updatedJob: ReportJob) {
    try {
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
    } catch (error) {
      console.error('Error updating report list', error);
    }
  }

  // Get status label for UI
  getStatusLabel(status: ReportStatus): string {
    try {
      return ReportStatus[status];
    } catch (error) {
      console.error('Error getting status label', error);
      return 'Unknown';
    }
  }

  // Get CSS class for status
  getStatusClass(status: ReportStatus): string {
    try {
      switch (status) {
        case ReportStatus.Pending: return 'status-pending';
        case ReportStatus.Processing: return 'status-processing';
        case ReportStatus.Completed: return 'status-completed';
        default: return 'status-failed';
      }
    } catch (error) {
      console.error('Error getting status class', error);
      return '';
    }
  }
}
