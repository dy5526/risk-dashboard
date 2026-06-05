/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { INITIAL_EMPLOYEES } from "./data";
import { EmployeeAnalysis, DashboardMetrics } from "./types";
import EmployeeDetailPanel from "./components/EmployeeDetailPanel";
import WordCloud from "./components/WordCloud";

// Recharts imports for dark-themed, premium visualizations
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LabelList
} from "recharts";

import { 
  Users, 
  Activity, 
  RefreshCw,
  FolderTree,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  Radio,
  UserCheck,
  ShieldAlert,
  Frown,
  CheckCircle,
  HelpCircle,
  Workflow,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  Briefcase,
  Layers,
  HeartCrack,
  Clock,
  Heart,
  BarChart3,
  BookOpen
} from "lucide-react";

const initEmployeesList = (list: EmployeeAnalysis[]) => {
  return list.map(emp => ({
    ...emp,
    history: emp.history || [
      {
        id: `hist_${emp.id}_init`,
        timestamp: "2026.05.28 10:00",
        previousScore: 0,
        newScore: emp.riskScore,
        reason: "1온1 미팅 스크립트 기반 AI 최초 분석결과 생성",
        updaterName: "AI 분석 시스템"
      }
    ]
  }));
};

// 6 Required Leadership Competencies
const LEADERSHIP_COMPETENCIES = [
  { subject: "경청과 공감", desc: "고충과 피드백을 수용하고 정서적 공감대를 확보하는 열린 자세" },
  { subject: "명확성", desc: "조직의 명확한 R&R 설정, 단기/장기 마일스톤 및 가이드 공유" },
  { subject: "현황과 정렬", desc: "조직 성과와 비전을 팀원 개별 현황과 결합(Align)하는 실행력" },
  { subject: "심리적 안전감", desc: "불이익이나 비난 두려움 없이 누구나 자유롭게 소통할 수 있는 신뢰 환경" },
  { subject: "솔루션 제시", desc: "업무 병목이나 마찰 발생 시 적극 돌파하고 현실적 대안을 조치하는 능력" },
  { subject: "건설적 피드백", desc: "행동 기반의 객관적인 보강 조언과 성장을 돕는 수시 면담 가이드" }
];

interface LeadershipDept {
  scores: { subject: string; score: number; prevScore: number }[];
  growth: string;
  growthValue: number; // For growth graphics
  leaderCount: string;
  status: string;
  statusColor: string;
  desc: string;
}

const LEADERSHIP_DEPT_DATA: Record<string, LeadershipDept> = {
  "전체": {
    scores: [
      { subject: "경청과 공감", score: 6.8, prevScore: 6.5 },
      { subject: "명확성", score: 6.1, prevScore: 6.0 },
      { subject: "현황과 정렬", score: 6.5, prevScore: 6.2 },
      { subject: "심리적 안전감", score: 5.8, prevScore: 5.7 },
      { subject: "솔루션 제시", score: 7.0, prevScore: 6.4 },
      { subject: "건설적 피드백", score: 5.9, prevScore: 5.8 }
    ],
    growth: "+4.2%",
    growthValue: 4.2,
    leaderCount: "12명",
    status: "보통 (지속 육성)",
    statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    desc: "전사적으로 '솔루션 제시' 역량은 강력하나, '심리적 안전감'과 '건설적 피드백' 역량 보완을 통한 대화 질적 개선이 요구됩니다."
  },
  "AI개발본부": {
    scores: [
      { subject: "경청과 공감", score: 7.5, prevScore: 7.0 },
      { subject: "명확성", score: 7.8, prevScore: 7.2 },
      { subject: "현황과 정렬", score: 7.1, prevScore: 6.5 },
      { subject: "심리적 안전감", score: 6.8, prevScore: 6.2 },
      { subject: "솔루션 제시", score: 8.2, prevScore: 7.5 },
      { subject: "건설적 피드백", score: 7.3, prevScore: 6.8 }
    ],
    growth: "+8.5%",
    growthValue: 8.5,
    leaderCount: "4명",
    status: "우수 (안정적 성장)",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    desc: "수평적 기술 검토 및 활발한 피드백 루프로 전체 지표가 높은 고품질의 성장을 이룩 중입니다."
  },
  "프로덕트 디자인팀": {
    scores: [
      { subject: "경청과 공감", score: 3.5, prevScore: 5.5 },
      { subject: "명확성", score: 4.0, prevScore: 5.0 },
      { subject: "현황과 정렬", score: 5.0, prevScore: 6.2 },
      { subject: "심리적 안전감", score: 3.0, prevScore: 5.8 },
      { subject: "솔루션 제시", score: 6.2, prevScore: 6.2 },
      { subject: "건설적 피드백", score: 3.8, prevScore: 5.0 }
    ],
    growth: "-12.4%",
    growthValue: -12.4,
    leaderCount: "3명",
    status: "위태 (리더십 갈등 조치 요망)",
    statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    desc: "신임 디자인본부장 부임 후 독단적 탑다운 관리로 심리적 안전감 및 경청 공감 수준이 실질적인 퇴보 양상을 보입니다."
  },
  "플랫폼인프라팀": {
    scores: [
      { subject: "경청과 공감", score: 5.5, prevScore: 5.4 },
      { subject: "명확성", score: 5.8, prevScore: 5.7 },
      { subject: "현황과 정렬", score: 5.2, prevScore: 5.2 },
      { subject: "심리적 안전감", score: 5.0, prevScore: 4.9 },
      { subject: "솔루션 제시", score: 5.5, prevScore: 5.4 },
      { subject: "건설적 피드백", score: 4.8, prevScore: 4.8 }
    ],
    growth: "+1.2%",
    growthValue: 1.2,
    leaderCount: "3명",
    status: "보통 (인프라 과업 정제)",
    statusColor: "text-slate-400 bg-slate-500/10 border-slate-500/20",
    desc: "마찰 강도는 낮으나 다소 소극적인 지표 정체가 보여지며, 업무 R&R 가이드 라인 및 자율 주도성의 수혈이 제안됩니다."
  },
  "그로스마케팅팀": {
    scores: [
      { subject: "경청과 공감", score: 8.8, prevScore: 7.8 },
      { subject: "명확성", score: 8.5, prevScore: 7.5 },
      { subject: "현황과 정렬", score: 8.2, prevScore: 7.2 },
      { subject: "심리적 안전감", score: 8.9, prevScore: 7.8 },
      { subject: "솔루션 제시", score: 8.0, prevScore: 7.0 },
      { subject: "건설적 피드백", score: 8.1, prevScore: 7.1 }
    ],
    growth: "+14.1%",
    growthValue: 14.1,
    leaderCount: "2명",
    status: "최우수 (소통 신뢰 최고치)",
    statusColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    desc: "심리적 결속력이 탁월하며 원만한 정기 원온원을 통해 전 분야에 걸쳐 완벽한 모범 지표를 달성하였습니다."
  }
};

interface LeaderProfile {
  id: number;
  name: string;
  role: string;
  dept: string;
  type: "outstanding" | "toxic";
  overallScore: number;
  status: string;
  statusColor: string;
  desc: string;
  scores: { subject: string; score: number }[];
  actionItems: string[];
}

const LEADER_PROFILES: LeaderProfile[] = [
  {
    id: 1,
    name: "강석주",
    role: "디자인본부 본부장",
    dept: "프로덕트 디자인팀 / 디자인본부",
    type: "toxic",
    overallScore: 3.8,
    status: "심각 • 위험 경고",
    statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/25",
    desc: "신임 디자인 본부장 부임 후 지나친 마이크로매니징과 일방적 탑다운 지시성 소통이 반복되고 있습니다. 구성원 면담 내역 분석 결과 '권한 박탈', '의욕 상실', '자율성 무력화' 키워드가 전사 대비 410% 폭증하여 핵심 실무 시니어인 최윤서의 이탈 위기를 강력 촉발하고 있습니다. 이 상태가 지속될 시 핵심 디자인 리사이클 무력화 및 실무진 연쇄 이탈로 브랜드 및 제품 UIUX 디자인 경쟁력을 완전 상실할 우려가 큽니다. 리스크 해결을 위해서는 일방적 탑다운 지시성 소통을 전면 중단하고, 기획 의사결정 권한의 상당 부분을 프로젝트 현업 단위 실무진에게 공식 위임하도록 강력 권고합니다.",
    scores: [
      { subject: "경청과 공감", score: 3.5 },
      { subject: "명확성", score: 4.0 },
      { subject: "현황과 정렬", score: 5.0 },
      { subject: "심리적 안전감", score: 3.0 },
      { subject: "솔루션 제시", score: 6.2 },
      { subject: "건설적 피드백", score: 3.8 }
    ],
    actionItems: [
      "기획 의사결정권 긴급 분산 및 CEO 직속 우회 보고 채널 개설",
      "다면 인사 평가 리포트 기반 1차 경고 통보 조치 및 공식 소명 요구",
      "타 리더십 강요 사례 재발 방지를 위한 HR 밀착 인터뷰 상시 가동"
    ]
  },
  {
    id: 2,
    name: "최무현",
    role: "인프라팀 리더",
    dept: "플랫폼인프라팀",
    type: "toxic",
    overallScore: 5.1,
    status: "밀착 모니터링",
    statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    desc: "리더십 부재 및 R&R 역할 방임형 소통 장애. 1on1 정기 면담 불참률이 무려 80%에 도달하였으며, 실무 시니어와의 야근/인프라 가용 자원 배분에 대한 조율 의무를 회피하여 부서 피로도 및 이탈율을 촉진하고 있는 상태입니다. 계속 방치 시 인프라 파트 내부 협업 공백 극대화 및 R&R 갈등 장기화로 시스템 배포 안정성 심각 위배 및 장애 복구 골든타임 상실 우려가 있습니다. 문제 해결을 위해 매주 고정된 1on1 정기 이수율 90% 달성 상태를 강제 감사(Audit)하고, 업무 우선순위 배분 가이드라인을 수립하여 실무 분쟁에 적극 개입해야 합니다.",
    scores: [
      { subject: "경청과 공감", score: 5.5 },
      { subject: "명확성", score: 5.8 },
      { subject: "현황과 정렬", score: 5.2 },
      { subject: "심리적 안전감", score: 5.0 },
      { subject: "솔루션 제시", score: 5.5 },
      { subject: "건설적 피드백", score: 4.8 }
    ],
    actionItems: [
      "90일 소통 플래너 제출 의무화 및 원온원 준수 현황 주간 감사",
      "부서 R&R 가이드라인 재정립 및 업무 리더 전용 역량 워크숍 배정",
      "실무 연쇄 마찰 방지를 위한 플랫폼팀 주간 스탠드업 구조 개선"
    ]
  },
  {
    id: 3,
    name: "손민아",
    role: "데이터사이언스팀 리더",
    dept: "AI개발본부 (데이터사이언스)",
    type: "outstanding",
    overallScore: 9.3,
    status: "최우수 • 멘토",
    statusColor: "text-teal-400 bg-teal-500/10 border-teal-500/25",
    desc: "적극적인 심리적 지지와 정성적 성장을 연계한 이상적 커리어 1on1을 정기적으로 완수하고 있습니다. 개별 맞춤형 업무 목표 수립과 수평적인 업무 정렬을 실증하며 팀 내 정서 소통 만족도 및 성과 효율에서 전사 최고의 모범을 증명합니다. 다만, 우수 리더십의 사내 전파에 따른 리소스 과부하가 지속되면 리더 자신의 번아웃으로 시너지가 잠식될 수 있습니다. 이를 예방하기 위해 사내 코칭에 따른 정기적 스피커 수당 및 성과 보상을 즉각 실증하고, 일정 수준의 자율권 확대 등 심리 휴식 리워드 제도를 선제적으로 부여할 것을 제안합니다.",
    scores: [
      { subject: "경청과 공감", score: 9.5 },
      { subject: "명확성", score: 9.2 },
      { subject: "현황과 정렬", score: 9.0 },
      { subject: "심리적 안전감", score: 9.4 },
      { subject: "솔루션 제시", score: 9.6 },
      { subject: "건설적 피드백", score: 9.2 }
    ],
    actionItems: [
      "사내 원온원 우수 소통 마스터 라이센스 부여 및 멘토단 위촉",
      "전사 리더십 워크숍 우수 사례 스피커 및 퍼실리테이터 지정",
      "원활한 소통 격려를 위한 특별 HR 퍼포먼스 포상 가점 마크"
    ]
  },
  {
    id: 4,
    name: "이혜성",
    role: "그로스마케팅 파트 리더",
    dept: "그로스마케팅팀",
    type: "outstanding",
    overallScore: 8.9,
    status: "탁월 • 신뢰",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    desc: "팀원 개개인의 심리적 안전감을 적극 설계하여 대화 장벽을 낮추는 탁월한 소통 역량을 보여줍니다. 명확한 KPI 가이드를 유지함과 동시에 구성원의 리스크 제안을 건설적으로 보완하여 그로스마케팅 마일스톤의 완벽한 성장세를 유지하고 있습니다. 단, 지나치게 안전 위주 소통에 치우치면 긴급 고성과 수치 달성이 지연될 시 객관적인 정렬 피드백 한계 노출 가능성이 있습니다. 성장을 극대화하기 위해 심리적 결속 위에 계량화된 KPI/OKR 매트릭스를 긴밀히 연계하여 성과 수치와 조율 정밀도를 보조적으로 강화하도록 지원하는 것을 권장합니다.",
    scores: [
      { subject: "경청과 공감", score: 8.8 },
      { subject: "명확성", score: 8.5 },
      { subject: "현황과 정렬", score: 8.2 },
      { subject: "심리적 안전감", score: 8.9 },
      { subject: "솔루션 제시", score: 8.0 },
      { subject: "건설적 피드백", score: 8.1 }
    ],
    actionItems: [
      "파트너십 소통 리더 자격 승인 및 사내 코칭 조교단 편성",
      "심리 안전감 확보 전략 사례 사내 공동 문서화 및 템플릿 전파",
      "팀 마일스톤 성과 보상 연계 추가 스케일업 자금 배정 우선권"
    ]
  }
];

interface HeatMapMetric {
  name: string;
  score?: number;
  rate?: number;
  status: string;
  reason: string;
  solution: string;
}

