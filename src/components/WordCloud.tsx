import React, { useState } from "react";
import { AlertCircle, ArrowRight, ShieldCheck, HelpCircle, Flame } from "lucide-react";

interface WordItem {
  text: string;
  weight: number; // 1 to 10
  color: string;
  category: string;
  dept: string;
  quote: string;
  desc: string;
  solution: string;
  percentage: number;
}

const BOOT_WORDS: WordItem[] = [
  {
    text: "리소스 부족",
    weight: 10,
    color: "from-rose-500 to-red-400 text-rose-450",
    category: "리소스",
    dept: "AI개발팀 / 플랫폼인프라팀",
    quote: '"신규 피처 개발 일정이 연속되어 기본 유지보수 및 리팩토링 시간이 전혀 주어지지 않습니다. 야근이 일상화되어 번아웃 한계점입니다."',
    desc: "연속적인 중요 마일스톤 설계 및 한정된 시니어 엔지니어 인력 풀의 과부하로 인해 병목 현상이 누적되어 퇴직 및 이탈 리스크를 증폭시키고 있습니다.",
    solution: "개발 및 인프라 추가 채용 우선 배정, 핵심 피처 릴리즈 스프린트 주기 연장 및 스코프 조율 코칭.",
    percentage: 84
  },
  {
    text: "타 부서 협업 갈등",
    weight: 9,
    color: "from-amber-500 to-orange-400 text-amber-400",
    category: "소통 및 협업",
    dept: "그로스마케팅팀 / 프로덕트 디자인팀",
    quote: '"타 부서의 데이터 요청이나 승인 프로세스가 지나치게 복잡해서 마케팅 라이브 일정을 제때 맞추지 못하고 마찰이 늘고 있습니다."',
    desc: "서로 다른 OKR 지표 추구로 인한 우선순위 충돌 및 상호 연계 승인 프로세스의 불합리성으로 업무 지체와 사기 도태가 심화되고 있습니다.",
    solution: "원활한 크로스-펑셔널 팀 리더 간 주간 우선순위 합의제 도입 및 데이터 셀프요청 쿼리 권한 확대.",
    percentage: 76
  },
  {
    text: "보수적 규정",
    weight: 8,
    color: "from-blue-500 to-indigo-400 text-blue-400",
    category: "제도 및 규정",
    dept: "프로덕트 디자인팀 / 플랫폼인프라팀",
    quote: '"새로운 아이디어 제안이나 외부 툴 도입 시 결재 라인이 너무 복잡하고, 기존 규정만 고수하여 혁신 의욕이 꺾입니다."',
    desc: "전통적이고 다층화된 보고 라인 및 소극적인 도구 활용 지침으로 인해 실무진의 피로감이 누적되고 있습니다.",
    solution: "실무진 주도의 PoC 툴 간이 도입 전결권 부여 (부서장 전결 최고 100만 원 선), 결재 단계 3단계 이하로 축소.",
    percentage: 65
  },
  {
    text: "의사결정 지연",
    weight: 8,
    color: "from-purple-500 to-pink-400 text-purple-400",
    category: "리더십 및 권한",
    dept: "프로덕트 디자인팀",
    quote: '"시안을 수차례 제공하고 피드백을 요청했으나 리더십 전결 독점 상황에서 마일스톤 최종 컨펌을 마냥 기다리기만 합니다."',
    desc: "책임 분할이 부재하고 모든 전결이 특정 리더의 훈조 및 단독 독점 상태로 정체되어 실무 효율이 극대화되지 못하고 있습니다.",
    solution: "역할 분할(RACI) 매트릭스 전면 재조정, 실무진 지침 내 의사결정 위임 및 책임 전가 해소.",
    percentage: 72
  },
  {
    text: "불명확한 R&R",
    weight: 7,
    color: "from-cyan-500 to-teal-400 text-teal-400",
    category: "조직 설계",
    dept: "그로스마케팅팀 / 플랫폼인프라팀",
    quote: '"이 업무가 우리 부서 담당인지, 리드 업무인지 명확하지 않아 항상 공중에 뜨거나 양쪽 다 수동 대응으로 일관하게 됩니다."',
    desc: "부서 간 경계 업무에 대한 문서화된 가이드 부재로 신규 돌발 업무의 핑퐁 현상이 누적되어 감정 낭비를 양산하고 있습니다.",
    solution: "신규 업무 발생 시 '업무 소관 위원회'를 비동기식으로 진행하여 선제적으로 주관 부서를 배정하고 노션 위키에 상시 선언.",
    percentage: 59
  },
  {
    text: "단순 전사 반복",
    weight: 6,
    color: "from-emerald-500 to-teal-400 text-emerald-400",
    category: "프로세스",
    dept: "플랫폼인프라팀",
    quote: '"고급 인프라 엔지니어로 입사했는데 엑셀 수동 지표 정리와 정비 보고서 전송 등 단순 반복 복사 노동에 대부분의 시간을 뺏기고 있습니다."',
    desc: "시스템 자동화 부재로 인해 수작업 대행 처리가 반복되며 저숙련 직무 매몰 감정이 증폭되어 기여 상실 및 고독감으로 이어집니다.",
    solution: "주차별 사내 어드민 단순 노동 업무 자동화 스크립트 작성 테스크 할당, 엑셀 취합의 BI 전환.",
    percentage: 52
  },
  {
    text: "피드백 부재",
    weight: 6,
    color: "from-yellow-500 to-amber-400 text-yellow-400",
    category: "리더십 및 성장",
    dept: "AI개발팀 / 그로스마케팅팀",
    quote: '"1on1 면담 때 이야기를 드리지만 좋은 이야기만 오갈 뿐, 실제로 저의 코드 완성도나 성장에 대한 정량 피드백은 전혀 돌아오지 않습니다."',
    desc: "면담이 단순한 안부 묻기 수준에 정체되면서 실질적 직무 교정이나 역량 향상을 바라는 고지향 마인드 멤버들의 갈증이 발생합니다.",
    solution: "역할 및 전문성에 부합하는 정량 기술 피드백 가이드 양식 리더용 제공 배포.",
    percentage: 48
  }
];

