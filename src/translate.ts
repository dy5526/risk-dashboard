/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmployeeAnalysis, RedFlag, RiskHistoryItem } from "./types";

export interface LeaderProfile {
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

export interface HeatMapMetric {
  name: string;
  score?: number;
  rate?: number;
  status: string;
  reason: string;
  solution: string;
}

export interface HeatMapRow {
  dept: string;
  leader: string;
  metrics: HeatMapMetric[];
}

// Simple name translations - using classic Western English names for English mode
export const translateName = (name: string): string => {
  const map: Record<string, string> = {
    "박성준": "John",
    "최윤서": "Chloe",
    "정지원": "David",
    "한소희": "Sophia",
    "이지아": "Jane",
    "김윤아": "Emily",
    "신동현": "Daniel",
    "백지아": "Grace",
    "오세윤": "Sam",
    "강성우": "Alex",
    "강석주": "Steve",
    "최무현": "Mark",
    "손민아": "Mina",
    "이혜성": "Chris",
    "김동영 (인사혁신팀)": "Harry (HR)",
    "김동영": "Harry",
    "한장원": "Kevin",
    "박기태": "James",
    "배우진": "Andrew",
    "이지혜": "Lily",
    "안태호": "Tom",
    "AI 분석 시스템": "AI Analysis System",
    "관리자": "Administrator"
  };
  return map[name] || name;
};

// Department translations
export const translateDept = (dept: string): string => {
  const map: Record<string, string> = {
    "AI개발본부": "AI Dev Division",
    "AI개발팀": "AI Dev Team",
    "AI 플랫폼개발팀": "AI Platform Dev Team",
    "프로덕트 디자인팀": "Product Design Team",
    "디자인 이노베이션그룹": "Design Innovation Group",
    "프로덕트 디자인팀 / 디자인본부": "Product Design Team / Design Div",
    "플랫폼인프라팀": "Platform Infra Team",
    "그로스마케팅팀": "Growth Marketing Team",
    "AI개발본부 (데이터사이언스)": "AI Dev Div (Data Science)",
    "서비스 전략실": "Service Strategy Office",
    "인재개발팀": "HR Dev Team",
    "개발사업본부": "Development Business Division",
    "솔루션영업팀": "Solution Sales Team",
    "디자인본부": "Design Division",
    "전체": "All"
  };
  return map[dept] || dept;
};

// Role translations
export const translateRole = (role: string): string => {
  const map: Record<string, string> = {
    "Core AI 아키텍트 / 파이프라인 설계 디렉터": "Core AI Architect / Pipeline Design Director",
    "메인 구매/결제 유저 디테일 디자이너": "Main Purchase/Payment UX Designer",
    "고성능 분산 데이터 파이프라인 관리자": "High Performance Distributed Data Pipeline Manager",
    "사용자 유입 획득(UA) 유공 마케터": "User Acquisition (UA) Lead Marketer",
    "서비스 신규 피처 UI/UX 리드 디자이너": "New Service Feature Lead UI/UX Designer",
    "앱 마케팅 UA 및 ROI 분석 담당자": "App Marketing UA & ROI Analyst",
    "디자인본부 본부장": "VP of Design",
    "인프라팀 리더": "Platform Infra Lead",
    "데이터사이언스팀 리더": "Data Science Lead",
    "그로스마케팅 파트 리더": "Growth Marketing Lead",
    "시니어 분산시스템 아키텍트": "Senior Distributed System Architect",
    "시니어 UI/UX 디자인 파트 리더": "Senior UI/UX Design Part Leader",
    "신규 사업기획 및 제휴 PM": "New Business Development & Alliance PM",
    "사내 온보딩 및 교육 운영 담당자": "Onboarding & Corporate Education Coordinator",
    "프로덕트 디자인팀 리더 / 팀장": "Product Design Team Lead / Manager"
  };
  return map[role] || role;
};

// Timeline translations
export const translateTimeline = (timeline: string): string => {
  if (timeline.includes("즉시")) return "Immediate (1-3 mos)";
  if (timeline.includes("중기")) return "Medium-Term (3-6 mos)";
  if (timeline.includes("장기")) return "Long-Term / Low (6+ mos)";
  return timeline;
};

// Translate employees on the fly when English toggle is active
export const translateEmployee = (emp: EmployeeAnalysis): EmployeeAnalysis => {
  const id = emp.id;
  
  let result: Partial<EmployeeAnalysis> = {
    id: emp.id,
    employeeName: translateName(emp.employeeName),
    department: translateDept(emp.department),
    role: translateRole(emp.role),
    riskScore: emp.riskScore,
    estimatedSalary: emp.estimatedSalary,
    keyDrivers: { ...emp.keyDrivers },
    timeline: translateTimeline(emp.timeline)
  };

  // Pre-compiled translation map for known core employees
  if (id === "emp_1") {
    result.redFlags = [
      {
        quote: "We absolutely cannot meet the commercial release schedule with our current resources. I've been working every weekend for over three months, and there is no sign of improvement.",
        issue: "Severe physical and mental burnout due to unsustainable continuous weekend work"
      },
      {
        quote: "I recently received a headhunting offer from a competitor, guaranteeing no night shifts and an annual salary increase of over 30%. I'd be lying if I said I wasn't tempted when thinking about my family.",
        issue: "Concerns and sense of deprivation regarding external recruitment opportunities and low compensation level relative to market value"
      }
    ];
    result.executiveSummary = "He is an irreplaceable core development leader in the organization who holds exclusive ownership of core AI model optimization and lightweighting patents and personally built the commercial plugins. He is experiencing extreme burnout due to product release milestone pressure, and is exposed to competitors' headhunting offers, pushing his turnover risk to the absolute peak.";
    result.recommendations = [
      "Immediately allocate alternative development resources and completely suspend weekend overtime work.",
      "Convene an emergency retention committee to arrange a special one-time incentive (or additional high-value stock options).",
      "Create a sub-leader role within the division to delegate some operational authority and adjust annual leave."
    ];
    result.affectedProjects = [
      "Core LLM On-Device Ultra-Lightweight Commercial Architecture Project (Risk of 6-month release delay)",
      "Next-Gen Conversational Customized Search Engine Real-time Pipeline Advanced Phase (Core system outage risk)"
    ];
    result.mitigationApproach = "Substantial burnout reduction and compensation adjustment: Urgently assign backup co-development resources and establish redundant R&R roles. Address the market value gap by formulating an 'Executive Special Retention Incentive and Stock Option Compensation Agreement', followed by a direct meeting with the CEO.";
  } else if (id === "emp_2") {
    result.redFlags = [
      {
        quote: "The newly appointed group head unilaterally dictates all visual guidelines and work sequences top-down without any process of discussion or alignment. I feel like an outsourced factory machine, not a collaborator.",
        issue: "Complete loss of autonomy due to the new design group leader's arbitrary top-down direction"
      },
      {
        quote: "As a design leader, I don't see what I can design, challenge, and grow with in this organization. It feels like my career is just rotting away.",
        issue: "Demoralization due to doubts about growth vision and loss of initiative within the organization"
      }
    ];
    result.executiveSummary = "A mid-level practitioner leader who holds the key to the UI completeness of our overall payment and core user journeys. Although she has overseen the design of highly coupled major user experiences, she is experiencing strong psychological withdrawal due to breach of trust and communication barriers with her supervisor.";
    result.recommendations = [
      "Assign an independent UX Task Force (TF) project that does not require group leader approval to restore initiative.",
      "Establish a direct CEO-to-senior 1on1 channel to hear grievances and coordinate independent design authority.",
      "Prioritize allocation of budget for her to attend an external global design conference and training programs in the second half of the year."
    ];
    result.affectedProjects = [
      "UX Revamp for Optimizing Key Purchase Journey & Payment Funnel (Risk of funnel conversion rate loss)",
      "Consistency Package Design for Mobile Web-only User Single Purchase Flow in the second half"
    ];
    result.mitigationApproach = "Mitigate top-down leadership friction and guarantee independence: To bypass emotional friction with the newly appointed group leader (who came from another company), establish a 'Service UI/UX Autonomous Decision-Making TF' that allows complete independent initiative, securing direct product ownership and boosting job satisfaction.";
  } else if (id === "emp_3") {
    result.redFlags = [
      {
        quote: "Instead of the distributed data architecture modeling work promised in my employment contract, I'm spending an excessive portion of my resources manually extracting Excel metrics and doing tedious data chores requested by other departments.",
        issue: "Vocational futility due to role mismatch and excessive low-value manual work overhead"
      }
    ];
    result.executiveSummary = "A key engineer supporting core infrastructure operations and regular data migration backends. Fatigue is accumulating due to a widening gap (Role Mismatch) between the technical area where he wants to develop and grow his expertise and the repetitive manual settlement support he is currently bogged down with.";
    result.recommendations = [
      "Assign him to lead an R&D project to build a self-service BI dashboard that eliminates manual API data extraction for other departments.",
      "Facilitate regular participation in advanced server and backend development sessions and assign him as a core team member for infrastructure migration."
    ];
    result.affectedProjects = [
      "Real-time High-Capacity Distributed Migration & Real-time Data Logging Integrity Verification",
      "Integration Module for Enterprise Marketing Performance & Budget Settlement Analysis Platform (Preparing against automated loading disconnection)"
    ];
    result.mitigationApproach = "Overcome role mismatch and restore professional expertise: Immediately suspend inefficient manual data extraction for other departments, and pivot him to lead 'Enterprise BI High-Capacity Self-Service Platform Construction' to enable high-level platform engineering growth.";
  } else if (id === "emp_4") {
    result.redFlags = [
      {
        quote: "Feedback exchange with marketing colleagues and team satisfaction are excellent. The performance analysis system is also working meaningfully. The only small obstacle to growth is that the recent tight budget measures have limited opportunities to run experiments proactively.",
        issue: "Limitations on experiments as a growth-driven marketer due to prolonged budget cuts"
      }
    ];
    result.executiveSummary = "An exceptionally stable marketer with very low stress, high trust in leadership, and minimal turnover signs. However, due to advertising budget cuts, her desire to maximize professional performance and run creative A/B tests is not fully satisfied.";
    result.recommendations = [
      "Authorize an autonomous micro-budget (within 5% of marketing spend) for she to freely run split tests on creative drafts.",
      "Provide opportunities to lead internal online growth strategy workshops and allocate educational book allowances."
    ];
    result.affectedProjects = [
      "Domestic and Global Social Marketing Expansion & Organic Multi-channel Reach Optimization",
      "Commercial Deployment of Performance-Based Data Growth Marketing ROAS Simulator Model"
    ];
    result.mitigationApproach = "Approve autonomous pilot budget and support internal education contributions: To support active A/B testing achievements despite tight budget frames, approve a small 'Growth Contribution Test Pilot Budget' and designate her as the main facilitator for junior marketer workshops.";
  } else if (id === "emp_5") {
    result.redFlags = [
      {
        quote: "I'm handling all the design resources by myself lately. Working overtime has become a daily routine, but because I am forced to deliver final designs without any process feedback or coordination, my motivation is completely gone.",
        issue: "Extreme workload accumulation due to understaffing and loss of ownership due to exclusion from product reviews"
      }
    ];
    result.executiveSummary = "A talented senior designer who develops usability for core service features. She is under severe work pressure due to short-term funnel integration tasks and is actively reviewing competitor headhunting offers, making her a high-priority management focus.";
    result.recommendations = [
      "Urgently bring in freelance or contract design resources to support the design team's workload.",
      "Establish measures to reward core contributions and grant special recovery leave.",
      "Grant co-ownership of UX from the initial planning stage to restore active initiative."
    ];
    result.affectedProjects = [
      "New Interactive Media Funnel View Renewal in the second half (Design holding risk)",
      "Asset creation for multi-national cross-border payment hub Dark Mode support"
    ];
    result.mitigationApproach = "Work division and one-time special reward: Outsource temporary design support to secure resource availability, execute executive special rewards to encourage short-term project completion, and build direct leadership channels to align project direction.";
  } else if (id === "emp_6") {
    result.redFlags = [
      {
        quote: "Marketing solution costs are cut, yet they demand more sophisticated acquisition results, leaving us with no alternative. Since the salary gap compared to competitors is quite large, adjustment is desperately needed.",
        issue: "Pressure for performance under restricted budgets and dissatisfaction with low compensation relative to market average"
      }
    ];
    result.executiveSummary = "A precision analyst marketer who leads growth marketing efficiency measurement pipelines and tracking tool setups. Her overall satisfaction has decreased due to demands for high performance despite budget reductions and discrepancies in market-rate compensation.";
    result.recommendations = [
      "Introduce performance-linked marketing bonuses or incentive pool contracts.",
      "Provide opportunities to join cross-platform tracking studies."
    ];
    result.affectedProjects = [
      "New Customer Acquisition 3.0 Automation & LTV Coherent Analysis Model Construction",
      "Multi-channel machine learning optimization integration infrastructure per growth funnel"
    ];
    result.mitigationApproach = "Strengthen reward linkages and support growth: Introduce incentive models based on contribution performance to provide financial motivation and grant research authority for cross-media solutions to support career growth.";
  } else {
    // Dynamic translations for dynamically created/added records
    result.redFlags = emp.redFlags?.map(flag => ({
      quote: flag.quote,
      issue: flag.issue // Fallback
    })) || [];
    result.executiveSummary = emp.executiveSummary;
    result.recommendations = emp.recommendations;
    result.affectedProjects = emp.affectedProjects;
    result.mitigationApproach = emp.mitigationApproach;
  }

  // Handle history logs translation
  if (emp.history) {
    result.history = emp.history.map((hist): RiskHistoryItem => {
      let reason = hist.reason;
      if (reason.includes("최초 분석결과 생성")) {
        reason = "Initial AI analysis generated from 1on1 scripts";
      } else if (reason.includes("신규 분석 1온1 면담 피드백 생성")) {
        reason = "New 1on1 feedback analysis completed";
      } else if (reason === "관리자 수동 조정 반영") {
        reason = "Manual administrator adjustment applied";
      } else if (reason.includes("수동 조정 반영")) {
        reason = reason.replace("수동 조정 반영", "Manual adjustment").replace("관리자", "Admin");
      }
      return {
        ...hist,
        reason,
        updaterName: hist.updaterName ? translateName(hist.updaterName) : undefined
      };
    });
  }

  return result as EmployeeAnalysis;
};

// Translate subject tags
export const translateSubject = (subj: string): string => {
  const map: Record<string, string> = {
    "경청과 공감": "Listening & Empathy",
    "명확성": "Clarity of Direction",
    "현황과 정렬": "Status & Alignment",
    "심리적 안전감": "Psychological Safety",
    "솔루션 제시": "Actionable Solutions",
    "건설적 피드백": "Constructive Feedback",
    "1on1 만족도": "1on1 Satisfaction",
    "업무 몰입도": "Job Engagement",
    "성장 만족도": "Growth Satisfaction",
    "주기 준수율": "Frequency Compliance",
    "미팅 지연율": "Meeting Cancel/Delay Rate",
    "프렙 진행율": "Prep Completion Rate"
  };
  return map[subj] || subj;
};

// Translate leader profiles
export const translateLeaderProfile = (prof: LeaderProfile): LeaderProfile => {
  let desc = prof.desc;
  let status = prof.status;
  let actionItems = [...prof.actionItems];

  if (prof.id === 1) {
    status = "Severe • Warning";
    desc = "Since taking office, the new Design VP has repeatedly issued unidirectional top-down directives and micromanaged tasks. In 1on1 scripts, keywords like 'disenfranchisement', 'demoralization', and 'loss of autonomy' have spiked by 410% compared to other divisions, triggering an acute turnover risk for lead designer Chloe. If this continues, the core design team will lose product UI/UX competitiveness and experience consecutive resignations. It is highly recommended to suspend top-down directives and immediately delegate design authority back to product teams.";
    actionItems = [
      "Urgently delegate design authority and establish an alternative bypass reporting line to the CEO.",
      "Deliver warning notification based on 360-degree feedback and request official clarification.",
      "Launch continuous HR sentiment checkups to prevent further coercive leadership styles."
    ];
  } else if (prof.id === 2) {
    status = "Close Monitoring";
    desc = "Passive leadership and R&R delegation failure. 1on1 meeting absence rate reached 80%, neglecting alignment with seniors regarding overtime and resource limits. Left unchecked, this will widen cooperation voids and R&R conflicts, risking deployment instability and missing system recovery golden windows. To solve this, audit the regular 1on1 completion rate to enforce a 90% threshold, establish priority allocation guidelines, and actively mediate local team friction.";
    actionItems = [
      "Enforce submission of a 90-day communication roadmap and audit weekly 1on1 compliance.",
      "Re-establish department R&R guidelines and assign specialized management capability training.",
      "Restructure weekly standup workflows to prevent continuous operational bottlenecks."
    ];
  } else if (prof.id === 3) {
    status = "Outstanding • Mentor";
    desc = "Routinely completes exemplary career-focused 1on1s coupled with active emotional support and professional development. Demonstrates best practices in tailored goals and horizontal alignment, achieving top marks in team sentiment and performance efficiency. However, should this extra coaching burden persist without support, the leader may experience personal burnout. To mitigate, immediately implement mentoring rewards (such as training speaker bonuses) and grant advanced scheduling flexibility.";
    actionItems = [
      "Issue exemplary '1on1 Master' license and appoint to internal leadership mentoring committees.",
      "Appoint as core keynote speaker & facilitator for company-wide leadership conferences.",
      "Add special HR performance credits to recognize her contribution to team stability."
    ];
  } else if (prof.id === 4) {
    status = "Excellent • Trusted";
    desc = "Demonstrates outstanding capability in removing communication barriers and establishing deep psychological safety for individual members. Achieves robust growth milestones by maintaining clear KPI guidance while constructively shaping member initiatives. Note that over-emphasizing safe sentiment may occasionally delay direct performance adjustments or metric callouts when schedules slip. It is recommended to back her strong psychological connection with structured KPI/OKR alignment metrics.";
    actionItems = [
      "Grant advanced facilitator credentials and form internal leadership advisor networks.",
      "Document case studies of successful psychological safety strategies and distribute templates.",
      "Prioritize budget allocation for team marketing budget scale-ups based on milestone successes."
    ];
  }

  return {
    ...prof,
    name: translateName(prof.name),
    role: translateRole(prof.role),
    dept: translateDept(prof.dept),
    status,
    desc,
    scores: prof.scores.map(s => ({ subject: translateSubject(s.subject), score: s.score })),
    actionItems
  };
};

// Translate months
export const translateMonth = (month: string): string => {
  const map: Record<string, string> = {
    "1월": "Jan",
    "2월": "Feb",
    "3월": "Mar",
    "4월": "Apr",
    "5월": "May"
  };
  return map[month] || month;
};

// Translate status
export const translateStatus = (stat: string): string => {
  const map: Record<string, string> = {
    "심각 • 위험 경고": "Severe • Critical Warning",
    "밀착 모니터링": "Close Monitoring",
    "최우수 • 멘토": "Outstanding • Mentor",
    "탁월 • 신뢰": "Excellent • Trusted",
    "경고 (집중 개입 필요)": "Warning (Requires Focus Intervention)",
    "경고 (불이행 심각)": "Warning (Severe Non-compliance)",
    "경고 (스케줄 파탄)": "Warning (Schedule Failure)",
    "경고 (불이행 위독)": "Warning (Non-compliance Critical)",
    "경고 (소통 방치)": "Warning (Communication Neglect)",
    "주의 (참여 저조)": "Caution (Low Participation)",
    "주의 (조율 미흡)": "Caution (Insufficient Alignment)",
    "주의": "Caution",
    "양호 (보완 권장)": "Optimal (Adjustment Recommended)",
    "최우수 (이행 우뚝)": "Outstanding (Perfect Compliance)",
    "최우수 (소통 신뢰 최고치)": "Outstanding (Max Trust)",
    "최우수 (전사 1위)": "Outstanding (Company Rank 1)",
    "최우수": "Outstanding",
    "우수": "Excellent",
    "우수 (참여 원활)": "Excellent (Active Prep)",
    "우수 (최고 밀착)": "Excellent (High Contact)",
    "양호": "Optimal",
    "보통 (인프라 과업 정제)": "Normal (Platform Chores)",
    "보통": "Normal"
  };
  return map[stat] || stat;
};

// Translate description and solution texts
export const translateReasonAndSolution = (text: string): string => {
  if (!text) return "";
  const map: Record<string, string> = {
    "강석주의 권위주의적 탑다운 방식과 잦은 1on1 약속 당일 취소(42%)가 중첩되어 실무진들의 '의견 개진 위험성'과 정서적 침묵 장벽이 완성되었습니다. '말해봐야 반영되지 않는다'는 학습된 무기력이 팽배합니다.":
      "Steve's authoritarian top-down approach coupled with frequent last-minute 1on1 cancellations (42%) has erected emotional silence barriers and high 'opinion risk' among members. Learned helplessness ('nothing changes even if I speak up') is rampant.",
    "강석주의 일방 결재 승인 단계를 간소화하고, 주니어 디자이너 주도 프로젝트 발의 권한을 확보하는 매니징 크레딧제를 가동합니다.":
      "Simplify Steve's unilateral approval tiers, and deploy a managing credit system to secure independent project initiation rights for junior designers.",
    "면담 시 리더 본인의 업적 자랑이나 업무 닥달 위주로 대화가 점철되어 구성원들이 감정적 에너지를 심각하게 갈취당한다고 보고하고 있습니다.":
      "Conversations are dominated by the leader bragging about his achievements or micromanaging workloads, severely draining the emotional energy of his team.",
    "코칭 매뉴얼 가이드를 강제 적용하여 면담 시간의 80%를 리더의 침묵 및 경청으로 구성하도록 모니터링합니다.":
      "Forcefully apply a specialized coaching playbook mandating that 80% of session time be allocated to leader silence and active listening.",
    "업무 지시는 명확하나 그것이 개인의 경력 성장이나 실무적인 고충 제거와 연결되지 못해 이탈 심리를 자극하고 있습니다.":
      "Although work instructions are clear, they lack connection to personal career growth or resolution of practical grievances, prompting turnover desire.",
    "역량 매핑 모델 교육을 통해 시니어/주니어의 개별 성장 마일스톤에 부합하는 경력 중심 정합 면담 보정과 교육 기회를 지급합니다.":
      "Provide competence mapping workshops to align session topics with individual milestones and assign target career-enhancing training opportunities.",
    "최무현의 업무 바쁨 핑계 면담 거부 및 회피로 인해, 실무진들이 현업 장애 상황을 마음 놓고 리포트할 소통 구역을 차단당했습니다.":
      "Mark's avoidance of 1on1 sessions under the pretext of 'being too busy' has effectively blocked any open channels for practitioners to safely report systems blocks.",
    "주차별 정기 원온원 스케줄 감사를 신설하여 리더의 기피 현상을 통제하고 격주 소통 완수를 명문화합니다.":
      "Establish a weekly automated 1on1 audit to control leader avoidance behavior and formally require bi-weekly communication sessions.",
    "대화 자체가 거의 이뤄지지 않아 피드백 단절이 일어났으며, 가끔 진행되는 면담에서도 방치하듯 공감 없이 지나가는 형식적 세션 경향이 보입니다.":
      "Due to near-zero dialogue, feedback has completely ceased. The few sessions that do occur are highly formal and superficial, lacking genuine empathy.",
    "초임 리더 대상 정서적 교감 트레이닝 및 '성장을 열어주는 피드백 오너십 스킬업' 교육에 필수 입과시킵니다.":
      "Mandate enrollment of junior leaders in active empathy training and workshops on constructive feedback ownership.",
    "R&R 조율 거부, 가이드라인 부재, 인프라 야근 조율 갈등의 해결 부재로 인해 실무 업무 정렬 가치가 최하선까지 냉각되었습니다.":
      "Refusal of R&R coordination, lack of documentation, and unresolved overtime disputes have cooled local work alignment values to absolute lows.",
    "R&R 가이드북 설계 의무를 부여하고 협업 장애 발생 시 본부 차원의 중재 위원회를 즉각 가동합니다.":
      "Enforce mandatory creation of division R&R guidebooks, and immediately activate executive-level mediation boards when cooperation bottlenecks arise.",
    "손민아의 격려 행동, 실패 감싸안기 태도를 통해 실무 진들이 실패의 위험을 무릅쓰고 대담한 개발 연구를 제안하는 등 심리 안전 만족도가 최상입니다.":
      "Mina's encouraging stance and supportive attitude allow practitioners to take research risks and confidently propose ambitious developments, resulting in superior psychological safety.",
    "우수한 경청 촉진 정서 모델을 사내 소통 스탠다드로 채택하여 전사 리더들에게 멘토링 사례로 추천 이양합니다.":
      "Formally adopt her outstanding active listening model as the corporate standard and disseminate it as a mentoring case study for all company-wide leaders.",
    "팀원 1on1 취소율 4%, 성실한 경청으로 감정적 교감을 최우수 가치로 지탱하여 팀 전체가 강인한 직장 유대감과 만족도를 완수했습니다.":
      "With a stellar 1on1 cancellation rate of only 4% and deeply sincere active listening, she maintains superb empathy and a cohesive team bond.",
    "퍼실리테이터 우수 포상 수당 특별 보상 및 리더 본인의 감정 격무 소진 방지를 위한 정기 힐링 리워드를 제공합니다.":
      "Reward her with special facilitator incentives and allocate periodic recovery rewards to prevent emotional burnout from heavy coaching.",
    "기술적인 스크립트 리뷰, 명확하게 조형된 데이터 개발 목표, R&R 및 연구 자원 조율이 촘촘하게 지원되는 정합 완결 모델입니다.":
      "Provides an exceptional alignment model that closely supports systematic code reviews, explicitly framed development metrics, and granular R&R/resource adjustments.",
    "최첨단 데이터 가용 리서치 환경 인프라를 우선 확보해 부서의 연구 효율성을 영구적 지지합니다.":
      "Prioritize allocation of state-of-the-art research environments and high-performance computing resources to permanently support department R&D efficiency.",
    "이혜성의 원만하고 친절한 마인드로 대화 분위기가 매우 안락하게 유지되며, 사전 프렙 제출률이 92%에 달할 만큼 참여 열의가 높습니다.":
      "Chris's horizontal and supportive mindset maintains an extremely comfortable dialogue atmosphere. Member engagement is high, with a 92% prep submission rate.",
    "우수 아젠다 풀을 공유하며 팀원 개별적 능동 의견과 실무 가이드라인 실증 모델 구축을 유지 공고합니다.":
      "Share an active agenda library and reinforce frameworks that translate individual insights into concrete operational roadmaps.",
    "팀원의 고충을 매우 사려 깊게 수청하고 상향 피드백을 수려하게 수용하는 우수한 지지 기반이 입증되었습니다.":
      "Proven to be a highly supportive leader who meticulously listens to employee pain points and gracefully welcomes bottom-up feedback.",
    "마케팅 과업에 최적화된 협업 안전성 케어 예산 지속 증액 편성 지원.":
      "Provide continuous budget scaling to support collaboration security tools optimized for creative marketing workloads.",
    "팀 정서는 좋으나, 긴박한 실적 수치 압박 시 냉혹하고 객관화된 성과 지표(KPI/OKR) 지적 및 교정 피드백에 대해 심리적 주저함을 일부 느끼는 현상 감지.":
      "While team rapport is excellent, a subtle psychological hesitation is detected when delivering objective correction or addressing lagging KPI/OKR targets under tight timelines.",
    "정서 신뢰를 기반으로 흔들리지 않는 수치 성장을 이끄는 'KPI/OKR 성과 정렬 매트릭스 피드백 스쿨' 과정 이수를 적극 제안합니다.":
      "Actively suggest her enrollment in 'Structured KPI/OKR Performance Matrix Workshops' to lead robust numerical growth on a foundation of emotional trust.",
    "월 정기적으로 권장되는 1on1 면담 건수 대비 수행율수가 45%에 그쳐, 사실상 대화 주기가 붕괴하여 주니어들의 방치 기간이 늘어나고 있습니다.":
      "With actual completed sessions at only 45% of the monthly recommendation, the dialogue frequency is effectively broken, extending the duration of junior isolation.",
    "최소 월 2회 세션을 자동 발송(Scheduler)하여 리더 캘린더에 고정 노출하고 이행 여부를 주간 인사 관리 지표로 인사팀에서 감사 추적합니다.":
      "Automatically schedule and inject at least two monthly 1on1 events directly into the leader's calendar, and track execution as a weekly HR indicator.",
    "당일 미팅 폭파 및 잦은 변경 빈도(취소/변경율 42%)로 인해 팀원들이 약속에 대한 실망감 및 소외감을 누증 체감합니다. '언제든 바쁘면 파토나는 요식행위'로 치부되고 있습니다.":
      "Frequent last-minute cancellations and reschedules (42% rate) fuel accumulated disappointment and alienation. Sessions are perceived as superficial gestures easily canceled.",
    "1on1 일방적 당일 취소 페널티 제도를 도입하여, 취소 시 24시간 내 사유서 제출 및 차주 보조 세션 대체 개설을 의무화합니다.":
      "Introduce a strict last-minute cancellation policy mandating submission of a justification within 24 hours and booking a makeup session in the following week.",
    "수직적 리더십 고착에 따라 '의견을 적어 고민을 공유해도 개선되지 않는다'는 침묵주의가 가동되어 프렙 아젠다 등록률이 45%로 낮습니다.":
      "Deeply rooted top-down leadership has fostered a silent culture where members believe 'nothing changes even if I write prep notes', limiting the prep submission rate to 45%.",
    "실무 주안점 사전 등록 시 인사 보정 가점을 임시 부여해 면답 자발 유입을 돕습니다.":
      "Temporarily offer minor HR credit points for submitting pre-meeting agenda items to encourage voluntary participation.",
    "인프라팀 핵심 리더십 면담 실행률이 32%로 전사 최하위선입니다. 이로 인해 2개월 연속 리더와 면담하지 못한 심리적 방치자가 존재합니다.":
      "The infrastructure lead's 1on1 completion rate stands at 32%, the absolute lowest. Consequently, some members have been emotionally isolated for two months.",
    "원온원 실시간 이행 감사 시스템을 작동해 강제 개시 경고장을 송부하고, 인사위원회에서 리스크 소통을 보강 대리 시행합니다.":
      "Deploy an automated 1on1 audit system to issue compliance notices and arrange supplementary HR counseling sessions to address immediate risks.",
    "잦은 서버 장애 대응 및 타스킹 중복을 핑계로 당일 일정을 취소(35%)하는 주의 상태의 연쇄 고충이 적출되었습니다.":
      "Detected a pattern of cancellations (35%) justified by frequent server emergency responses and conflicting technical workloads.",
    "인프라 필수 정합 리소스를 보조할 전담 백엔드 리더 버퍼 인력을 투입해 대화 완수 시간을 의도적으로 격리 확보시킵니다.":
      "Inject dedicated backend co-leaders to assist with infrastructure maintenance, deliberately carving out time for team dialogue.",
    "리더의 무기력한 공감 능력과 면담 불완수 습성으로 인해 면담 가치 실효에 대침묵이 감지되었습니다. 사전 등록률이 28%에 머물고 있습니다.":
      "Due to the leader's flat empathy and frequent cancellations, team members have disengaged, leading to a low prep registration rate of 28%.",
    "간소한 1줄 질문/소견 퀵 프렙 제출 형식을 장려해 주니어들의 등록 편의성을 보완 설계합니다.":
      "Introduce a super-simple, one-line quick-prep submission template to make it easy for junior engineers to register discussion points.",
    "바쁜 일정 전반에서도 소통 마일스톤 이행을 절대적인 우선순위로 간주해, 이행률 96%의 완전무결 결합 소통 행렬을 증명 중입니다.":
      "Despite heavy workloads, she prioritizes communication milestones, demonstrating near-perfect compliance with a 96% execution rate.",
    "성실 실천 사례집 배포 및 사내 리더십 다이얼로그 강사로 초빙, 인사 마일스톤 특전 수당 배급.":
      "Distribute her best-practice guide, invite her as a keynote leadership speaker, and award special HR bonuses.",
    "당일 세션 취소율 단 4%대로서, 팀원들의 약속 준수를 최고의 신뢰 계약으로 체화하여 소통 안정도를 극대화하고 있습니다.":
      "With a same-day cancellation rate of only 4%, she honors meetings as critical trust contracts, maximizing communication stability.",
    "팀원 소통 완성을 지탱하는 지속적인 원격 자율 및 캘린더 정렬 세이버 지원책 마련.":
      "Create continuous remote work options and calendar alignment tools to support uninterrupted, highly focused meetings.",
    "팀원 스스로 1on1 면담 가치의 실물 개선성을 높게 승인하여 78%의 높은 비율로 능동 고민/논의점을 사전에 준비해 제출하고 있습니다.":
      "Members highly value her 1on1s, actively registering and preparing discussion points beforehand at a high rate of 78%.",
    "작성 아젠다 질적 피드백 우대 가이드를 이양해 면담 밀도의 선순환 성장을 고착화합니다.":
      "Provide premium feedback guidelines for registered agendas, solidifying a virtuous cycle of high-density team sessions.",
    "유연하고 돈독한 정서 유대로 88%의 월별 이행률을 달성해 정기적인 정서 지지선을 가동하고 있습니다.":
      "Maintains a consistent emotional safety net by achieving a robust 88% monthly 1on1 completion rate based on deep team rapport.",
    "현행 마케팅 루프 정렬 면담을 지탱하고, 성장 피드백을 보완 결합하도록 수시 지원합니다.":
      "Support continuous creative marketing loops and assist in coupling qualitative feedback with growth milestones.",
    "미팅 당일 약속 파토 비율을 단 8% 수준으로 억제하며 성실하고 원만한 신뢰 협업 전선을 완충 확보하고 있습니다.":
      "Minimizes same-day cancellations to an excellent 8% level, securing a resilient and highly trusted collaboration environment.",
    "마케팅 과업 조형 수립 및 리더 보호를 위한 업무 가용 인력 보조선 확보.":
      "Ensure adequate backup staffing to assist with marketing campaign tasks and protect leader scheduling buffers.",
    "감정 공조 및 이타적 수용력을 통해 실무진들의 고민 발화 참여도가 92%로 전사에서 가장 높게 과열된 건강한 협동 루프입니다.":
      "With her high empathy and receptive nature, active member prep registration reaches 92%, indicating the healthiest collaboration loop in the company.",
    "고민 사전등록 사례를 모아 감정적 소통 활성화 모델을 모전 가이드로 패키징 배포 유도.":
      "Compile successful prep registration cases and package them into an empathy-driven corporate communication template."
  };
  return map[text] || text;
};

// Translate complete heatmap row
export const translateHeatmapRow = (row: HeatMapRow): HeatMapRow => {
  return {
    dept: translateDept(row.dept),
    leader: translateName(row.leader),
    metrics: row.metrics.map((m): HeatMapMetric => ({
      name: translateSubject(m.name),
      score: m.score,
      rate: m.rate,
      status: translateStatus(m.status),
      reason: translateReasonAndSolution(m.reason),
      solution: translateReasonAndSolution(m.solution)
    }))
  };
};