interface HeatMapRow {
  dept: string;
  leader: string;
  metrics: HeatMapMetric[];
}

export const HEATMAP_SATISFACTION_DATA: HeatMapRow[] = [
  {
    dept: "프로덕트 디자인팀",
    leader: "강석주",
    metrics: [
      {
        name: "1on1 만족도",
        score: 3.2,
        status: "경고 (집중 개입 필요)",
        reason: "강석주의 권위주의적 탑다운 방식과 잦은 1on1 약속 당일 취소(42%)가 중첩되어 실무진들의 '의견 개진 위험성'과 정서적 침묵 장벽이 완성되었습니다. '말해봐야 반영되지 않는다'는 학습된 무기력이 팽배합니다.",
        solution: "강석주의 일방 결재 승인 단계를 간소화하고, 주니어 디자이너 주도 프로젝트 발의 권한을 확보하는 매니징 크레딧제를 가동합니다."
      },
      {
        name: "업무 몰입도",
        score: 3.5,
        status: "경고 (집중 개입 필요)",
        reason: "면담 시 리더 본인의 업적 자랑이나 업무 닥달 위주로 대화가 점철되어 구성원들이 감정적 에너지를 심각하게 갈취당한다고 보고하고 있습니다.",
        solution: "코칭 매뉴얼 가이드를 강제 적용하여 면담 시간의 80%를 리더의 침묵 및 경청으로 구성하도록 모니터링합니다."
      },
      {
        name: "성장 만족도",
        score: 4.8,
        status: "주의",
        reason: "업무 지시는 명확하나 그것이 개인의 경력 성장이나 실무적인 고충 제거와 연결되지 못해 이탈 심리를 자극하고 있습니다.",
        solution: "역량 매핑 모델 교육을 통해 시니어/주니어의 개별 성장 마일스톤에 부합하는 경력 중심 정합 면담 보정과 교육 기회를 지급합니다."
      }
    ]
  },
  {
    dept: "플랫폼인프라팀",
    leader: "최무현",
    metrics: [
      {
        name: "1on1 만족도",
        score: 4.0,
        status: "경고 (집중 개입 필요)",
        reason: "최무현의 업무 바쁨 핑계 면담 거부 및 회피로 인해, 실무진들이 현업 장애 상황을 마음 놓고 리포트할 소통 구역을 차단당했습니다.",
        solution: "주차별 정기 원온원 스케줄 감사를 신설하여 리더의 기피 현상을 통제하고 격주 소통 완수를 명문화합니다."
      },
      {
        name: "업무 몰입도",
        score: 4.8,
        status: "주의",
        reason: "대화 자체가 거의 이뤄지지 않아 피드백 단절이 일어났으며, 가끔 진행되는 면담에서도 방치하듯 공감 없이 지나가는 형식적 세션 경향이 보입니다.",
        solution: "초임 리더 대상 정서적 교감 트레이닝 및 '성장을 열어주는 피드백 오너십 스킬업' 교육에 필수 입과시킵니다."
      },
      {
        name: "성장 만족도",
        score: 3.5,
        status: "경고 (집중 개입 필요)",
        reason: "R&R 조율 거부, 가이드라인 부재, 인프라 야근 조율 갈등의 해결 부재로 인해 실무 업무 정렬 가치가 최하선까지 냉각되었습니다.",
        solution: "R&R 가이드북 설계 의무를 부여하고 협업 장애 발생 시 본부 차원의 중재 위원회를 즉각 가동합니다."
      }
    ]
  },
  {
    dept: "AI개발팀",
    leader: "손민아",
    metrics: [
      {
        name: "1on1 만족도",
        score: 8.5,
        status: "최우수",
        reason: "손민아의 격려 행동, 실패 감싸안기 태도를 통해 실무 진들이 실패의 위험을 무릅쓰고 대담한 개발 연구를 제안하는 등 심리 안전 만족도가 최상입니다.",
        solution: "우수한 경청 촉진 정서 모델을 사내 소통 스탠다드로 채택하여 전사 리더들에게 멘토링 사례로 추천 이양합니다."
      },
      {
        name: "업무 몰입도",
        score: 8.2,
        status: "최우수",
        reason: "팀원 1on1 취소율 4%, 성실한 경청으로 감정적 교감을 최우수 가치로 지탱하여 팀 전체가 강인한 직장 유대감과 만족도를 완수했습니다.",
        solution: "퍼실리테이터 우수 포상 수당 특별 보상 및 리더 본인의 감정 격무 소진 방지를 위한 정기 힐링 리워드를 제공합니다."
      },
      {
        name: "성장 만족도",
        score: 7.6,
        status: "우수",
        reason: "기술적인 스크립트 리뷰, 명확하게 조형된 데이터 개발 목표, R&R 및 연구 자원 조율이 촘촘하게 지원되는 정합 완결 모델입니다.",
        solution: "최첨단 데이터 가용 리서치 환경 인프라를 우선 확보해 부서의 연구 효율성을 영구적 지지합니다."
      }
    ]
  },
  {
    dept: "그로스마케팅팀",
    leader: "이혜성",
    metrics: [
      {
        name: "1on1 만족도",
        score: 7.2,
        status: "우수",
        reason: "이혜성의 원만하고 친절한 마인드로 대화 분위기가 매우 안락하게 유지되며, 사전 프렙 제출률이 92%에 달할 만큼 참여 열의가 높습니다.",
        solution: "우수 아젠다 풀을 공유하며 팀원 개별적 능동 의견과 실무 가이드라인 실증 모델 구축을 유지 공고합니다."
      },
      {
        name: "업무 몰입도",
        score: 7.8,
        status: "우수",
        reason: "팀원의 고충을 매우 사려 깊게 수청하고 상향 피드백을 수려하게 수용하는 우수한 지지 기반이 입증되었습니다.",
        solution: "마케팅 과업에 최적화된 협업 안전성 케어 예산 지속 증액 편성 지원."
      },
      {
        name: "성장 만족도",
        score: 6.5,
        status: "양호 (보완 권장)",
        reason: "팀 정서는 좋으나, 긴박한 실적 수치 압박 시 냉혹하고 객관화된 성과 지표(KPI/OKR) 지적 및 교정 피드백에 대해 심리적 주저함을 일부 느끼는 현상 감지.",
        solution: "정서 신뢰를 기반으로 흔들리지 않는 수치 성장을 이끄는 'KPI/OKR 성과 정렬 매트릭스 피드백 스쿨' 과정 이수를 적극 제안합니다."
      }
    ]
  }
];

export const HEATMAP_EXECUTION_DATA: HeatMapRow[] = [
  {
    dept: "프로덕트 디자인팀",
    leader: "강석주",
    metrics: [
      {
        name: "주기 준수율",
        rate: 45,
        status: "경고 (불이행 심각)",
        reason: "월 정기적으로 권장되는 1on1 면담 건수 대비 수행율수가 45%에 그쳐, 사실상 대화 주기가 붕괴하여 주니어들의 방치 기간이 늘어나고 있습니다.",
        solution: "최소 월 2회 세션을 자동 발송(Scheduler)하여 리더 캘린더에 고정 노출하고 이행 여부를 주간 인사 관리 지표로 인사팀에서 감사 추적합니다."
      },
      {
        name: "미팅 지연율",
        rate: 42,
        status: "경고 (스케줄 파탄)",
        reason: "당일 미팅 폭파 및 잦은 변경 빈도(취소/변경율 42%)로 인해 팀원들이 약속에 대한 실망감 및 소외감을 누증 체감합니다. '언제든 바쁘면 파토나는 요식행위'로 치부되고 있습니다.",
        solution: "1on1 일방적 당일 취소 페널티 제도를 도입하여, 취소 시 24시간 내 사유서 제출 및 차주 보조 세션 대체 개설을 의무화합니다."
      },
      {
        name: "프렙 진행율",
        rate: 45,
        status: "주의 (참여 저조)",
        reason: "수직적 리더십 고착에 따라 '의견을 적어 고민을 공유해도 개선되지 않는다'는 침묵주의가 가동되어 프렙 아젠다 등록률이 45%로 낮습니다.",
        solution: "의견 개진 채널을 활성화하기 위해 실무 주안점 사전 등록 시 인사 보정 가점을 임시 부여해 면답 자발 유입을 돕습니다."
      }
    ]
  },
  {
    dept: "플랫폼인프라팀",
    leader: "최무현",
    metrics: [
      {
        name: "주기 준수율",
        rate: 32,
        status: "경고 (불이행 위독)",
        reason: "인프라팀 핵심 리더십 면담 실행률이 32%로 전사 최하위선입니다. 이로 인해 2개월 연속 리더와 면담하지 못한 심리적 방치자가 존재합니다.",
        solution: "원온원 실시간 이행 감사 시스템을 작동해 강제 개시 경고장을 송부하고, 인사위원회에서 리스크 소통을 보강 대리 시행합니다."
      },
      {
        name: "미팅 지연율",
        rate: 35,
        status: "주의 (조율 미흡)",
        reason: "잦은 서버 장애 대응 및 타스킹 중복을 핑계로 당일 일정을 취소(35%)하는 주의 상태의 연쇄 고충이 적출되었습니다.",
        solution: "인프라 필수 정합 리소스를 보조할 전담 백엔드 리더 버퍼 인력을 투입해 대화 완수 시간을 의도적으로 격리 확보시킵니다."
      },
      {
        name: "프렙 진행율",
        rate: 28,
        status: "경고 (소통 방치)",
        reason: "리더의 무기력한 공감 능력과 면담 불완수 습성으로 인해 면담 가치 실효에 대침묵이 감지되었습니다. 사전 등록률이 28%에 머물고 있습니다.",
        solution: "간소한 1줄 질문/소견 퀵 프렙 제출 형식을 장려해 주니어들의 등록 편의성을 보완 설계합니다."
      }
    ]
  },
  {
    dept: "AI개발팀",
    leader: "손민아",
    metrics: [
      {
        name: "주기 준수율",
        rate: 96,
        status: "최우수 (이행 우뚝)",
        reason: "바쁜 일정 전반에서도 소통 마일스톤 이행을 절대적인 우선순위로 간주해, 이행률 96%의 완전무결 결합 소통 행렬을 증명 중입니다.",
        solution: "성실 실천 사례집 배포 및 사내 리더십 다이얼로그 강사로 초빙, 인사 마일스톤 특전 수당 배급."
      },
      {
        name: "미팅 지연율",
        rate: 4,
        status: "최우수",
        reason: "당일 세션 취소율 단 4%대로서, 팀원들의 약속 준수를 최고의 신뢰 계약으로 체화하여 소통 안정도를 극대화하고 있습니다.",
        solution: "팀원 소통 완성을 지탱하는 지속적인 원격 자율 및 캘린더 정렬 세이버 지원책 마련."
      },
      {
        name: "프렙 진행율",
        rate: 78,
        status: "우수 (참여 원활)",
        reason: "팀원 스스로 1on1 면담 가치의 실물 개선성을 높게 승인하여 78%의 높은 비율로 능동 고민/논의점을 사전에 준비해 제출하고 있습니다.",
        solution: "작성 아젠다 질적 피드백 우대 가이드를 이양해 면담 밀도의 선순환 성장을 고착화합니다."
      }
    ]
  },
  {
    dept: "그로스마케팅팀",
    leader: "이혜성",
    metrics: [
      {
        name: "주기 준수율",
        rate: 88,
        status: "우수",
        reason: "유연하고 돈독한 정서 유대로 88%의 월별 이행률을 달성해 정기적인 정서 지지선을 가동하고 있습니다.",
        solution: "현행 마케팅 루프 정렬 면담을 지탱하고, 성장 피드백을 보완 결합하도록 수시 지원합니다."
      },
      {
        name: "미팅 지연율",
        rate: 8,
        status: "우수 (최고 밀착)",
        reason: "미팅 당일 약속 파토 비율을 단 8% 수준으로 억제하며 성실하고 원만한 신뢰 협업 전선을 완충 확보하고 있습니다.",
        solution: "마케팅 과업 조형 수립 및 리더 보호를 위한 업무 가용 인력 보조선 확보."
      },
      {
        name: "프렙 진행율",
        rate: 92,
        status: "최우수 (전사 1위)",
        reason: "감정 공조 및 이타적 수용력을 통해 실무진들의 고민 발화 참여도가 92%로 전사에서 가장 높게 과열된 건강한 협동 루프입니다.",
        solution: "고민 사전등록 사례를 모아 감정적 소통 활성화 모델을 모전 가이드로 패키징 배포 유도."
      }
    ]
  }
];

export const TIME_SERIES_BY_TEAM: Record<string, { month: string; satisfaction: number; engagement: number; growth: number }[]> = {
  "AI개발팀": [
    { month: "1월", satisfaction: 6.8, engagement: 6.5, growth: 7.2 },
    { month: "2월", satisfaction: 7.0, engagement: 6.7, growth: 7.5 },
    { month: "3월", satisfaction: 7.2, engagement: 6.8, growth: 7.8 },
    { month: "4월", satisfaction: 7.5, engagement: 7.0, growth: 8.0 },
    { month: "5월", satisfaction: 8.5, engagement: 7.2, growth: 8.1 },
  ],
  "프로덕트 디자인팀": [
    { month: "1월", satisfaction: 5.5, engagement: 5.8, growth: 5.2 },
    { month: "2월", satisfaction: 4.8, engagement: 5.1, growth: 4.6 },
    { month: "3월", satisfaction: 4.0, engagement: 4.2, growth: 3.8 },
    { month: "4월", satisfaction: 3.5, engagement: 3.8, growth: 3.0 },
    { month: "5월", satisfaction: 3.2, engagement: 3.5, growth: 2.8 },
  ],
  "플랫폼인프라팀": [
    { month: "1월", satisfaction: 6.0, engagement: 6.2, growth: 5.8 },
    { month: "2월", satisfaction: 5.5, engagement: 5.8, growth: 5.1 },
    { month: "3월", satisfaction: 4.8, engagement: 5.0, growth: 4.5 },
    { month: "4월", satisfaction: 4.2, engagement: 4.5, growth: 3.9 },
    { month: "5월", satisfaction: 3.8, engagement: 4.0, growth: 3.5 },
  ],
  "그로스마케팅팀": [
    { month: "1월", satisfaction: 6.0, engagement: 5.9, growth: 6.5 },
    { month: "2월", satisfaction: 6.2, engagement: 6.1, growth: 6.8 },
    { month: "3월", satisfaction: 6.5, engagement: 6.2, growth: 7.0 },
    { month: "4월", satisfaction: 6.4, engagement: 6.2, growth: 7.2 },
    { month: "5월", satisfaction: 6.5, engagement: 6.2, growth: 7.5 },
  ],
};

