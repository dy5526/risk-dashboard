/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK securely on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JSON schema for Gemini response to ensure reliability and type safety
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    employeeName: { type: Type.STRING, description: "이름 또는 익명 가명 (예: 김OO 프로, 개발자 P, 혹은 특정 이름)" },
    department: { type: Type.STRING, description: "추정되거나 확인된 부서 (예: 개발팀, 디자인팀, 마케팅팀, 영업팀 등)" },
    role: { type: Type.STRING, description: "직무/직책 (예: 시니어 React 개발자, UI/UX 디자이너, PM 등)" },
    riskScore: { type: Type.INTEGER, description: "이탈 위험도 수치 (0 ~ 100 사이의 정수)" },
    estimatedSalary: { type: Type.INTEGER, description: "연봉 추정치 (단위: 만 원, 예를 들어 6500) - 원온원 스크립트에서 명시되었거나, 직무/연차 대비 상응하는 대략의 추정치 기입" },
    keyDrivers: {
      type: Type.OBJECT,
      description: "주요 이탈 원인 인자 분석 (각 항목당 0~10점, 10점이 가장 극심한 스트레스/부정적 상황)",
      properties: {
        burnout: { type: Type.INTEGER },
        compensation: { type: Type.INTEGER },
        careerGrowth: { type: Type.INTEGER },
        leadershipConflict: { type: Type.INTEGER },
        roleMismatch: { type: Type.INTEGER }
      },
      required: ["burnout", "compensation", "careerGrowth", "leadershipConflict", "roleMismatch"]
    },
    redFlags: {
      type: Type.ARRAY,
      description: "스크립트에서 추출한 최우선 우려 구절과 이면 진단 리스트 (최대 3개)",
      items: {
        type: Type.OBJECT,
        properties: {
          quote: { type: Type.STRING, description: "스크립트 속 인물의 이탈 뉘앙스가 짙은 주요 발언 원문" },
          issue: { type: Type.STRING, description: "발언 이면에 내포된 조직 차원의 정교한 리스크 해설" }
        },
        required: ["quote", "issue"]
      }
    },
    timeline: { type: Type.STRING, description: "이탈 예상 시점 구획: '즉시 (1-3개월)', '중기 (3-6개월)', '장기/낮음 (6개월 이상)' 중 택일" },
    executiveSummary: { type: Type.STRING, description: "이 인물이 왜 스트레스를 정서적으로 겪고 있으며, 왜 이탈 주기가 빨라졌는지, 전반적 상황을 지적이고 날카롭게 짚어낸 심리 진단 단락" },
    recommendations: {
      type: Type.ARRAY,
      description: "이 인력의 조기 리텐션 유도를 위한 현실적이고 직접 지휘 가능한 최고경영층 제안 리스트 (구체적이며 명확하게 2-3가지 작성)",
      items: { type: Type.STRING }
    },
    affectedProjects: {
      type: Type.ARRAY,
      description: "이 인물이 퇴사/이탈할 경우 직접 마비되거나 연쇄 차질을 무겁게 빚게 되는 구체적 핵심 프로젝트 또는 상용 과업 스펙명 2개 기입 (예: 'Core LLM 파이프라인 개발 마일스톤', '주력 어플 유저 퍼널 최적화 UX 개편')",
      items: { type: Type.STRING }
    },
    mitigationApproach: {
      type: Type.STRING,
      description: "이 인력의 이탈을 줄이기 위해 인간 중심적/리더십 멘토링 차원에서 취해야 할 단 1문장의 밀착된 행동 완화 완화 조약적 접근 방안"
    }
  },
  required: [
    "employeeName",
    "department",
    "role",
    "riskScore",
    "estimatedSalary",
    "keyDrivers",
    "redFlags",
    "timeline",
    "executiveSummary",
    "recommendations",
    "affectedProjects",
    "mitigationApproach"
  ]
};

// API endpoint for analyzing transcripts
app.post("/api/analyze", async (req, res) => {
  const { script } = req.body;

  if (!script || typeof script !== "string" || script.trim().length === 0) {
    return res.status(400).json({ error: "원온원 텍스트를 입력해야 분석할 수 있습니다." });
  }

  // Handle missing API Key gracefully - fail fast with explicit warning
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "AI Studio Secrets에 GEMINI_API_KEY가 존재하지 않습니다. 대시보드는 로컬 시뮬레이션 기반으로도 수동 동작은 가능하지만, 실제 실시간 AI 생성엔 API 키가 필요합니다."
    });
  }

  try {
    const prompt = `당신은 대표이사(CEO)와 최고인사전략가(CHRO)를 대리하여 구성원의 이탈 징후를 추적 조사하고 핵심 가치를 완화 구원해내는 '조직 전략 및 인재 수호 스킬 분석가'입니다.
제공받는 1-on-1(일대일 면담) 비공개 소통 녹취 스크립트 텍스트를 고도로 미시 독해하여, 해당 근로자의 스트레스 동인과 구체적 이기심/피로를 해석하십시오.

특별 지침:
1. **누가 위험한가**: 해당 인재의 이탈도 및 촉발 위험 시점을 엄격 계측하십시오.
2. **무엇이 원인인가 (Key Drivers)**: 번아웃, 보상, 리더십 마찰, 직무 불일치 등 귀속 원천 스트레스를 수치 할당하십시오.
3. **어떤 프로젝트가 파괴되는가 (Affected Projects)**: 이 인물이 이탈 시 즉시 중단되거나 실시간 장애 타격을 입을 2가지의 실제 내부 비즈니스 프로젝트명을 창의적이면서 실존할 법한 명사로 설정하십시오.
4. **어떻게 접근할 것인가 (Mitigation Approach)**: 금액 수식어는 가급적 배제하고, 그들의 사기 회복을 위해 최고 리더십이 개인적/제도적/심리적 차원에서 취해야 할 구체적인 치료적 교두보 가이드 1문장을 제안하십시오.
5. **어조**: 중립적이나 진심 어린 인본주의적 분석가의 어조로 한국어 JSON 응답을 스키마에 엄수해 채워 주십시오.

면담 대상이 소유하는 1-on-1 대화문:
"""
${script}
"""`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 냉철하고 정교하며 고도로 비즈니스 가치 중심적인 대기업 최고인사전략가(C-Level Advisor)입니다. 이탈 위험 진단 분석 결과를 기재한 한국어 JSON 응답을 명세한 스키마 구조에 엄수해 출력해야 합니다.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.15,
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("API 결과 본문이 부재합니다.");
    }

    const payload = JSON.parse(jsonText.trim());
    return res.json({ success: true, analysis: payload });
  } catch (error: any) {
    console.error("Gemini 분석 도중 예외 발생:", error);
    return res.status(500).json({ error: error.message || "원온원 텍스트 마이닝 도중 서버 에러가 유출되었습니다." });
  }
});

// Configure client environment routing Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Dashboard Server] Express API 및 React 프런트 서비스 포트동화 : http://0.0.0.0:${PORT}`);
  });
}

startServer();
