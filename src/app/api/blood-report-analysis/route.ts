import OpenAI from "openai";

export const runtime = "nodejs";

type AnalysisStatus = "eligible" | "not_eligible" | "needs_review";

type BloodReportAnalysis = {
  eligible: boolean;
  status: AnalysisStatus;
  summary: string;
  reasons: string[];
  missingInformation: string[];
  recommendation: string;
  confidence: "low" | "medium" | "high";
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractJson(text: string) {
  const trimmed = text.trim();

  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return trimmed;
}

function normalizeAnalysis(value: unknown): BloodReportAnalysis {
  const record = typeof value === "object" && value !== null ? value : {};
  const rawStatus =
    "status" in record ? (record.status as string) : "needs_review";
  const status: AnalysisStatus =
    rawStatus === "eligible" || rawStatus === "not_eligible"
      ? rawStatus
      : "needs_review";

  const rawConfidence =
    "confidence" in record ? (record.confidence as string) : "low";
  const confidence: BloodReportAnalysis["confidence"] =
    rawConfidence === "high" || rawConfidence === "medium"
      ? rawConfidence
      : "low";

  const collectStrings = (input: unknown) =>
    Array.isArray(input)
      ? input.filter((item): item is string => typeof item === "string")
      : [];

  return {
    eligible: status === "eligible",
    status,
    summary:
      "summary" in record && typeof record.summary === "string"
        ? record.summary
        : "The report needs a medical review before donation can be approved.",
    reasons: collectStrings("reasons" in record ? record.reasons : undefined),
    missingInformation: collectStrings(
      "missingInformation" in record ? record.missingInformation : undefined,
    ),
    recommendation:
      "recommendation" in record && typeof record.recommendation === "string"
        ? record.recommendation
        : "Please review the report with a qualified medical professional or blood bank staff before donating.",
    confidence,
  };
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const report = formData.get("report");

  if (!(report instanceof File)) {
    return Response.json(
      { error: "Please upload a valid blood report file" },
      { status: 400 },
    );
  }

  const allowedTypes = new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
  ]);

  if (!allowedTypes.has(report.type)) {
    return Response.json(
      {
        error:
          "Unsupported file type. Upload a PDF, PNG, JPEG, or WEBP report.",
      },
      { status: 400 },
    );
  }

  if (report.size > 15 * 1024 * 1024) {
    return Response.json(
      {
        error:
          "Report file is too large. Please upload a file smaller than 15 MB.",
      },
      { status: 400 },
    );
  }

  const promptText =
    "Review the attached blood report for blood donation eligibility. Use only the report and do not guess. Assess common donation blockers such as low hemoglobin, abnormal CBC values, infection markers, pregnancy, fever, recent illness, medications, or other abnormal findings. If the report does not contain enough clear information, set status to needs_review and eligible to false. Return strict JSON with exactly these keys: eligible (boolean), status (eligible | not_eligible | needs_review), summary (string), reasons (string[]), missingInformation (string[]), recommendation (string), confidence (low | medium | high). Keep reasons concise and medically cautious.";

  const isImage = report.type.startsWith("image/");
  const response = isImage
    ? await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: promptText,
              },
              {
                type: "input_image",
                image_url: `data:${report.type};base64,${Buffer.from(
                  await report.arrayBuffer(),
                ).toString("base64")}`,
                detail: "auto",
              },
            ],
          },
        ],
      })
    : await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: promptText,
              },
              {
                type: "input_file",
                file_id: (
                  await openai.files.create({
                    file: report,
                    purpose: "assistants",
                  })
                ).id,
              },
            ],
          },
        ],
      });

  const outputText = response.output_text;

  if (!outputText) {
    return Response.json(
      { error: "The AI service returned an empty response" },
      { status: 502 },
    );
  }

  try {
    const parsed = JSON.parse(extractJson(outputText));
    return Response.json(normalizeAnalysis(parsed));
  } catch {
    return Response.json(
      { error: "The AI service returned an invalid response" },
      { status: 502 },
    );
  }
}
