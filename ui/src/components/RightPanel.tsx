// BLOCK MAP:
// - engine-panel-001: Main engine panel container
// - engine-header-002: Engine panel header with title
// - engine-status-003: Status pill indicator
// - engine-project-input-004: Project name input field
// - engine-json-input-005: Blueprint JSON textarea
// - engine-actions-006: Validate and Emit buttons
// - engine-progress-007: Progress bar indicator
// - engine-output-list-008: Output files display
// - engine-promotion-009: IMO-Creator promotion button
// - engine-footer-010: Footer with version info

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Copy, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { BLOCK_IDS } from "@/lib/blockIds";

type Status = "draft" | "validated" | "emitted";

const RightPanel = () => {
  const [input, setInput] = useState("");
  const [projectName, setProjectName] = useState("blueprint-project");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>("draft");
  const [outputs, setOutputs] = useState<Record<string, string> | null>(null);

  const downloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(`Downloaded ${fileName}`);
  };

  const copyToClipboard = async (content: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`Copied ${fileName} to clipboard`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const validateBlueprint = async () => {
    if (!input.trim()) {
      toast.error("Please paste JSON blueprint data first");
      return;
    }

    setLoading(true);
    try {
      // Parse and validate JSON
      const intakeJson = JSON.parse(input);

      // Simulate validation delay
      await new Promise((r) => setTimeout(r, 1200));

      // Save to Supabase
      const { error: dbError } = await supabase
        .from("blueprints")
        .upsert(
          {
            project_name: projectName,
            intake_json: intakeJson,
            status: "validated",
          },
          { onConflict: "project_name" }
        );

      if (dbError) throw dbError;

      setStatus("validated");
      toast.success("Blueprint validated successfully", {
        description: "Ready for emission",
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Validation Failed", {
        description: error instanceof Error ? error.message : "Invalid JSON format",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const emitBlueprint = async () => {
    if (!input.trim()) {
      toast.error("Please paste JSON blueprint data first");
      return;
    }

    setLoading(true);
    try {
      const intakeJson = JSON.parse(input);

      // Simulate emission delay
      await new Promise((r) => setTimeout(r, 1800));

      // Simulate emitted files with realistic Blueprint Engine structure
      const fakeOutputs = {
        "01_altitude.json": JSON.stringify(
          {
            altitude: {
              context: intakeJson.context || "Project context from blueprint",
              goals: intakeJson.goals || ["Primary objective", "Secondary objective"],
              constraints: ["Time constraints", "Resource constraints"],
            },
            metadata: {
              generated_at: new Date().toISOString(),
              version: "1.0.0",
            },
          },
          null,
          2
        ),
        "02_imo.json": JSON.stringify(
          {
            input: intakeJson.input || [
              { type: "user_request", source: "brainstorm_gpt" },
            ],
            middle: [
              { stage: "validation", status: "complete" },
              { stage: "transformation", status: "complete" },
            ],
            output: [
              { type: "structured_files", count: 3 },
              { type: "manifest", status: "generated" },
            ],
          },
          null,
          2
        ),
        "manifest.json": JSON.stringify(
          {
            project_name: projectName,
            version: "v1.0.0",
            generated_at: new Date().toISOString(),
            files: ["01_altitude.json", "02_imo.json", "manifest.json"],
            status: "emitted",
            blueprint_engine_version: "1.0",
          },
          null,
          2
        ),
      };

      setOutputs(fakeOutputs);

      // Update Supabase with outputs
      const { error: dbError } = await supabase
        .from("blueprints")
        .update({
          outputs: fakeOutputs,
          status: "emitted",
        })
        .eq("project_name", projectName);

      if (dbError) throw dbError;

      setStatus("emitted");
      toast.success("Emission Complete", {
        description: `Generated ${Object.keys(fakeOutputs).length} output files`,
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
    } catch (error) {
      console.error("Emission error:", error);
      toast.error("Emission Failed", {
        description: error instanceof Error ? error.message : "Invalid JSON format",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToIMO = () => {
    toast.info("Promotion available soon inside Lovable", {
      description: "IMO-Creator integration coming in next release",
    });
  };

  const getStatusStyles = () => {
    switch (status) {
      case "emitted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "validated":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    /* BLOCK_ID: engine-panel-001 */
    <div 
      data-block-id={BLOCK_IDS.ENGINE_PANEL}
      className="h-full bg-card rounded-xl border border-border shadow-md p-6 overflow-auto"
    >
      <div className="flex flex-col gap-6">
        {/* Header with Status */}
        <div className="flex items-start justify-between">
          {/* BLOCK_ID: engine-header-002 */}
          <div data-block-id={BLOCK_IDS.ENGINE_HEADER}>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <span>⚙️</span>
              <span>Blueprint Engine Stage</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Paste the JSON output from the Brainstorm GPT below, then validate or emit
              structured files.
            </p>
          </div>
          {/* BLOCK_ID: engine-status-003 */}
          <span
            data-block-id={BLOCK_IDS.ENGINE_STATUS}
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border transition-all ${getStatusStyles()}`}
          >
            {status.toUpperCase()}
          </span>
        </div>

        {/* Project Name Input */}
        {/* BLOCK_ID: engine-project-input-004 */}
        <div data-block-id={BLOCK_IDS.ENGINE_PROJECT_INPUT}>
          <label className="text-sm font-medium text-foreground mb-1.5 block">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
            placeholder="blueprint-project"
          />
        </div>

        {/* Blueprint JSON Input */}
        {/* BLOCK_ID: engine-json-input-005 */}
        <div data-block-id={BLOCK_IDS.ENGINE_JSON_INPUT}>
          <label className="text-sm font-medium text-foreground mb-1.5 block">
            Blueprint JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste blueprint_intake.json here...\n\nExample:\n{\n  "context": "Project description",\n  "goals": ["Goal 1", "Goal 2"],\n  "input": [...]\n}'
            className="w-full h-64 p-4 font-mono text-sm bg-background border border-input rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
          />
        </div>

        {/* Action Buttons */}
        {/* BLOCK_ID: engine-actions-006 */}
        <div data-block-id={BLOCK_IDS.ENGINE_ACTIONS} className="flex gap-3">
          <button
            onClick={validateBlueprint}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && status !== "emitted" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Validate
          </button>
          <button
            onClick={emitBlueprint}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && status === "validated" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Emit
          </button>
        </div>

        {/* Progress Indicator */}
        {/* BLOCK_ID: engine-progress-007 */}
        {loading && (
          <div 
            data-block-id={BLOCK_IDS.ENGINE_PROGRESS}
            className="w-full h-1 bg-muted rounded-full overflow-hidden"
          >
            <div className="h-full bg-primary animate-pulse" style={{ width: "70%" }} />
          </div>
        )}

        {/* Output Preview */}
        {/* BLOCK_ID: engine-output-list-008 */}
        <div 
          data-block-id={BLOCK_IDS.ENGINE_OUTPUT_LIST}
          className="border border-border rounded-xl p-5 bg-muted/30 min-h-[200px]"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Output Preview</h3>
          {outputs ? (
            <div className="space-y-3">
              {Object.entries(outputs).map(([file, content]) => (
                <div
                  key={file}
                  className="p-4 border border-border rounded-lg bg-card shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-medium text-sm text-foreground flex items-center gap-2">
                      <span className="text-primary">📄</span>
                      <span>{file}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(content, file)}
                        className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:bg-secondary/80 transition-all flex items-center gap-1.5 font-medium"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>
                      <button
                        onClick={() => downloadFile(file, content)}
                        className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-all flex items-center gap-1.5 font-medium"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    </div>
                  </div>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-auto max-h-40 font-mono bg-background p-3 rounded border border-border">
                    {content.slice(0, 400)}
                    {content.length > 400 && "\n..."}
                  </pre>
                </div>
              ))}

              {/* Promote to IMO Button */}
              {/* BLOCK_ID: engine-promotion-009 */}
              <button
                data-block-id={BLOCK_IDS.ENGINE_PROMOTION}
                onClick={handlePromoteToIMO}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                <span>Promote to IMO-Creator</span>
                <span className="text-xs opacity-80">(coming soon)</span>
              </button>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm text-center py-12">
              <div className="font-medium mb-1">No outputs yet</div>
              <div className="text-xs">Click "Emit" to generate blueprint files</div>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* BLOCK_ID: engine-footer-010 */}
        <div 
          data-block-id={BLOCK_IDS.ENGINE_FOOTER}
          className="text-center text-xs text-muted-foreground pt-4 border-t border-border"
        >
          Blueprint Engine v1.0 | All operations local in Lovable.dev
        </div>
      </div>
    </div>
  );
};

export default RightPanel;