export default function App() {
  const [employees, setEmployees] = useState<EmployeeAnalysis[]>(() => initEmployeesList(INITIAL_EMPLOYEES));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(INITIAL_EMPLOYEES[0]?.id || null);
  const [activeTab, setActiveTab] = useState<"risk" | "leadership" | "comms" | "satisfaction" | "bottleneck">("risk");
  const [selectedLeadDeptA, setSelectedLeadDeptA] = useState<string>("전체");
  const [selectedLeadDeptB, setSelectedLeadDeptB] = useState<string>("프로덕트 디자인팀");
  const [selectedCell, setSelectedCell] = useState<{
    dept: string;
    leader: string;
    metric?: string;
    level?: string;
    score?: number;
    rate?: number;
    status: string;
    reason: string;
    solution: string;
    type?: "satisfaction" | "execution";
  } | null>({
    dept: "프로덕트 디자인팀",
    leader: "강석주",
    metric: "1on1 만족도",
    level: "1on1 만족도",
    score: 3.2,
    status: "경고 (집중 개입 필요)",
    reason: "강석주의 권위주의적 탑다운 방식과 잦은 1on1 약속 당일 취소(42%)가 중첩되어 실무진들의 '의견 개진 위험성'과 정서적 침묵 장벽이 완성되었습니다. '말해봐야 반영되지 않는다'는 학습된 무기력이 팽배합니다.",
    solution: "강석주의 일방 결재 승인 단계를 간소화하고, 주니어 디자이너 주도 프로젝트 발의 권한을 확보하는 매니징 크레딧제를 가동합니다.",
    type: "satisfaction"
  });
  const [selectedOutstandingId, setSelectedOutstandingId] = useState<number>(3);
  const [selectedToxicId, setSelectedToxicId] = useState<number>(1);
  const [selectedTimeSeriesTeam, setSelectedTimeSeriesTeam] = useState<string>("AI개발팀");
  const [selectedBottleneckDept, setSelectedBottleneckDept] = useState<string>("all");

  // Get currently selected employee object
  const selectedEmployee = useMemo(() => {
    return employees.find(e => e.id === selectedEmployeeId) || null;
  }, [employees, selectedEmployeeId]);

  // Unique list of all affected projects for those at medium/high risk (Score >= 40) across the company, mapped to their owners (contributing employees)
  const affectedProjectsWithOwners = useMemo(() => {
    const atRiskEmployees = employees.filter(e => e.riskScore >= 40);
    const projectsMap = new Map<string, { project: string; owners: { id: string; name: string; dept: string; score: number }[] }>();

    atRiskEmployees.forEach(emp => {
      if (emp.affectedProjects) {
        emp.affectedProjects.forEach(proj => {
          const cleanName = proj.split(" (")[0].trim();
          const existing = projectsMap.get(cleanName) || { project: cleanName, owners: [] };
          if (!existing.owners.some(o => o.id === emp.id)) {
            existing.owners.push({
              id: emp.id,
              name: emp.employeeName,
              dept: emp.department,
              score: emp.riskScore
            });
          }
          projectsMap.set(cleanName, existing);
        });
      }
    });

    return Array.from(projectsMap.values());
  }, [employees]);

  // Compute live dashboard metrics based on active employee roster
  const metrics = useMemo<DashboardMetrics & { uniqueRiskProjectsCount: number; safeCount: number; targetCount: number }>(() => {
    const total = employees.length;
    const highRisk = employees.filter(e => e.riskScore >= 70).length;
    const mediumRisk = employees.filter(e => e.riskScore >= 40 && e.riskScore < 70).length;
    const lowRisk = employees.filter(e => e.riskScore >= 20 && e.riskScore < 40).length;
    const safeCount = employees.filter(e => e.riskScore < 20).length;
    const targetCount = highRisk + mediumRisk + lowRisk;

    const avgOrgRisk = total > 0 
      ? Math.round(employees.reduce((sum, emp) => sum + emp.riskScore, 0) / total) 
      : 0;

    return {
      totalEmployees: total,
      highRiskCount: highRisk,
      mediumRiskCount: mediumRisk,
      lowRiskCount: lowRisk,
      safeCount,
      targetCount,
      estimatedFinancialLoss: 0,
      avgOrgRisk,
      uniqueRiskProjectsCount: affectedProjectsWithOwners.length
    };
  }, [employees, affectedProjectsWithOwners]);

  // Transform roster into Department aggregates with clear risk category counts
  const departmentChartData = useMemo(() => {
    const map = new Map<string, { highRisk: number; mediumRisk: number; lowRisk: number }>();

    employees.filter(e => e.riskScore >= 20).forEach(e => {
      const deptName = e.department || "공통/기타";
      const state = map.get(deptName) || { highRisk: 0, mediumRisk: 0, lowRisk: 0 };
      
      if (e.riskScore >= 70) {
        state.highRisk += 1;
      } else if (e.riskScore >= 40) {
        state.mediumRisk += 1;
      } else if (e.riskScore >= 20) {
        state.lowRisk += 1;
      }

      map.set(deptName, state);
    });

    const formatData: any[] = [];
    map.forEach((val, name) => {
      const total = val.highRisk + val.mediumRisk + val.lowRisk;
      const atRiskCount = val.highRisk + val.mediumRisk;
      const percentage = total > 0 ? Math.round((atRiskCount / total) * 100) : 0;
      formatData.push({
        name,
        "고위험": val.highRisk,
        "위험": val.mediumRisk,
        "확인 필요": val.lowRisk,
        "label": `${percentage}%`
      });
    });

    return formatData;
  }, [employees]);



  // Handle adding new analyzed profile
  const handleAddNewEmployee = (newEmp: EmployeeAnalysis) => {
    // Check if the employee with same name already exists in active roster
    const exists = employees.some(e => e.employeeName === newEmp.employeeName);
    let finalEmp = newEmp;
    if (exists) {
      // Modify ID to ensure uniqueness but keep standard
      finalEmp = {
        ...newEmp,
        id: `emp_ai_${Date.now()}`
      };
    }
    const withHistory: EmployeeAnalysis = {
      ...finalEmp,
      history: finalEmp.history || [
        {
          id: `hist_${finalEmp.id}_init`,
          timestamp: "2026.06.02 12:00",
          previousScore: 0,
          newScore: finalEmp.riskScore,
          reason: "신규 분석 1온1 면담 피드백 생성 완료",
          updaterName: "AI 분석 시스템"
        }
      ]
    };
    setEmployees(prev => [withHistory, ...prev]);
    // Set active inspection
    setSelectedEmployeeId(withHistory.id);
  };

  // Handle updating risk score and appending to history logs
  const handleUpdateEmployeeRisk = (id: string, newScore: number, reason: string, updaterName: string) => {
    setEmployees(prevList => prevList.map(emp => {
      if (emp.id === id) {
        const now = new Date();
        const formattedTime = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const newHistoryItem = {
          id: `hist_${id}_${Date.now()}`,
          timestamp: formattedTime,
          previousScore: emp.riskScore,
          newScore,
          reason,
          updaterName
        };
        return {
          ...emp,
          riskScore: newScore,
          history: [newHistoryItem, ...(emp.history || [])]
        };
      }
      return emp;
    }));
  };

  // Reset database state to mock pre-populated ones
  const handleResetData = () => {
    setEmployees(initEmployeesList(INITIAL_EMPLOYEES));
    setSelectedEmployeeId(INITIAL_EMPLOYEES[0]?.id || null);
  };

  return (
    <div className="relative min-h-screen pb-16">
      {/* Decorative neon ambient glows */}
      <div className="glow-bg top-[-10vh] left-[-10vw]" />
      <div className="glow-bg-rose top-[40vh] right-[-10vw]" />

      {/* Main Executive Toolbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-[#0B0F13]/90 shadow-lg backdrop-blur-md pb-4 pt-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight text-white font-sans">
                Orblit <span className="text-teal-400">1on1</span>
              </h1>
            </div>
            <p className="text-slate-500 text-xs mt-1.5 font-medium whitespace-nowrap leading-normal">
              ※ 본 분석 결과는 1온1 면담 스크립트 데이터를 바탕으로 한 AI 예측치이므로 실제 상담 피드백과 함께 유연하게 판단해 주십시오.
            </p>
          </div>

          <div className="flex items-center space-x-6 shrink-0 mt-2 md:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 font-bold">데이터 수집 기준</p>
              <p className="text-xs font-mono text-slate-300">2026.06.01 15:12 GMT+9</p>
            </div>
          </div>
        </div>
      </header>

      {/* Top Main Panel */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Interactive Premium Navigation Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-slate-800 bg-[#0E1217]/80 p-1.5 rounded-xl">
          {[
            { id: "risk", label: "이탈 위험", icon: Users },
            { id: "leadership", label: "리더십", icon: UserCheck },
            { id: "comms", label: "소통 히트맵", icon: MessageSquare },
            { id: "satisfaction", label: "1on1 만족도", icon: TrendingUp },
            { id: "bottleneck", label: "병목", icon: ShieldAlert },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/25 font-bold"
                    : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Split layouts - Diagnostic report lifted to the top right directly */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Main Information Arena (7 Cols on Desktop or Full width if other tabs are active) */}
          <div className={`${activeTab === "risk" ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>

            {/* TAB 1: 이탈 위험 (Retention Risk - Default Views) */}
            {activeTab === "risk" && (
              <div className="space-y-4">
                {/* Combined Card: 코호트 관리 대상 & 분포 비율 */}
                <div 
                  id="metric-card-총-이탈-점검-관리-대상-및-비율"
                  className="relative overflow-hidden rounded-xl border border-teal-500/25 bg-[#14181F] p-4 shadow-[0_0_22px_rgba(20,184,166,0.04)] transition-all duration-300 hover:border-slate-700/60"
                >
                  {/* Accent corner line */}
                  <div className="absolute top-0 left-0 h-[3px] w-24 bg-teal-400" />
                  
                  <div className="space-y-4">
                    
                    {/* Header Section */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-teal-400" />
                        이탈 점검 관리 대상 코호트 및 진단 분포
                      </h3>
                      <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 shrink-0">
                        총 {metrics.targetCount}명
                      </span>
                    </div>

                    {/* Progress Stack bar */}
                    <div className="bg-[#0B0F13]/40 rounded-lg p-3">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1.5">
                        <span className="font-semibold text-slate-300">정밀 진단별 비율 분포</span>
                        <span className="text-[9px] text-slate-500">누적 현황</span>
                      </div>
                      
                      <div className="h-2 w-full rounded-full bg-slate-800 flex overflow-hidden">
                        <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${metrics.targetCount ? (metrics.highRiskCount / metrics.targetCount * 100) : 0}%` }} title="고위험" />
                        <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${metrics.targetCount ? (metrics.mediumRiskCount / metrics.targetCount * 100) : 0}%` }} title="경계" />
                        <div className="bg-[#10B981] h-full transition-all duration-500" style={{ width: `${metrics.targetCount ? (metrics.lowRiskCount / metrics.targetCount * 100) : 0}%` }} title="확인 필요" />
                      </div>

                      {/* Labels Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-[9px] sm:text-[10px]">
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          <span className="text-slate-400">고위험:</span>
                          <span className="text-slate-202 font-mono font-bold">{metrics.highRiskCount}명 ({metrics.targetCount ? Math.round(metrics.highRiskCount / metrics.targetCount * 100) : 0}%)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span className="text-slate-400">위험:</span>
                          <span className="text-slate-202 font-mono font-bold">{metrics.mediumRiskCount}명 ({metrics.targetCount ? Math.round(metrics.mediumRiskCount / metrics.targetCount * 100) : 0}%)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                          <span className="text-slate-400">확인필요:</span>
                          <span className="text-slate-202 font-mono font-bold">{metrics.lowRiskCount}명 ({metrics.targetCount ? Math.round(metrics.lowRiskCount / metrics.targetCount * 100) : 0}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Cohort selection list */}
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {employees.filter((emp) => emp.riskScore >= 20).map((emp) => {
                          const isActive = emp.id === selectedEmployeeId;
                          const tier = emp.riskScore >= 70 ? "고위험" : emp.riskScore >= 40 ? "위험" : "확인 필요";
                          const badgeColor = 
                            tier === "고위험" ? "bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold" : 
                            tier === "위험" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold" : 
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold";
                          const borderStyles = isActive 
                            ? "border-teal-500 bg-teal-950/20 shadow-[0_0_8px_rgba(20,184,166,0.15)]" 
                            : "border-slate-800/80 bg-[#0B0F13]/55 hover:bg-slate-800/40 hover:border-slate-700";

                          return (
                            <button
                              key={emp.id}
                              onClick={() => setSelectedEmployeeId(emp.id)}
                              className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all cursor-pointer ${borderStyles}`}
                            >
                              <div className="truncate pr-1">
                                <p className="text-[10px] font-bold text-slate-200 truncate leading-tight">{emp.employeeName}</p>
                                <p className="text-[8px] text-slate-500 mt-0.5 truncate leading-none">{emp.department}</p>
                              </div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${badgeColor}`}>
                                {tier}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Visual Charts Box */}
                <div className="rounded-xl border border-slate-800 bg-[#14181F] overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 bg-[#12161D] px-5 py-3">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                      <BarChart3 className="h-4 w-4 text-teal-400" />
                      부서별 이탈 위험 상세 분포
                    </h4>
                  </div>

                  <div className="p-4 bg-[#14181F]/30">
                    <div>
                      <div className="h-[285px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={departmentChartData}
                            margin={{ top: 25, right: 10, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#223049" />
                            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                            <YAxis stroke="#2dd4bf" fontSize={10} domain={[0, 'auto']} allowDecimals={false} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#14181F', borderColor: '#334155', color: '#fff' }}
                              itemStyle={{ fontSize: '11px' }}
                              labelStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                            <Bar dataKey="고위험" fill="#e11d48" stackId="riskStack" maxBarSize={32} />
                            <Bar dataKey="위험" fill="#f59e0b" stackId="riskStack" maxBarSize={32} />
                            <Bar dataKey="확인 필요" fill="#10b981" stackId="riskStack" maxBarSize={32} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 이탈 위협 노출 핵심 프로젝트 (부서 분포 아래에 수려하게 재배치) */}
                <div 
                  id="metric-card-이탈-위협-노출-핵심-프로젝트"
                  className="relative overflow-hidden rounded-xl border border-rose-500/20 bg-[#14181F] shadow-[0_0_20px_rgba(244,63,94,0.03)] p-4 transition-all duration-300 hover:border-slate-700/60"
                >
                  <div className="absolute top-0 left-0 h-[3px] w-12 bg-rose-500" />
                  
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5 mb-3.5">
                    <div className="flex items-center gap-1.5">
                      <FolderTree className="h-4 w-4 text-rose-400" />
                      <div>
                        <h3 className="text-xs font-bold text-white transition-colors border-b-0">
                          이탈 시 영향을 받는 프로젝트/업무
                        </h3>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 shrink-0">
                      총 {metrics.uniqueRiskProjectsCount}개 업무
                    </span>
                  </div>

                  {/* Polished Grid representation for projects with elegant pills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {affectedProjectsWithOwners.length > 0 ? (
                      affectedProjectsWithOwners.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex flex-col justify-between rounded-xl bg-slate-900/35 border border-slate-800/80 p-3.5 hover:border-slate-700/65 hover:bg-slate-900/50 transition-all duration-300 font-sans"
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap gap-1">
                              {item.owners.map(owner => {
                                const isHighRisk = owner.score >= 70;
                                const pillStyle = isHighRisk 
                                  ? "border-rose-500/20 text-rose-400 bg-rose-500/10 hover:border-rose-500/40 hover:bg-rose-500/15"
                                  : "border-amber-500/20 text-amber-400 bg-amber-500/10 hover:border-amber-500/40 hover:bg-amber-500/15";
                                
                                return (
                                  <button
                                    key={owner.id}
                                    onClick={() => setSelectedEmployeeId(owner.id)}
                                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[9px] font-bold cursor-pointer transition-all ${pillStyle}`}
                                  >
                                    <span className="h-1 w-1 bg-current rounded-full" />
                                    <span>{owner.name} · {owner.dept}</span>
                                  </button>
                                );
                              })}
                            </div>
                            <h4 className="text-xs font-bold text-slate-100 leading-normal pt-1" title={item.project}>
                              {item.project}
                            </h4>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-500 italic py-1.5 col-span-2">위험 노출된 프로젝트가 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 리더십 (Leadership Analysis) */}
            {activeTab === "leadership" && (
              <div className="space-y-4 animate-fadeIn">
                {/* Upper grid: Comparative Dept */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left Column: Comparative Department Details (lg:col-span-12) */}
                  <div className="lg:col-span-12 rounded-xl border border-slate-800 bg-[#14181F]/90 p-5 shadow-lg flex flex-col justify-between">
                    <div>
                      {/* Top bar with Title & Dropdown selectors */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                          <Activity className="h-4 w-4 text-teal-400" />
                          리더십 역량 분석
                        </h3>
                        {/* Dual Selector controls */}
                        <div className="flex items-center gap-1.5 self-end">
                          <span className="text-[10px] text-slate-500 font-bold font-sans">대상 부서 A:</span>
                          <select
                            value={selectedLeadDeptA}
                            onChange={(e) => setSelectedLeadDeptA(e.target.value)}
                            className="bg-[#0e1217] text-[11px] text-teal-400 font-bold border border-teal-500/30 rounded px-1.5 py-0.5 focus:border-teal-400 focus:outline-none cursor-pointer"
                          >
                            {Object.keys(LEADERSHIP_DEPT_DATA).map((dept) => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                          <span className="text-[10px] text-slate-500 font-bold font-sans">vs</span>
                          <span className="text-[10px] text-slate-500 font-bold font-sans">대상 부서 B:</span>
                          <select
                            value={selectedLeadDeptB}
                            onChange={(e) => setSelectedLeadDeptB(e.target.value)}
                            className="bg-[#0e1217] text-[11px] text-amber-400 font-bold border border-amber-500/30 rounded px-1.5 py-0.5 focus:border-amber-400 focus:outline-none cursor-pointer"
                          >
                            {Object.keys(LEADERSHIP_DEPT_DATA).map((dept) => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* 3-Column Comparison Layout with Radar chart in the middle */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-sans mt-3">
                        {/* Column 1: Department A Metrics Details */}
                        <div className="lg:col-span-4 bg-[#0E1217]/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3 border-b border-slate-800/40 pb-2.5">
                              <span className="text-sm font-bold text-teal-400 font-sans">
                                {selectedLeadDeptA}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                리더 {LEADERSHIP_DEPT_DATA[selectedLeadDeptA]?.leaderCount || "0명"}
                              </span>
                            </div>
                            
                            {/* Growth Indicator and Status badge */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${LEADERSHIP_DEPT_DATA[selectedLeadDeptA]?.statusColor}`}>
                                {LEADERSHIP_DEPT_DATA[selectedLeadDeptA]?.status}
                              </span>
                              <div className="bg-slate-800/40 text-[9.5px] border border-slate-800 rounded px-1.5 py-0.5 text-slate-400">
                                <span className={`font-bold ${parseFloat(LEADERSHIP_DEPT_DATA[selectedLeadDeptA]?.growth || "0") >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{LEADERSHIP_DEPT_DATA[selectedLeadDeptA]?.growth}</span>
                              </div>
                            </div>

                            {/* Scores list */}
                            <div className="space-y-3.5 mt-4">
                              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">6대 역량 상세 점수</div>
                              {LEADERSHIP_COMPETENCIES.map((comp, idx) => {
                                const score = LEADERSHIP_DEPT_DATA[selectedLeadDeptA]?.scores[idx]?.score || 0;
                                return (
                                  <div key={idx} className="space-y-1.5 font-sans">
                                    <div className="flex justify-between items-center text-[10.5px]">
                                      <span className="text-slate-400">{comp.subject}</span>
                                      <span className="font-mono font-bold text-teal-400">{score}점</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-850 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-teal-500 transition-all duration-300"
                                        style={{ width: `${score * 10}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Radar comparison */}
                        <div className="lg:col-span-4 bg-[#0E1217]/55 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
                          <div className="border-b border-slate-800/40 pb-2.5 mb-3.5">
                            <span className="text-[11.5px] font-bold text-slate-300 font-sans block">부서 역량 교차 진단</span>
                          </div>
                          <div className="h-[250px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="42%" outerRadius="76%" data={LEADERSHIP_COMPETENCIES.map((comp, idx) => ({
                                  subject: comp.subject,
                                  scoreA: LEADERSHIP_DEPT_DATA[selectedLeadDeptA]?.scores[idx]?.score || 0,
                                  scoreB: LEADERSHIP_DEPT_DATA[selectedLeadDeptB]?.scores[idx]?.score || 0
                                }))}>
                                <PolarGrid stroke="#223049" />
                                <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={10} />
                                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#1E293B" tick={false} />
                                <Radar 
                                  name={selectedLeadDeptA} 
                                  dataKey="scoreA" 
                                  stroke="#2dd4bf" 
                                  fill="#2dd4bf" 
                                  fillOpacity={0.25} 
                                />
                                <Radar 
                                  name={selectedLeadDeptB} 
                                  dataKey="scoreB" 
                                  stroke="#fbbf24" 
                                  fill="#fbbf24" 
                                  fillOpacity={0.25} 
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: "#0d1117", 
                                    borderColor: "#334155", 
                                    color: "#fff", 
                                    fontSize: "10px", 
                                    borderRadius: "8px" 
                                  }} 
                                />
                                <Legend wrapperStyle={{ fontSize: '9px', paddingTop: '8px' }} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Column 3: Department B Metrics Details */}
                        <div className="lg:col-span-4 bg-[#0E1217]/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3 border-b border-slate-800/40 pb-2.5">
                              <span className="text-sm font-bold text-amber-400 font-sans">
                                {selectedLeadDeptB}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                리더 {LEADERSHIP_DEPT_DATA[selectedLeadDeptB]?.leaderCount || "0명"}
                              </span>
                            </div>
                            
                            {/* Growth Indicator and Status badge */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${LEADERSHIP_DEPT_DATA[selectedLeadDeptB]?.statusColor}`}>
                                {LEADERSHIP_DEPT_DATA[selectedLeadDeptB]?.status}
                              </span>
                              <div className="bg-slate-800/40 text-[9.5px] border border-slate-800 rounded px-1.5 py-0.5 text-slate-400">
                                <span className={`font-bold ${parseFloat(LEADERSHIP_DEPT_DATA[selectedLeadDeptB]?.growth || "0") >= 0 ? "text-emerald-450" : "text-rose-455"}`}>{LEADERSHIP_DEPT_DATA[selectedLeadDeptB]?.growth}</span>
                              </div>
                            </div>

                            {/* Scores list */}
                            <div className="space-y-3.5 mt-4">
                              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">6대 역량 상세 점수</div>
                              {LEADERSHIP_COMPETENCIES.map((comp, idx) => {
                                const score = LEADERSHIP_DEPT_DATA[selectedLeadDeptB]?.scores[idx]?.score || 0;
                                return (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex justify-between items-center text-[10.5px]">
                                      <span className="text-slate-400">{comp.subject}</span>
                                      <span className="font-mono font-bold text-amber-400">
                                        <span>{score}점</span>
                                      </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-[#fbbf24] transition-all duration-700" 
                                        style={{ width: `${score * 10}%` }} 
                                        />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Outstanding vs Toxic Leadership Profile side-by-side */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  
                  {/* Left Column: Caution Leaders Detailed Profiles */}
                  <div className="rounded-xl bg-[#14181F]/95 p-5 shadow-lg flex flex-col gap-5">
                    
                    {/* 1. 주의/독성 리더 정밀 진단 */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-855 pb-3.5 gap-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />
                          <h3 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
                            정밀 소통 진단 소견 (주의 리더)
                          </h3>
                        </div>
                      </div>

                      {/* Instruction & Caution Tabs Selection Row */}
                      <div className="space-y-2">
                        <div className="text-[10px] text-slate-500 font-semibold font-sans tracking-wide">
                          조회할 대상 리더를 선택하세요
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {LEADER_PROFILES.filter(p => p.type === "toxic").map((profile) => {
                            const isSelected = profile.id === selectedToxicId;
                            const activeClass = isSelected
                              ? "bg-rose-500/10 text-rose-400 font-bold border-rose-500/40 shadow-sm shadow-rose-950/20"
                              : "bg-[#0E1217]/40 text-slate-400 hover:bg-[#0E1217]/80 hover:text-slate-300 border-slate-800/80";
                            
                            const formattedLabel = `${profile.name} (${profile.dept.split(" / ")[0]})`;
                            return (
                              <button
                                key={profile.id}
                                onClick={() => setSelectedToxicId(profile.id)}
                                className={`px-3 py-1.5 rounded-lg border text-[11px] font-sans transition-all duration-200 cursor-pointer ${activeClass}`}
                              >
                                {formattedLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {(() => {
                        const leader = LEADER_PROFILES.find(p => p.id === selectedToxicId);
                        if (!leader) return null;
                        return (
                          <div className="space-y-4 bg-[#14181F]/40 rounded-xl p-4 animate-fadeIn">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800/60 pb-3">
                              <div>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-sm font-bold text-slate-100">{leader.name}</span>
                                  <span className="text-[11px] text-slate-455 font-normal">({leader.dept.split(" / ")[0]})</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11.5px] text-rose-400 font-bold font-mono">
                                  종합 {leader.overallScore}점
                                </span>
                              </div>
                            </div>

                            {/* Detailed Competency Scores & Bars */}
                            <div className="space-y-2.5 pb-1">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
                                {leader.scores.map((comp, idx) => {
                                  const scoreColor = leader.id === 1 ? "text-rose-400" : "text-amber-400";
                                  const barColor = leader.id === 1 ? "bg-rose-500" : "bg-amber-500";
                                  return (
                                    <div key={idx} className="space-y-1 font-sans">
                                      <div className="flex justify-between items-center text-[10.5px]">
                                        <span className="text-slate-400 font-medium">{comp.subject}</span>
                                        <span className={`font-mono font-bold ${scoreColor}`}>
                                          {comp.score}점
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full bg-slate-850 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full ${barColor} transition-all duration-300`}
                                          style={{ width: `${comp.score * 10}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Diagnosis Opinion text segment */}
                            <div className="p-3 bg-[#0E1217]/60 rounded-xl border border-slate-800/80 font-sans">
                              <span className="text-[10px] font-bold text-rose-455 block mb-1">리더 분석 인사이트</span>
                              <p className="text-[11px] text-slate-350 leading-relaxed">
                                {leader.desc}
                              </p>
                            </div>

                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right Column: Excellent Leaders Detailed Profiles */}
                  <div className="rounded-xl bg-[#14181F]/95 p-5 shadow-lg flex flex-col gap-5">
                    
                    {/* 우수 리더 정밀 진단 */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-855 pb-3.5 gap-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-teal-400" />
                          <h3 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
                            정밀 소통 진단 소견 (우수 리더)
                          </h3>
                        </div>
                      </div>

                      {/* Instruction & Outstanding Tabs Selection Row */}
                      <div className="space-y-2">
                        <div className="text-[10px] text-slate-500 font-semibold font-sans tracking-wide">
                          조회할 대상 리더를 선택하세요
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {LEADER_PROFILES.filter(p => p.type === "outstanding").map((profile) => {
                            const isSelected = profile.id === selectedOutstandingId;
                            const activeClass = isSelected
                              ? "bg-teal-500/10 text-teal-400 font-bold border-teal-500/40 shadow-sm shadow-teal-950/20"
                              : "bg-[#0E1217]/40 text-slate-400 hover:bg-[#0E1217]/80 hover:text-slate-300 border-slate-800/80";
                            
                            const formattedLabel = `${profile.name} (${profile.dept.split(" / ")[0]})`;
                            return (
                              <button
                                key={profile.id}
                                onClick={() => setSelectedOutstandingId(profile.id)}
                                className={`px-3 py-1.5 rounded-lg border text-[11px] font-sans transition-all duration-200 cursor-pointer ${activeClass}`}
                              >
                                {formattedLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {(() => {
                        const leader = LEADER_PROFILES.find(p => p.id === selectedOutstandingId);
                        if (!leader) return null;
                        return (
                          <div className="space-y-4 bg-[#14181F]/40 rounded-xl p-4 animate-fadeIn">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800/60 pb-3">
                              <div>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-sm font-bold text-slate-100">{leader.name}</span>
                                  <span className="text-[11px] text-slate-455 font-normal">({leader.dept.split(" / ")[0]})</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11.5px] text-teal-400 font-bold font-mono">
                                  종합 {leader.overallScore}점
                                </span>
                              </div>
                            </div>

                            {/* Detailed Competency Scores & Bars */}
                            <div className="space-y-2.5 pb-1">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
                                {leader.scores.map((comp, idx) => {
                                  const scoreColor = "text-teal-400";
                                  const barColor = "bg-teal-500";
                                  return (
                                    <div key={idx} className="space-y-1 font-sans">
                                      <div className="flex justify-between items-center text-[10.5px]">
                                        <span className="text-slate-400 font-medium">{comp.subject}</span>
                                        <span className={`font-mono font-bold ${scoreColor}`}>
                                          {comp.score}점
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full bg-slate-850 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full ${barColor} transition-all duration-300`}
                                          style={{ width: `${comp.score * 10}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Diagnosis Opinion text segment */}
                            <div className="p-3 bg-[#0E1217]/60 rounded-xl border border-slate-800/80 font-sans">
                              <span className="text-[10px] font-bold text-teal-400 block mb-1">리더 분석 인사이트</span>
                              <p className="text-[11px] text-slate-350 leading-relaxed">
                                {leader.desc}
                              </p>
                            </div>

                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* 맞춤 리더십 보완 마일스톤 치료 교안 */}
                <div className="rounded-xl bg-[#14181F]/95 p-5 shadow-lg flex flex-col gap-4 font-sans">
                  <div className="flex items-center gap-1 border-b border-slate-800 pb-2">
                    <TrendingUp className="h-4 w-4 text-teal-400" />
                    <h4 className="text-xs font-bold text-white font-sans uppercase">
                      맞춤 리더십 보완 마일스톤 치료 교안
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Card 1 */}
                    <div className="p-4 bg-[#0E1217]/80 border border-slate-800 rounded-xl hover:border-rose-500/15 transition-all duration-300 flex flex-col justify-between gap-4 font-sans">
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                          <span className="text-xs font-bold text-rose-455 font-sans">[의무] 탑다운 권위 소통 시정 교육</span>
                          <span className="text-[9px] bg-rose-500/10 text-rose-455 px-1.5 py-0.5 rounded font-bold">권고 지수 최고</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">타겟 부족 세부 역량</div>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[9.5px] bg-[#1a1313] border border-rose-500/10 text-rose-400 px-2 py-0.5 rounded">심리적 안전감</span>
                            <span className="text-[9.5px] bg-[#1a1313] border border-rose-500/10 text-rose-400 px-2 py-0.5 rounded">경청과 공감</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-[10px] text-slate-455 font-bold">수강 필수 및 추천 대상 리더 (2명)</div>
                          <div className="space-y-2 bg-[#1a1313]/30 border border-slate-800 rounded-lg p-3">
                            <div className="border-b border-slate-800/40 pb-1.5 last:border-0 last:pb-0">
                              <p className="text-[11px] text-[#f8fafc] font-bold">1. 강석주 (프로덕트 디자인팀)</p>
                              <p className="text-[9.5px] text-slate-400 mt-0.5">지나친 마이크로매니징과 일방적 탑다운 지시성 소통 반복 조치 필요</p>
                            </div>
                            <div className="pt-1.5">
                              <p className="text-[11px] text-[#f8fafc] font-bold">2. 한장원 (개발사업본부)</p>
                              <p className="text-[9.5px] text-slate-400 mt-0.5">일방적 기획 통보 성향 검출로 부서 내 자율성 점수 최하 수치 검출</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="pt-3 border-t border-slate-855 bg-[#14181F]/40 p-2.5 rounded-lg border border-slate-800/80">
                          <span className="text-[10px] font-bold text-teal-400 block mb-1">추천 처방 교육 및 플랜</span>
                          <p className="text-[10px] text-slate-350 leading-relaxed font-sans">
                            의사결정 긴급 분산, 프로젝트 지휘권의 프로젝트 현업 조직 이양 모델 구축 교육 및 1:1 밀착 코칭.
                          </p>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg space-y-0.5">
                          <span className="text-[10px] font-bold text-teal-400 block">교육 이수 시 예상 효과</span>
                          <p className="text-[9.5px] text-slate-300 leading-normal">
                            핵심 이탈 위험군 잔류율 80% 개선 및 상향 피드백 수용성 45% 증가.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="p-4 bg-[#0E1217]/80 border border-slate-800 rounded-xl hover:border-amber-500/15 transition-all duration-300 flex flex-col justify-between gap-4 font-sans">
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                          <span className="text-xs font-bold text-amber-500 font-sans">[의무] 1on1 정렬 촉진 코칭</span>
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold">소통방임 취약</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">타겟 부족 세부 역량</div>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[9.5px] bg-[#1a1813] border border-amber-500/10 text-amber-300 px-2 py-0.5 rounded">현황 and 정렬</span>
                            <span className="text-[9.5px] bg-[#1a1813] border border-amber-500/10 text-amber-300 px-2 py-0.5 rounded">건설적 피드백</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-[10px] text-slate-455 font-bold">수강 필수 및 추천 대상 리더 (2명)</div>
                          <div className="space-y-2 bg-[#1a1813]/30 border border-slate-800 rounded-lg p-3">
                            <div className="border-b border-slate-800/40 pb-1.5 last:border-0 last:pb-0">
                              <p className="text-[11px] text-[#f8fafc] font-bold">1. 최무현 (플랫폼인프라팀)</p>
                              <p className="text-[9.5px] text-slate-400 mt-0.5">원온원 면담 불참률 80% 도달, 자원 배분 갈등 회피성 무대응 상태 누적</p>
                            </div>
                            <div className="pt-1.5">
                              <p className="text-[11px] text-[#f8fafc] font-bold">2. 박기태 (솔루션영업팀)</p>
                              <p className="text-[9.5px] text-slate-400 mt-0.5">영업 피로도에 따른 파트원 면담 일면 불참 및 전출 불만 장벽 우려</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="pt-3 border-t border-slate-855 bg-[#14181F]/40 p-2.5 rounded-lg border border-slate-800/80">
                          <span className="text-[10px] font-bold text-teal-400 block mb-1">추천 처방 교육 및 플랜</span>
                          <p className="text-[10px] text-slate-350 leading-relaxed font-sans">
                            역할(R&R) 가이드북 강제 보급, 주간 고정 원온원 정기 미팅 90% 이수율 주간 수치감사(Audit) 강행.
                          </p>
                        </div>
                        <div className="bg-[#111c14] border border-emerald-500/10 p-2.5 rounded-lg space-y-0.5">
                          <span className="text-[10px] font-bold text-teal-400 block pb-1">교육 이수 시 예상 효과</span>
                          <p className="text-[9.5px] text-slate-300 leading-normal font-sans">
                            소통 주기 회기성 310% 복구, 직무 R&R 합리화 만족도 및 협업 장애 최소화.
                          </p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* TAB 3: 소통 히트맵 (Communication Analytics) */}
            {activeTab === "comms" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  
                  {/* Left Column: Satisfaction Heatmap */}
                  <div className="rounded-xl border border-slate-800 bg-[#0E1217]/50 p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                          1on1 만족도 지표 (온도 및 정서 안전지수)
                        </h4>
                      </div>
                      
                      <div className="overflow-x-auto mt-2">
                        <table className="w-full table-fixed min-w-[340px]">
                          <thead>
                            <tr className="border-b border-slate-800/40 pb-1.5">
                              <th className="w-[30%] p-1.5 text-left text-[9.5px] text-slate-500 font-mono font-sans font-medium">부서 및 리더</th>
                              {["1on1 만족도", "업무 몰입도", "성장 만족도"].map((m, idx) => (
                                <th key={idx} className="w-[23.3%] p-1 text-center text-[9.5px] text-slate-400 font-bold font-sans">{m}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-855/40">
                            {HEATMAP_SATISFACTION_DATA.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-900/10 transition-all border-b border-slate-900/40">
                                <td className="p-2 py-2.5">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-200">{row.dept.replace("프로덕트 ", "")}</span>
                                    <span className="text-[9.5px] text-slate-500 mt-0.5 font-mono">{row.leader}</span>
                                  </div>
                                </td>
                                {row.metrics.map((m, mIdx) => {
                                  const score = m.score || 0;
                                  const isUnhealthy = score < 5.0;
                                  const isCaution = score >= 5.0 && score < 7.0;

                                  let bgStyle = "bg-emerald-500/5 text-emerald-450 border-emerald-500/15";
                                  if (isUnhealthy) {
                                    bgStyle = "bg-rose-500/10 text-rose-455 border-rose-500/20";
                                  } else if (isCaution) {
                                    bgStyle = "bg-amber-500/5 text-amber-400 border-amber-500/15";
                                  }

                                  const isSelected = selectedCell && 
                                                     selectedCell.dept === row.dept && 
                                                     selectedCell.metric === m.name && 
                                                     selectedCell.type === "satisfaction";

                                  if (isSelected) {
                                    bgStyle += " ring-2 ring-teal-500 border-teal-400 font-black";
                                  }

                                  return (
                                    <td key={mIdx} className="p-1 text-center">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedCell({
                                          dept: row.dept,
                                          leader: row.leader,
                                          metric: m.name,
                                          level: m.name,
                                          score: score,
                                          status: m.status,
                                          reason: m.reason,
                                          solution: m.solution,
                                          type: "satisfaction"
                                        })}
                                        className={`w-full py-3.5 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-slate-500 focus:outline-none ${bgStyle}`}
                                      >
                                        <span className="text-xs font-bold font-mono">{score.toFixed(1)}</span>
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <div className="p-3 bg-[#0B0F13]/40 border border-[#1e293b] rounded-lg text-[11px] text-slate-400 leading-normal font-sans font-medium">
                        <strong>만족도 지표 종합 분석 인사이트:</strong> 1on1 관계성 회복 중심의 인사이트입니다. 
                        <strong> AI개발팀</strong>은 리더의 개방적 질문 활용도로 만족도 <strong>8.5</strong>의 선순환 시너지를 구가 중이나, 
                        <strong> 프로덕트 디자인팀</strong>은 권위적 미팅 지휘 성향에 따라 만족도 <strong>3.2</strong>의 최저 위험에 봉착해 지시 성향 시정 개입이 극구 강권됩니다.
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Execution Heatmap */}
                  <div className="rounded-xl border border-slate-800 bg-[#0E1217]/50 p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                          1on1 실행 지표 (주기 및 태도 실천도)
                        </h4>
                      </div>
                      
                      <div className="overflow-x-auto mt-2">
                        <table className="w-full table-fixed min-w-[340px]">
                          <thead>
                            <tr className="border-b border-slate-800/40 pb-1.5">
                              <th className="w-[30%] p-1.5 text-left text-[9.5px] text-slate-500 font-mono font-sans font-medium">부서 및 리더</th>
                              {["주기 준수율", "미팅 지연율", "프렙 진행율"].map((m, idx) => (
                                <th key={idx} className="w-[23.3%] p-1 text-center text-[9.5px] text-slate-400 font-bold font-sans">{m}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-855/40">
                            {HEATMAP_EXECUTION_DATA.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-900/10 transition-all border-b border-slate-900/40">
                                <td className="p-2 py-2.5">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-200">{row.dept.replace("프로덕트 ", "")}</span>
                                    <span className="text-[9.5px] text-slate-500 mt-0.5 font-mono">{row.leader}</span>
                                  </div>
                                </td>
                                {row.metrics.map((m, mIdx) => {
                                  const rate = m.rate || 0;
                                  let bgStyle = "";
                                  if (m.name === "미팅 지연율") {
                                    const isUnhealthy = rate > 30;
                                    const isCaution = rate >= 15 && rate <= 30;
                                    if (isUnhealthy) {
                                      bgStyle = "bg-rose-500/10 text-rose-455 border-rose-500/20";
                                    } else if (isCaution) {
                                      bgStyle = "bg-amber-500/5 text-amber-400 border-amber-500/15";
                                    } else {
                                      bgStyle = "bg-emerald-500/5 text-emerald-450 border-emerald-500/15";
                                    }
                                  } else {
                                    const isUnhealthy = rate < 50;
                                    const isCaution = rate >= 50 && rate < 75;
                                    if (isUnhealthy) {
                                      bgStyle = "bg-rose-500/10 text-rose-455 border-rose-500/20";
                                    } else if (isCaution) {
                                      bgStyle = "bg-amber-500/5 text-amber-400 border-amber-500/15";
                                    } else {
                                      bgStyle = "bg-emerald-500/5 text-emerald-450 border-emerald-500/15";
                                    }
                                  }

                                  const isSelected = selectedCell && 
                                                     selectedCell.dept === row.dept && 
                                                     selectedCell.metric === m.name && 
                                                     selectedCell.type === "execution";

                                  if (isSelected) {
                                    bgStyle += " ring-2 ring-teal-500 border-teal-400 font-black";
                                  }

                                  return (
                                    <td key={mIdx} className="p-1 text-center">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedCell({
                                          dept: row.dept,
                                          leader: row.leader,
                                          metric: m.name,
                                          level: m.name,
                                          rate: rate,
                                          status: m.status,
                                          reason: m.reason,
                                          solution: m.solution,
                                          type: "execution"
                                        })}
                                        className={`w-full py-3.5 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-slate-500 focus:outline-none ${bgStyle}`}
                                      >
                                        <span className="text-xs font-bold font-mono">{rate}%</span>
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <div className="p-3 bg-[#0B0F13]/40 border border-[#1e293b] rounded-lg text-[11px] text-slate-400 leading-normal font-sans font-medium">
                        <strong>실행 지표 종합 분석 인사이트:</strong> 1on1 약속 이행 태도에 대한 인사이트입니다. 
                        <strong> 플랫폼인프라팀</strong>은 서버 장애 이슈 매몰에 기인하여 주기 준수율이 <strong>32%</strong>에 그쳐 만성적 심리방치가 심각하며, 
                        <strong> 그로스마케팅팀</strong>은 높은 이수 완성도(준수율 78%)를 기조로 실무 완결 협업을 건강하게 수호하고 있습니다.
                      </div>
                    </div>
                  </div>

                </div>

                {/* Team tabbed time-series trend widget */}
                <div className="rounded-xl border border-slate-800 bg-[#14181F]/90 p-5 shadow-lg space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-855 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-white font-sans uppercase tracking-wider flex items-center gap-2">
                        팀별 1on1 트렌드리서치 시계열 (만족도/몰입도)
                      </h3>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">선택한 특정 부서 장기 면담 온도를 통계 분석하여 추이를 진단합니다.</p>
                    </div>
                    
                    {/* Team selectors */}
                    <div className="flex flex-wrap gap-1.5">
                      {["AI개발팀", "프로덕트 디자인팀", "플랫폼인프라팀", "그로스마케팅팀"].map((tName) => (
                        <button
                          key={tName}
                          id={`timeseries-btn-${tName}`}
                          onClick={() => setSelectedTimeSeriesTeam(tName)}
                          className={`text-[10.5px] px-2.5 py-1 rounded-md font-sans font-bold transition-all cursor-pointer ${
                            selectedTimeSeriesTeam === tName
                              ? "bg-teal-500/20 text-teal-400 border border-teal-500/45 shadow"
                              : "bg-[#0E1217] text-slate-400 border border-slate-800 hover:text-slate-200"
                          }`}
                        >
                          {tName.replace("프로덕트 ", "")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Line Chart showing trends */}
                  <div className="h-[350px] w-full bg-[#0E1217]/35 rounded-lg p-2.5 border border-slate-855">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={TIME_SERIES_BY_TEAM[selectedTimeSeriesTeam] || []}
                        margin={{ top: 20, right: 15, left: -25, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={10} domain={[1, 10]} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#14181F', borderColor: '#334155', color: '#fff' }} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                        
                        <Line 
                          type="monotone" 
                          dataKey="satisfaction" 
                          name="1on1 만족도" 
                          stroke="#10b981" 
                          strokeWidth={2.5} 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="engagement" 
                          name="업무 몰입도" 
                          stroke="#3b82f6" 
                          strokeWidth={2.5} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="growth" 
                          name="성장 만족도" 
                          stroke="#f59e0b" 
                          strokeWidth={2.5} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Team-Specific Detail Insight Opinion Card */}
                  <div className="p-3 bg-[#0B0F13]/40 border border-[#1e293b] rounded-lg text-[11px] text-slate-350 leading-normal font-sans font-medium">
                    {selectedTimeSeriesTeam === "AI개발팀" && (
                      <p>
                        <strong>AI개발팀 분석 의견:</strong> 손민아 리더의 사려 깊은 대화 및 적극적 약속 이행으로 인해 1on1 만족도가 5월 기준 <strong>8.5</strong>로 극대화되었으며, 정서 안정 성과로 업무 몰입도가 동반 고점을 기록하는 선순환 구도를 구축하고 있습니다.
                      </p>
                    )}
                    {selectedTimeSeriesTeam === "프로덕트 디자인팀" && (
                      <p>
                        <strong>프로덕트 디자인팀 분석 의견:</strong> 권위적 소통 패턴 및 당일 약속 브레이킹이 누적되면서 만족도가 연초 5.5에서 5월 기준 <strong>3.2</strong>까지 연속 하락하였습니다. 추가적 하향 위험 차단을 위해 즉각적인 리더십 코칭 및 세션 태도 시정이 강권됩니다.
                      </p>
                    )}
                    {selectedTimeSeriesTeam === "플랫폼인프라팀" && (
                      <p>
                        <strong>플랫폼인프라팀 분석 의견:</strong> 시스템 정비 과부하로 면담 일정이 유예되는 상황에서 구성원들의 전반적 몰입 평점이 5월 기준 <strong>5.5</strong> 선으로 침체되어 있습니다. 주기 이행 및 주기 정기성 회복이 일차 과제입니다.
                      </p>
                    )}
                    {selectedTimeSeriesTeam === "그로스마케팅팀" && (
                      <p>
                        <strong>그로스마케팅팀 분석 의견:</strong> 성과 부하에 따른 피로도가 누적 제기되고 있으나, 활발한 의견 공유 및 양 방향 소통으로 만족도가 <strong>6.5</strong>대를 완만히 수호하고 있습니다.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            )}



            {/* TAB 4: 1on1 만족도 상세분석 */}
            {activeTab === "satisfaction" && (
              <div className="space-y-4 animate-fadeIn">


                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Left Column: Satisfaction Gap */}
                  <div className="rounded-xl border border-slate-800 bg-[#0E1217]/50 p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3.5">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                          <TrendingUp className="h-4 w-4 text-teal-400" />
                          소통 온도차 비대칭성 분석 (정치/밀착 격차)
                        </h4>
                        <span className="text-[10px] bg-rose-500/10 text-rose-450 px-2 py-0.5 rounded font-bold">
                          격차 위험 주의보
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mb-3 leading-relaxed">
                        리더가 부여한 원온원 자가 평가 대비, 구성원이 익명 체감한 밀착 정열도 격차 비대칭성 레이아웃입니다. 격차 폭이 <strong>0.8점 이상(🚨)</strong>인 경우 괴리 차단 인터벤션이 강권됩니다.
                      </p>

                      <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: "AI개발팀", leader: 8.2, member: 8.5 },
                              { name: "그로스마케팅팀", leader: 7.2, member: 6.5 },
                              { name: "플랫폼인프라팀", leader: 6.8, member: 5.5 },
                              { name: "프로덕트 디자인팀", leader: 6.5, member: 3.2 }
                            ]}
                            margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#223049" />
                            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                            <YAxis stroke="#2dd4bf" fontSize={10} domain={[0, 10]} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#14181F', borderColor: '#334155', color: '#fff' }} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Bar dataKey="leader" name="리더 자가평가" fill="#f59e0b" maxBarSize={30} />
                            <Bar dataKey="member" name="구성원 체감" fill="#14b8a6" maxBarSize={30} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="p-2.5 bg-[#0B0F13]/40 border border-[#1e293b] rounded-lg space-y-1">
                        <span className="text-[10px] font-bold text-rose-455 block flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                          소통 비대칭성 격차 경고 부서 (격차 0.8점 초과)
                        </span>
                        <div className="text-[10.5px] text-slate-350 font-sans space-y-1 font-medium leading-relaxed">
                          <p>• <strong>프로덕트 디자인팀</strong>: 소통 격차 <span className="text-rose-400 font-bold">3.3점</span> (심리적 통제 및 방임 극대화) 🚨</p>
                          <p>• <strong>플랫폼인프라팀</strong>: 소통 격차 <span className="text-rose-400 font-bold">1.7점</span> (소형 업무 위주 면담 피로도) 🚨</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Talk Ratio */}
                  <div className="rounded-xl border border-teal-500/15 bg-[#14181F] p-4 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3.5">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans">
                          <MessageSquare className="h-4 w-4 text-teal-400" />
                          1on1 대화 점유율 비율 (Talk Ratio Analysis)
                        </h4>
                        <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded font-bold">
                          리더 3 : 구성원 7 준칙
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mb-3 leading-relaxed">
                        STT 음성 필터링 기술 기반, 리더 및 구성원의 언어 발화 비중 분석 결과입니다. 오블릿 표준 원칙인 <strong>리더 30% : 구성원 70% 준수율</strong>이 높을수록 구성원의 자율 몰입 신뢰도가 최적으로 작용합니다.
                      </p>

                      <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={[
                              { name: "AI개발팀", leaderTalk: 28, memberTalk: 72 },
                              { name: "그로스마케팅팀", leaderTalk: 35, memberTalk: 65 },
                              { name: "플랫폼인프라팀", leaderTalk: 45, memberTalk: 55 },
                              { name: "프로덕트 디자인팀", leaderTalk: 68, memberTalk: 32 }
                            ]}
                            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#223049" />
                            <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} unit="%" />
                            <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} width={80} />
                            <Tooltip contentStyle={{ backgroundColor: '#14181F', borderColor: '#334155', color: '#fff' }} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Bar dataKey="leaderTalk" name="리더 발화량 (%)" stackId="talkStack" fill="#f43f5e" maxBarSize={20} />
                            <Bar dataKey="memberTalk" name="구성원 발화량 (%)" stackId="talkStack" fill="#14b8a6" maxBarSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-lg space-y-1">
                        <span className="text-[10px] font-bold text-teal-400 block flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-teal-400" />
                          발화량 표준 오차 준수 상태 및 솔루션 제언
                        </span>
                        <div className="text-[10.5px] text-slate-350 font-sans space-y-1 font-medium leading-relaxed">
                          <p>• <strong>경고 부서</strong>: <span className="text-rose-450 font-bold">프로덕트 디자인팀 (68%)</span>, 리더의 독점적 훈조 마찰 장벽 발생 🚨</p>
                          <p>• <strong>준수 우수</strong>: <span className="text-teal-400 font-bold">AI개발팀 (28%)</span>, 모범적인 경청 및 개방적 질문 활용 완벽 구현 🟢</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Moved & Replaced Satisfaction Trend Area Chart (Now showing Leader vs Member Satisfaction in a 50/50 Grid with Leader Anomaly List) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column: 시계열 만족도 */}
                  <div className="rounded-xl border border-teal-500/25 bg-[#14181F] p-4 shadow-lg flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3.5 border-b border-slate-800 pb-2 font-sans">
                        <TrendingUp className="h-4 w-4 text-teal-400" />
                        리더 및 구성원 1on1 만족도 시계열
                      </h3>
                      <div className="h-[360px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              { name: "1월", "리더 만족도": 7.5, "구성원 만족도": 7.4 },
                              { name: "2월", "리더 만족도": 7.6, "구성원 만족도": 7.2 },
                              { name: "3월", "리더 만족도": 7.4, "구성원 만족도": 6.5 },
                              { name: "4월", "리더 만족도": 7.1, "구성원 만족도": 5.8 },
                              { name: "5월", "리더 만족도": 7.2, "구성원 만족도": 5.4 }
                            ]}
                            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorLeaderSat" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorMemberSat" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#223049" />
                            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                            <YAxis stroke="#2dd4bf" fontSize={10} domain={[3, 10]} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#14181F', borderColor: '#334155', color: '#fff' }} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Area type="monotone" dataKey="리더 만족도" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLeaderSat)" strokeWidth={2.5} />
                            <Area type="monotone" dataKey="구성원 만족도" stroke="#14b8a6" fillOpacity={1} fill="url(#colorMemberSat)" strokeWidth={2.5} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <p className="text-[10.5px] text-slate-350 leading-normal mt-4 bg-[#0B0F13]/40 p-2.5 rounded border border-slate-850 font-sans">
                      <strong>시계열 만족도 분석 소견:</strong> 5월로 갈수록 <strong>리더 만족도(Amber)</strong> 대비 <strong>구성원 만족도(Teal)</strong> 하락으로 온도차가 <strong>1.8점</strong>까지 벌어졌으며, 조속한 개입이 권고됩니다.
                    </p>
                  </div>

                  {/* Right Column: 원온원 비정상 신호 감지 리더 리스트 */}
                  <div className="rounded-xl border border-slate-800 bg-[#14181F] p-4 shadow-lg flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3.5 border-b border-slate-800 pb-2 font-sans">
                        <Users className="h-4 w-4 text-rose-500" />
                        비정상 신호 감지 리더 (격차/발화 불량)
                      </h3>
                      <p className="text-[11px] text-slate-400 font-sans mb-3 leading-relaxed">
                        익명 1on1 만족도 격차가 너무 크거나 발화 비율 불균형(리더 독점) 또는 면담 불참 과도로 경고등이 켜진 관리 리더 명단입니다.
                      </p>

                      <div className="space-y-3">
                        {/* Leader 1 */}
                        <div className="p-3 bg-[#0E1217] rounded-lg border border-rose-500/10 hover:border-rose-500/25 transition-all">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xs font-bold text-slate-200">강석주</span>
                              <span className="text-[9px] text-slate-500">프로덕트 디자인팀</span>
                            </div>
                            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded border bg-rose-500/10 text-rose-450 border-rose-500/20">
                              위험 경고
                            </span>
                          </div>
                          
                          {/* Core Stats */}
                          <div className="grid grid-cols-2 gap-3 text-[10px] bg-[#14181F]/40 p-2 rounded border border-slate-800">
                            <div>
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-slate-500">소통 격차</span>
                                <span className="text-rose-400 font-bold">3.3점 (심각)</span>
                              </div>
                              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500" style={{ width: '85%' }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-slate-500">리더 발화율</span>
                                <span className="text-rose-400 font-bold">68% (독점)</span>
                              </div>
                              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400" style={{ width: '68%' }} />
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal mt-1.5">
                            ※ 일방향 지시 빈도가 지나치게 높아 자율성 무력화 및 핵심 시니어 이탈 위험 유발.
                          </p>
                        </div>

                        {/* Leader 2 */}
                        <div className="p-3 bg-[#0E1217] rounded-lg border border-amber-500/10 hover:border-amber-500/25 transition-all">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xs font-bold text-slate-200">최무현</span>
                              <span className="text-[9px] text-slate-500">플랫폼인프라팀</span>
                            </div>
                            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/20">
                              모니터링
                            </span>
                          </div>
                          
                          {/* Core Stats */}
                          <div className="grid grid-cols-2 gap-3 text-[10px] bg-[#14181F]/40 p-2 rounded border border-slate-800">
                            <div>
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-slate-500">소통 격차</span>
                                <span className="text-amber-400 font-bold">1.3점 (주의)</span>
                              </div>
                              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: '55%' }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-slate-500">면담 불참률</span>
                                <span className="text-amber-400 font-bold">80% (해태)</span>
                              </div>
                              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400" style={{ width: '80%' }} />
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal mt-1.5">
                            ※ 원온원 미이행 등 약속 이행 장애로 팀 피로도 유발 및 만족도 우하향 양상 지속.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-rose-500/5 border border-rose-500/10 p-2 rounded-lg space-y-0.5 mt-4">
                      <span className="text-[10px] font-bold text-rose-400 block flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" />
                        권고 조치 사항
                      </span>
                      <p className="text-[9.5px] text-slate-400 leading-normal font-sans font-medium">
                        소통 위험 대상 리더군에게는 소통 개선 세션 의무 참여 및 주간 정기 면담 수립 현황 점검 조치가 수립됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#14181F] p-4 font-sans">
                  <h4 className="text-xs font-bold text-slate-200 mb-2.5">전사 1on1 주요 감정 키워드 비율</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-[#0E1217] rounded-lg border border-slate-800">
                      <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">✔ 면담 긍정 반응</div>
                      <p className="text-[10px] text-slate-500">"경청 태도 성설, 든든한 경업 수용, 정기 진행" 부문 82% 지지율.</p>
                    </div>
                    <div className="p-3 bg-[#0E1217] rounded-lg border border-slate-800">
                      <div className="text-rose-400 font-bold mb-1 flex items-center gap-1">⚠ 면담 불만 감정</div>
                      <p className="text-[10px] text-slate-500">"형식적 체크인, 약속 조치 미행, 긴축 통보 위주" 부문 58% 검출.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: 병목 (Friction & Process Bottleneck) */}
            {activeTab === "bottleneck" && (() => {
              const bottleneckData = [
                {
                  id: "ai-dev",
                  deptName: "AI개발팀",
                  bottleneckScore: 92,
                  status: "심각",
                  statusColor: "text-rose-400 border-rose-500/20 bg-rose-500/5",
                  severity: "Critical",
                  gaugeColor: "bg-rose-500",
                  summary: "핵심 기술 독점 및 백업 엔지니어 부재로 인한 상용화 빌드 중단 리스크",
                  scriptQuote: "Core 초경량 LLM 상용화 빌드 지식을 저 혼자만 쥐고 있어서 연차조차 내기 불안합니다. 주간 특근이 4주 연속 이어지다 보니 정신적 한계에 달해 이직을 알아봐야 하나 고민이 깊어집니다. (1on1 면담 기록 중)",
                  emotions: [
                    { label: "직무 Burnout", value: 48, color: "bg-rose-500" },
                    { label: "일정 압박감", value: 37, color: "bg-amber-500" },
                    { label: "성취 및 안도", value: 15, color: "bg-slate-700" }
                  ],
                  targetPerson: "박성준 (AI개발팀)",
                  targetLeader: "배우진 (AI개발팀 리더 / 부장)",
                  actionPlans: [
                    "AI개발팀 파트원들과의 [일일 핵심 엔진 지식 전수 세션 및 코드 오너십 분배 일정]을 6월 내로 의무적으로 수립 및 실행하십시오.",
                    "단일 수석 엔진 개발자에게 과도화된 특근을 분산하기 위해 백업 서브 리드 엔지니어를 전면 배정하고, 마일스톤 완료 가이드 라인 준수 데드라인을 주간 단위로 완충 조정하십시오.",
                    "박성준 (AI개발팀) 수석에 대한 정기적인 번아웃 피로 회복 휴가 지급 및 연장 근로에 대한 즉해적 성과 보상을 즉각 집행하십시오."
                  ]
                },
                {
                  id: "design",
                  deptName: "프로덕트 디자인팀",
                  bottleneckScore: 78,
                  status: "경고",
                  statusColor: "text-amber-400 border-amber-500/25 bg-amber-500/5",
                  severity: "Warning",
                  gaugeColor: "bg-amber-500",
                  summary: "상위 리더의 의사결정 전결 독점에 따른 실무 디자인 자율성 저하 및 동선 승인 지연",
                  scriptQuote: "의사결정 제재가 전부 탑다운 위주로만 떨어지다 보니, 주니어뿐 아니라 시니어인 저마저도 '말해봐야 어차피 팀장 안대로 될 것'이라는 무기력이 생깁니다. 결제 UX 시안이 3주째 컨펌 대기로 멈춰 있네요. (1on1 면담 기록 중)",
                  emotions: [
                    { label: "주도성 침해", value: 52, color: "bg-amber-500" },
                    { label: "업무 지연 피로", value: 33, color: "bg-rose-500" },
                    { label: "안정적 정조", value: 15, color: "bg-slate-700" }
                  ],
                  targetPerson: "최윤서 (프로덕트 디자인팀)",
                  targetLeader: "강석주 (프로덕트 디자인팀 리더 / 팀장)",
                  actionPlans: [
                    "신규 서비스 결제 동선 UX 개편안 전결 기획 의사결정권을 최윤서 (프로덕트 디자인팀) 시니어 디자이너 라인으로 대폭 하향 위임하십시오.",
                    "강석주 (프로덕트 디자인팀) 팀장은 탑다운 가이드 지시를 중단하고 '방향성 싱크' 위주로 코칭을 축소하고, 마찰을 방지하는 조력자 R&R로 리더십 태스크를 전환해 주십시오.",
                    "팀 내에 주간 단위로 아이디어를 자율 발표하는 '디자인 세션 자율 이니셔티브'를 가동해 구성원들의 저하된 창의적 에너지를 긴급 정상화하십시오."
                  ]
                },
                {
                  id: "infra",
                  deptName: "플랫폼인프라팀",
                  bottleneckScore: 65,
                  status: "주의",
                  statusColor: "text-cyan-400 border-cyan-500/25 bg-cyan-500/5",
                  severity: "Caution",
                  gaugeColor: "bg-cyan-500",
                  summary: "숙련된 플랫폼 클라우드 인프라 엔지니어의 단순 반복 엑셀 정산 지원 매몰 및 직종 정체성 소실",
                  scriptQuote: "서버 분산이나 신규 인프라 자동화 작업에 몰입해야 하는데, 매 달 마케팅/영업부서 요청용 엑셀 손수 정합성 검증 및 전산 대행에만 리소스의 절반 이상을 소모하고 있어요. 성장의 벽을 느껴서 장기 커리어에 심각한 의문이 듭니다. (1on1 면담 기록 중)",
                  emotions: [
                    { label: "커리어 회의감", value: 55, color: "bg-cyan-500" },
                    { label: "단순 반복 피로", value: 30, color: "bg-amber-500" },
                    { label: "실무 몰입도", value: 15, color: "bg-slate-700" }
                  ],
                  targetPerson: "정지원 (플랫폼인프라팀)",
                  targetLeader: "최무현 (플랫폼인프라팀 리더 / 팀장)",
                  actionPlans: [
                    "현업 부서들이 요청해 온 수동 데이터 정산 프로세스를 직접 '정산 자동화 배치 시스템 구비'라는 고부가가치 개발 프로젝트로 전환하고, 정지원 (플랫폼인프라팀) 엔지니어를 해당 프로젝트의 리드로 오너십을 정렬하십시오.",
                    "단순 엑셀 및 데이터 지표 추출 노동은 운영 사무 담당 혹은 타 임시 파트로 공식 이관하여 전문 엔지니어링 리소스를 인프라 설계 본업에 75% 이상 보장해야 합니다.",
                    "최무현 (플랫폼인프라팀) 팀장은 기술 커리어 로드맵을 설계 조율하는 원온원 정기 미팅 주기를 정상 회귀시켜, 정지원 (플랫폼인프라팀) 엔지니어가 비전을 수립하도록 소통 지지 하십시오."
                  ]
                },
                {
                  id: "marketing",
                  deptName: "그로스마케팅팀",
                  bottleneckScore: 61,
                  status: "양호",
                  statusColor: "text-teal-400 border-teal-500/25 bg-teal-500/5",
                  severity: "Optimal",
                  gaugeColor: "bg-teal-500",
                  summary: "광고 매체사 정책 및 실시간 알고리즘 빠른 변동 대비 예산 탄력 집행 결재 지연",
                  scriptQuote: "글로벌 마케팅 지면 알고리즘이 크게 변동될 때 CPC 단가를 즉시 부스팅해야 골든 타임을 잡는데, 팀장-본부장급 승인 절차가 하루 이상 대기 상태로 유지되어 매번 광고 투입 효율성을 대폭 상실하는 것이 너무 답답합니다. (1on1 면담 기록 중)",
                  emotions: [
                    { label: "프로세스 답답함", value: 45, color: "bg-teal-500" },
                    { label: "성과 달성 불안", value: 35, color: "bg-orange-500" },
                    { label: "조직 얼라인먼트", value: 20, color: "bg-slate-700" }
                  ],
                  targetPerson: "이지혜 (그로스마케팅팀)",
                  targetLeader: "안태호 (그로스마케팅팀 리더 / 팀장)",
                  actionPlans: [
                    "주간 마케팅 매체 변동 대응 목적으로 총 팀 예산의 전결 20% 범위를 이지혜 (그로스마케팅팀) 담당자가 단독 기동 및 실시간 부스팅 가능하도록 결제 패스트트랙 규정을 정비하십시오.",
                    "안태호 (그로스마케팅팀) 팀장은 글로벌 매체 단가 트렌드 리뷰 테이블을 상설 운영하여, 마케터의 주도성을 지지하고 성과에 피드백을 기민하게 제공함으로써 불안을 소거하십시오.",
                    "광고 매체의 기술적 업데이트를 즉각 테스트해 볼 수 있도록 저위험 소액 실험 마케팅 샌드박스 예산을 추가 설정해 퍼포먼스 창출 기조를 유지하십시오."
                  ]
                }
              ];

              const filteredData = selectedBottleneckDept === "all"
                ? bottleneckData
                : bottleneckData.filter(d => d.id === selectedBottleneckDept);

              const activeMetrics = {
                all: {
                  deptCount: "4개 탐지",
                  deptList: "AI개발, 디자인, 인프라, 마케팅",
                  maxDept: "92%",
                  maxDeptName: "AI개발팀 (기술 독점 리스크 1순위)",
                  primaryObstacle: "R&R 불균형 및 번아웃",
                  primaryObstacleSub: "특근 연장 피로 단어 집출 누적",
                  solution: "실무 전결권 하향 분산",
                  solutionSub: "신속 승인으로 피로 장벽 감소"
                },
                "ai-dev": {
                  deptCount: "AI개발팀",
                  deptList: "핵심 개발 리소스 부재",
                  maxDept: "92%",
                  maxDeptName: "심각 (Critical)",
                  primaryObstacle: "번아웃 및 일정 압박",
                  primaryObstacleSub: "박성준 수석 특근 집중화",
                  solution: "지식 전수 & 특근 완충",
                  solutionSub: "코드 오너십 분배 세션 기동"
                },
                design: {
                  deptCount: "프로덕트 디자인팀",
                  deptList: "전결 독점 & 권한 병목",
                  maxDept: "78%",
                  maxDeptName: "경고 (Warning)",
                  primaryObstacle: "자율성 저하 및 무기력",
                  primaryObstacleSub: "결제 UX 시안 3주째 지연",
                  solution: "의사결정권 하향 위임",
                  solutionSub: "최윤서 디자이너 전결권 확대"
                },
                infra: {
                  deptCount: "플랫폼인프라팀",
                  deptList: "수동 엑셀 정산 R&R 병목",
                  maxDept: "65%",
                  maxDeptName: "주의 (Caution)",
                  primaryObstacle: "단순 복사 노동 매몰",
                  primaryObstacleSub: "인프라 엔지니어 기동상실",
                  solution: "정산 자동화 개발 전환",
                  solutionSub: "자동화 배치 신규 프로젝트화"
                },
                marketing: {
                  deptCount: "그로스마케팅팀",
                  deptList: "글로벌 매체대응 의사결정",
                  maxDept: "61%",
                  maxDeptName: "주의 (Caution)",
                  primaryObstacle: "CPC 부스팅 승인 대기",
                  primaryObstacleSub: "광고 투입 골든타임 소실",
                  solution: "20% 단독 전결 집행",
                  solutionSub: "마케팅 샌드박스 패스트트랙"
                }
              }[selectedBottleneckDept] || {
                deptCount: "4개 탐지",
                deptList: "AI개발, 디자인, 인프라, 마케팅",
                maxDept: "92%",
                maxDeptName: "AI개발팀 (기술 독점 리스크 1순위)",
                primaryObstacle: "R&R 불균형 및 번아웃",
                primaryObstacleSub: "특근 연장 피로 단어 집출 누적",
                solution: "실무 전결권 하향 분산",
                solutionSub: "신속 승인으로 피로 장벽 감소"
              };

              const wordCloudWords = [
                { text: "리소스 부족", weight: 10, color: "from-rose-500 to-red-400 text-rose-400", depts: ["ai-dev", "infra"], percentage: 84 },
                { text: "타 부서 협업 갈등", weight: 9, color: "from-amber-500 to-orange-400 text-amber-400", depts: ["marketing", "design"], percentage: 76 },
                { text: "보수적 규정", weight: 8, color: "from-blue-500 to-indigo-400 text-blue-400", depts: ["design", "infra"], percentage: 65 },
                { text: "의사결정 지연", weight: 8, color: "from-purple-500 to-pink-400 text-purple-400", depts: ["design"], percentage: 72 },
                { text: "불명확한 R&R", weight: 7, color: "from-cyan-500 to-teal-400 text-teal-400", depts: ["marketing", "infra"], percentage: 59 },
                { text: "단순 전사 반복", weight: 6, color: "from-emerald-500 to-teal-400 text-emerald-400", depts: ["infra"], percentage: 52 },
                { text: "피드백 부재", weight: 6, color: "from-yellow-500 to-amber-400 text-yellow-405", depts: ["ai-dev", "marketing"], percentage: 48 }
              ];

              const filteredWords = selectedBottleneckDept === "all"
                ? wordCloudWords
                : wordCloudWords.filter(w => w.depts.includes(selectedBottleneckDept));

              return (
                <div className="space-y-4 animate-fadeIn font-sans">

                  {/* 1. Interactive Department Filter Row (At the Very Top) */}
                  <div className="bg-[#14181F]/95 rounded-xl border border-slate-800/80 p-4 shadow-md">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-4 w-4 text-teal-450 animate-pulse" />
                        <span className="text-xs font-bold text-slate-200">부서별 병목 진단 인덱스 (Department Roadblock Index)</span>
                      </div>
                      <span className="text-[9.5px] text-slate-500 font-medium">부서를 선택하면 해당 관점의 장애 분석과 처방 리포트가 실시간 동형화됩니다.</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[
                        { id: "all", label: "전체 부서 보기", count: 4, labelSub: "종합 진단", color: "text-teal-400", borderStyle: "border-teal-500/10" },
                        { id: "ai-dev", label: "AI개발팀", count: 92, labelSub: "심각", color: "text-rose-455", borderStyle: "border-rose-500/20 hover:border-rose-500/40" },
                        { id: "design", label: "프로덕트 디자인팀", count: 78, labelSub: "경고", color: "text-amber-400", borderStyle: "border-amber-500/20 hover:border-amber-500/40" },
                        { id: "infra", label: "플랫폼인프라팀", count: 65, labelSub: "주의", color: "text-cyan-400", borderStyle: "border-cyan-500/20 hover:border-cyan-500/40" },
                        { id: "marketing", label: "그로스마케팅팀", count: 61, labelSub: "양호", color: "text-teal-450", borderStyle: "border-teal-500/20 hover:border-teal-500/40" }
                      ].map((btn) => {
                        const isSelected = selectedBottleneckDept === btn.id;
                        const scoreStr = btn.id === "all" ? "ALL" : `${btn.count}%`;
                        const activeStyle = isSelected
                          ? "bg-slate-800/50 border-teal-450/70 text-teal-450 font-bold shadow-md shadow-slate-900/60"
                          : `bg-[#0E1217]/50 ${btn.borderStyle || "border-slate-800/60"} text-slate-400 hover:bg-[#0E1217]/80 hover:text-slate-350`;

                        return (
                          <button
                            key={btn.id}
                            onClick={() => setSelectedBottleneckDept(btn.id)}
                            className={`p-2.5 rounded-lg border text-left flex flex-col justify-between gap-1.5 transition-all duration-200 cursor-pointer ${activeStyle}`}
                          >
                            <span className="text-[11px] font-semibold truncate leading-tight">{btn.label}</span>
                            <div className="flex items-center justify-between gap-1 mt-0.5">
                              <span className="text-[9.5px] text-slate-500 leading-none">{btn.labelSub}</span>
                              <span className={`text-[10px] font-bold font-mono leading-none ${isSelected ? "text-teal-450" : btn.color || "text-slate-400"}`}>
                                {scoreStr}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Dynamic Summary Metrics Bar (Reacting to the selected index) */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#0E1217]/50 border border-slate-800/80 p-4 rounded-xl">
                    <div className="p-3.5 bg-[#14181F]/80 rounded-lg border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">진단 부서 필터</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-sm font-bold text-white truncate max-w-full">{activeMetrics.deptCount}</span>
                      </div>
                      <p className="text-[10.5px] text-teal-400 mt-1 font-medium leading-tight truncate">{activeMetrics.deptList}</p>
                    </div>

                    <div className="p-3.5 bg-[#14181F]/80 rounded-lg border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">최대 병목 심각도</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xl font-bold text-rose-455 font-mono">{activeMetrics.maxDept}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-1 font-medium leading-tight truncate">{activeMetrics.maxDeptName}</p>
                    </div>

                    <div className="p-3.5 bg-[#14181F]/80 rounded-lg border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">검출 최고 장애요인</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xs font-bold text-slate-200 truncate">{activeMetrics.primaryObstacle}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-1 font-medium leading-tight truncate">{activeMetrics.primaryObstacleSub}</p>
                    </div>

                    <div className="p-3.5 bg-[#14181F]/80 rounded-lg border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">대표 권장 솔루션</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xs font-bold text-teal-450 truncate">{activeMetrics.solution}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-1 font-medium leading-tight truncate">{activeMetrics.solutionSub}</p>
                    </div>
                  </div>

                  {/* 3. Combined Interactive Content Area (Left: Reactive Word Cloud, Right: Real Diagnosis Reports) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    
                    {/* Left: Reactive Word Cloud */}
                    <div className="lg:col-span-12 xl:col-span-5 bg-[#14181F] p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-350 font-sans tracking-wide uppercase flex items-center gap-1.5 mb-2.5">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                          장애물 키워드 클라우드 (Roadblock Keywords)
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal mb-5">
                          1on1 면담 대화 스크립트에서 실시간 NLP 모델링으로 추출한 직무 성장 저해 및 조직 병목 키워드입니다. 키워드가 크고 붉을수록 심도 있는 개입 수치가 시급함을 조명합니다.
                          <br className="mb-1" />
                          <span className="text-teal-400 font-semibold">키워드를 클릭</span>하면 즉각 관련 부서 인덱스로 전환되며 상세 보고서를 분석할 수 있습니다.
                        </p>

                        <div className="p-5 bg-[#0E1217]/60 rounded-xl border border-slate-850 min-h-[220px] flex flex-wrap items-center justify-center gap-3 select-none">
                          {filteredWords.map((word) => {
                            let sizeClass = "text-xs";
                            if (word.weight >= 10) sizeClass = "text-base md:text-xl font-black";
                            else if (word.weight >= 9) sizeClass = "text-sm md:text-md font-extrabold";
                            else if (word.weight >= 8) sizeClass = "text-xs md:text-sm font-bold";
                            else sizeClass = "text-[10.5px] md:text-xs font-semibold";

                            return (
                              <button
                                key={word.text}
                                type="button"
                                onClick={() => {
                                  // Click filters to its primary dept matching or the first dept
                                  const targetDept = word.depts.includes(selectedBottleneckDept) ? selectedBottleneckDept : word.depts[0];
                                  if (targetDept && targetDept !== "all") {
                                    setSelectedBottleneckDept(targetDept);
                                  }
                                }}
                                className="px-3 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-all duration-200 cursor-pointer flex items-center gap-2 transform hover:scale-102"
                              >
                                <span className={`${sizeClass} bg-gradient-to-r ${word.color} bg-clip-text text-transparent`}>
                                  {word.text}
                                </span>
                                <span className="text-[9.5px] font-mono text-slate-500 bg-[#0E1217] px-1 rounded border border-slate-800">
                                  {word.percentage}%
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9.5px] text-slate-550 border-t border-slate-800/55 pt-3">
                        <span>자연어 처리(NLP) 결합분석 • 오차범위 ±4.2%</span>
                        <span className="text-teal-450 font-bold flex items-center gap-1">
                          <Activity className="h-3 w-3 text-rose-500 animate-pulse" />
                          가장 높은 병목 키워드: 리소스 부족 (84%)
                        </span>
                      </div>
                    </div>

                    {/* Right: Real Bottleneck Diagnosis Reports (Replacing the obsolete simple word detail) */}
                    <div className="lg:col-span-12 xl:col-span-7 flex flex-col">
                      {selectedBottleneckDept === "all" ? (
                        <div className="space-y-3.5 flex flex-col">
                          <div className="flex items-center justify-between bg-[#14181F] p-3 px-4 rounded-xl border border-slate-800">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <ShieldAlert className="h-4 w-4 text-rose-500" />
                              종합 전사 병목 진단 리포트 (All Reports)
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">총 4개 부서 분석 중</span>
                          </div>

                          <div className="max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                            {bottleneckData.map((dept) => (
                              <div key={dept.id} className="p-4 bg-[#14181F]/90 rounded-xl border border-slate-800 relative overflow-hidden transition-all duration-200 hover:border-slate-700/80">
                                <div className={`absolute top-0 left-0 w-[4px] h-full ${dept.gaugeColor}`} />
                                <div className="pl-2.5 space-y-3">
                                  <div className="flex items-start justify-between gap-1">
                                    <div>
                                      <span className="text-[11.5px] font-bold text-slate-100 flex items-center gap-1">
                                        {dept.deptName} 리포트
                                      </span>
                                      <p className="text-[11px] text-[#fbbf24] font-medium leading-snug mt-0.5">{dept.summary}</p>
                                    </div>
                                    <span className={`text-[9.5px] font-bold px-1.5 py-0.5 leading-none shrink-0 rounded border ${dept.statusColor}`}>{dept.status} {dept.severity}</span>
                                  </div>

                                  <div className="text-[10.5px] text-slate-350 bg-[#0E1217]/60 p-2.5 rounded border border-slate-800/80 italic leading-relaxed">
                                    "{dept.scriptQuote}"
                                  </div>

                                  <div className="flex flex-col sm:flex-row gap-2 text-[10.5px] bg-[#0E1217]/40 p-2 rounded border border-slate-800/50">
                                    <div className="flex-1">
                                      <span className="text-slate-500 block text-[9.5px]">실무 조치 대상자</span>
                                      <span className="font-bold text-slate-200">{dept.targetPerson}</span>
                                    </div>
                                    <div className="flex-1 border-t sm:border-t-0 sm:border-l border-slate-800/60 pt-1 sm:pt-0 sm:pl-2">
                                      <span className="text-slate-500 block text-[9.5px]">소관 관리 리더</span>
                                      <span className="font-bold text-teal-400">{dept.targetLeader}</span>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5 bg-[#0E1217]/20 p-2 rounded border border-slate-850/30">
                                    <span className="text-[9.5px] font-bold text-teal-400 block">• 임원 권장 행동 지침</span>
                                    {dept.actionPlans.map((plan, idx) => (
                                      <p key={idx} className="text-[10.5px] text-slate-350 leading-relaxed pl-1.5 border-l border-teal-500/10 mb-0.5 last:mb-0">
                                        {plan}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#14181F] p-5 rounded-xl border border-slate-800 flex flex-col justify-between flex-1 min-h-[460px]">
                          {(() => {
                            const dept = bottleneckData.find(d => d.id === selectedBottleneckDept);
                            if (!dept) return null;
                            return (
                              <div className="space-y-4 flex flex-col h-full justify-between">
                                <div className="space-y-3.5">
                                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                                    <h4 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                                      <span className={`w-2 h-2 rounded-full ${dept.gaugeColor} animate-pulse`} />
                                      {dept.deptName} 심층 병목 진단 리포트
                                    </h4>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${dept.statusColor}`}>
                                      {dept.status} • {dept.severity} (진택인덱스 {dept.bottleneckScore}%)
                                    </span>
                                  </div>

                                  <div>
                                    <span className="text-[9.5px] font-bold text-slate-500 block uppercase tracking-wide">성장 가치 사슬 장애 핵심 요약</span>
                                    <p className="text-xs font-bold text-[#fbbf24] mt-0.5 leading-snug">
                                      {dept.summary}
                                    </p>
                                  </div>

                                  <div>
                                    <span className="text-[9.5px] font-mono text-slate-400 block uppercase tracking-wide flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3 text-teal-450" />
                                      1on1 면담 추출 리얼 발췌문
                                    </span>
                                    <blockquote className="text-[11px] text-slate-300 italic mt-0.5 bg-[#0E1217]/70 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                                      "{dept.scriptQuote}"
                                    </blockquote>
                                  </div>

                                  {/* Major Qualitative Emotions */}
                                  <div className="space-y-1.5 border-t border-slate-800/50 pt-3">
                                    <span className="text-[9.5px] font-bold text-slate-500 uppercase block tracking-wider">면담 자연어 감정 지표 판정 비율</span>
                                    <div className="grid grid-cols-3 gap-2">
                                      {dept.emotions.map((emo, idx) => (
                                        <div key={idx} className="bg-[#0E1217]/50 p-2 rounded border border-slate-850">
                                          <div className="flex justify-between text-[9.5px] text-slate-400 mb-1">
                                            <span className="truncate">{emo.label}</span>
                                            <span className="font-mono font-bold text-slate-300">{emo.value}%</span>
                                          </div>
                                          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${emo.color}`} style={{ width: `${emo.value}%` }} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Action Plan Personnel Info */}
                                  <div className="flex flex-col sm:flex-row gap-2 bg-[#0E1217]/50 p-2.5 rounded-lg border border-slate-800 text-[10.5px]">
                                    <div className="flex-1 space-y-0.5">
                                      <span className="text-[9px] text-slate-500 font-bold block">조치 수혜 대상자</span>
                                      <p className="font-bold text-slate-200 flex items-center gap-1">
                                        <UserCheck className="h-3.5 w-3.5 text-rose-500" />
                                        {dept.targetPerson}
                                      </p>
                                    </div>
                                    <div className="border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-1 sm:pt-0 sm:pl-3 space-y-0.5 flex-1">
                                      <span className="text-[9px] text-slate-500 font-bold block">면담 관리 배속 리더</span>
                                      <p className="font-bold text-teal-400 flex items-center gap-1">
                                        <Layers className="h-3.5 w-3.5 text-teal-500" />
                                        {dept.targetLeader}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Recommendation Instructions */}
                                <div className="p-3.5 bg-teal-500/5 rounded-lg border border-teal-500/15 space-y-2">
                                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle className="h-3.5 w-3.5 text-teal-450" />
                                    조직 리더십 핵심 실행 권장 처방
                                  </span>
                                  <div className="space-y-1.5">
                                    {dept.actionPlans.map((plan, idx) => (
                                      <p key={idx} className="text-[10.5px] text-slate-300 leading-relaxed pl-1.5 border-l border-teal-500/20">
                                        • {plan}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })()}

          </div>

          {/* Right Exec Detail Diagnostic Panel (5 Cols on Desktop) - Only rendered under risk tab */}
          {activeTab === "risk" && (
            <div className="lg:col-span-5 h-[calc(100vh-180px)] lg:sticky lg:top-[128px]">
              <EmployeeDetailPanel 
                employee={selectedEmployee} 
                onClose={() => setSelectedEmployeeId(null)}
                employees={employees}
                onSelectEmployee={setSelectedEmployeeId}
                onUpdateEmployeeRisk={handleUpdateEmployeeRisk}
              />
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
