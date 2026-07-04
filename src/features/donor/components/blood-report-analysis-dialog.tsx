"use client";

import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Upload,
  FileText,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

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

function getStatusLabel(status: AnalysisStatus) {
  if (status === "eligible") {
    return "Eligible";
  }

  if (status === "not_eligible") {
    return "Not eligible";
  }

  return "Needs review";
}

function getStatusClasses(status: AnalysisStatus) {
  if (status === "eligible") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "not_eligible") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export function BloodReportAnalysisDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<BloodReportAnalysis | null>(null);
  const updateBloodReportStatus = useMutation(
    api.members.updateBloodReportStatus,
  );

  const fileLabel = useMemo(() => {
    if (!selectedFile) {
      return "No file selected";
    }

    return selectedFile.name;
  }, [selectedFile]);

  const resetState = () => {
    setSelectedFile(null);
    setIsSubmitting(false);
    setAnalysis(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetState();
    }
  };

const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please choose a blood report file first.");
      return;
    }

    const formData = new FormData();
    formData.append("report", selectedFile);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/blood-report-analysis", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as
        | { error?: string }
        | BloodReportAnalysis;

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error ? data.error : "Analysis failed",
        );
      }

      const result = data as BloodReportAnalysis;

      setAnalysis(result);
      await updateBloodReportStatus({
        bloodReportStatus: result.status,
        bloodReportReviewedAt: Date.now(),
      });
      toast.success("Blood report analyzed successfully");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze report",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="gap-2 bg-white text-red-700 shadow-lg shadow-black/10 hover:bg-red-50"
      >
        <Upload className="size-4" />
        Upload report
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blood report upload</DialogTitle>
            <DialogDescription>
              Upload your blood report and let the AI check if any common
              donation blockers appear in the report.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/70 p-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Click to choose a report file
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, PNG, or WEBP up to 15 MB
                  </p>
                </div>
                <Input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setSelectedFile(file);
                    setAnalysis(null);
                  }}
                />
              </label>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-gray-600">
                <span>{fileLabel}</span>
                {selectedFile ? (
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      setSelectedFile(null);
                      setAnalysis(null);
                    }}
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={!selectedFile || isSubmitting}
              className="w-full gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              {isSubmitting ? "Analyzing report..." : "Analyze eligibility"}
            </Button>

            {analysis ? (
              <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={getStatusClasses(analysis.status)}>
                    {getStatusLabel(analysis.status)}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    Confidence: {analysis.confidence}
                  </Badge>
                  <Badge variant="outline">
                    {analysis.eligible
                      ? "Eligible to donate"
                      : "Do not donate yet"}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    AI summary
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {analysis.summary}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Reasons
                    </h4>
                    <ul className="mt-2 space-y-2 text-sm text-gray-600">
                      {analysis.reasons.length > 0 ? (
                        analysis.reasons.map((reason) => (
                          <li key={reason} className="flex gap-2">
                            <span className="mt-1 size-1.5 rounded-full bg-red-500" />
                            <span>{reason}</span>
                          </li>
                        ))
                      ) : (
                        <li>No blockers were identified.</li>
                      )}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Missing information
                    </h4>
                    <ul className="mt-2 space-y-2 text-sm text-gray-600">
                      {analysis.missingInformation.length > 0 ? (
                        analysis.missingInformation.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-1 size-1.5 rounded-full bg-amber-500" />
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li>The report included the key details needed.</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="size-4" />
                    Next step
                  </div>
                  <p className="mt-2 leading-6">{analysis.recommendation}</p>
                </div>
              </div>
            ) : null}

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
              This check is an AI screening aid. Final donation approval should
              still come from a qualified medical professional or blood bank
              staff.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
