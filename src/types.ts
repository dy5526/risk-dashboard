/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KeyDrivers {
  burnout: number; // 0 to 10
  compensation: number; // 0 to 10
  careerGrowth: number; // 0 to 10
  leadershipConflict: number; // 0 to 10
  roleMismatch: number; // 0 to 10
}

export interface RedFlag {
  quote: string;
  issue: string;
}

export interface RiskHistoryItem {
  id: string;
  timestamp: string;
  previousScore: number;
  newScore: number;
  reason: string;
  updaterName?: string;
}

export interface EmployeeAnalysis {
  id: string; // Front-end generated or DB id
  employeeName: string;
  department: string;
  role: string;
  riskScore: number; // 0 to 100
  estimatedSalary: number; // in ten-thousand KRW (만 원), e.g., 6500 = 65,000,000 KRW
  keyDrivers: KeyDrivers;
  redFlags: RedFlag[];
  timeline: '즉시 (1-3개월)' | '중기 (3-6개월)' | '장기/낮음 (6개월 이상)' | string;
  executiveSummary: string;
  recommendations: string[];
  affectedProjects: string[]; // Projects affected by turnover
  mitigationApproach: string; // Leadership action/approach to reduce risk
  createdAt: string; // ISO string
  history?: RiskHistoryItem[];
}

export interface DepartmentSummary {
  name: string;
  avgRisk: number;
  headcount: number;
  atRiskCount: number;
  totalLossRisk: number;
}

export interface DashboardMetrics {
  totalEmployees: number;
  highRiskCount: number; // risk > 70
  mediumRiskCount: number; // 40 <= risk <= 70
  lowRiskCount: number; // risk < 40
  estimatedFinancialLoss: number; // Total replacement cost (estimatedSalary * 1.5)
  avgOrgRisk: number;
}