export default function WordCloud() {
  const [selectedWord, setSelectedWord] = useState<WordItem>(BOOT_WORDS[0]);

  return (
    <div className="space-y-4 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: Interative Word Cloud Visualizer */}
        <div className="lg:col-span-12 xl:col-span-7 bg-[#14181F] p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-300 font-sans tracking-wide uppercase flex items-center gap-1.5 mb-2.5">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
              장애물 키워드 클라우드 (Roadblock Keyword Cloud)
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal mb-6">
              1on1 대화 스크립트에서 자동 추출된 <strong>성장 저해 요인 및 핵심 병목지표</strong>입니다. 키워드가 크고 붉을수록 전사 차원의 개입 수치가 시급함을 나타냅니다. <span className="text-teal-400">키워드를 클릭</span>하시면 해당 병목의 상세 인스크립션과 분석 권고 조치를 검토하실 수 있습니다.
            </p>

            {/* Word Cloud Canvas-like Container */}
            <div className="p-6 bg-[#0E1217]/60 rounded-xl border border-slate-850/70 min-h-[220px] flex flex-wrap items-center justify-center gap-3 md:gap-4 select-none">
              {BOOT_WORDS.map((item) => {
                const isSelected = selectedWord.text === item.text;
                // Calculate size classes dynamically based on weight
                let sizeClass = "text-xs";
                if (item.weight >= 10) sizeClass = "text-xl md:text-2xl font-black";
                else if (item.weight >= 8) sizeClass = "text-base md:text-xl font-extrabold";
                else if (item.weight >= 7) sizeClass = "text-sm md:text-base font-bold";
                else sizeClass = "text-xs md:text-sm font-medium";

                return (
                  <button
                    key={item.text}
                    type="button"
                    onClick={() => setSelectedWord(item)}
                    className={`px-3 py-1.5 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-gradient-to-r from-teal-500/15 to-blue-500/15 border-teal-500 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.15)] scale-102 font-bold border-2"
                        : "bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800 text-slate-350 hover:border-slate-700"
                    }`}
                  >
                    <span className={`${sizeClass} bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.text}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-[#0E1217] px-1 rounded border border-slate-800">
                      {item.percentage}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>자연어 처리(NLP) 스크립트 결합분석 • 오차범위 ±4.2%</span>
            <span className="text-teal-500 flex items-center gap-1 font-bold">
              <Flame className="h-3.5 w-3.5 animate-pulse text-amber-500" />
              가장 뜨거운 병목: 리소스 부족 (84%)
            </span>
          </div>
        </div>

        {/* Right Side: Selected Word Detail Analytical Card */}
        <div className="lg:col-span-12 xl:col-span-5 bg-[#14181F] p-5 rounded-xl border border-teal-500/25 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-teal-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                  세부 병목 인사이트
                </span>
              </div>
              <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded font-mono font-bold">
                지수 {selectedWord.percentage}% ({selectedWord.category})
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">
                분석된 조직 리스크 요인명
              </span>
              <h5 className="text-sm font-black text-white mt-1 bg-[#0E1217]/50 p-2 rounded border border-slate-850">
                {selectedWord.text}
              </h5>
            </div>

            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">
                가장 큰 고충을 호소하는 부서
              </span>
              <p className="text-xs font-bold text-teal-300 mt-1 font-sans">
                {selectedWord.dept}
              </p>
            </div>

            <div>
              <span className="text-[9px] font-bold text-rose-400 block uppercase tracking-wide flex items-center gap-1">
                💬 1on1 실제 스크립트 발췌 내용
              </span>
              <blockquote className="text-[11px] text-slate-350 italic mt-1 bg-[#0B0F13]/60 p-2.5 rounded border border-slate-850 leading-relaxed font-sans font-medium">
                {selectedWord.quote}
              </blockquote>
            </div>

            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">
                경영진 차원 해결 필요인자 진단
              </span>
              <p className="text-[11.5px] text-slate-200 mt-1 leading-normal font-sans font-medium">
                {selectedWord.desc}
              </p>
            </div>
          </div>

          <div className="p-3 bg-teal-500/5 rounded-lg border border-teal-500/15 space-y-1.5">
            <span className="text-[9.5px] font-bold text-teal-400 uppercase tracking-wider block flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              즉합 조력 조치 처방안 (Intervention Action Plan)
            </span>
            <p className="text-[11px] text-teal-100 leading-normal font-sans font-medium">
              {selectedWord.solution}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
