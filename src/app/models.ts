export interface ReportJob {
  id: string;
  reportType: string;
  startDate: string;
  endDate: string;
  status: ReportStatus;
  createdAt: string;
}

export enum ReportStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2
}

export interface CreateReportDto {
  reportType: string;
  startDate: string;
  endDate: string;
}
