import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportJob, CreateReportDto } from '../models';

/**
 * Service responsible for standard HTTP API interactions with the backend.
 * It handles creating new report jobs and fetching the list of existing reports.
 */
@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private http = inject(HttpClient);
    private apiUrl = 'https://localhost:7232';

    /**
     * Sends a POST request to create a new report job.
     * @param report The report data (type, date range).
     * @returns An Observable of the created ReportJob.
     */
    createReport(report: CreateReportDto): Observable<ReportJob> {
        return this.http.post<ReportJob>(`${this.apiUrl}/reports`, report);
    }

    /**
     * Sends a GET request to fetch all report jobs.
     * @returns An Observable of an array of ReportJobs.
     */
    getReports(): Observable<ReportJob[]> {
        return this.http.get<ReportJob[]>(`${this.apiUrl}/reports`);
    }
}
