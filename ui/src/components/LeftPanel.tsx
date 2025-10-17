// BLOCK MAP:
// - gpt-panel-001: Main GPT panel container
// - gpt-header-002: GPT panel header section
// - gpt-launch-003: GPT launch button and instructions

import { ExternalLink, MessageSquare } from "lucide-react";
import { BLOCK_IDS } from "@/lib/blockIds";

const LeftPanel = () => {
  const gptUrl = "https://chat.openai.com/g/g-68f236b4203481918da47184a9045743-blueprint-brainstorm-gpt";

  const openGPT = () => {
    window.open(gptUrl, "_blank", "noopener,noreferrer");
  };

  return (
    /* BLOCK_ID: gpt-panel-001 */
    <div 
      data-block-id={BLOCK_IDS.GPT_PANEL}
      className="h-full bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col"
    >
      {/* BLOCK_ID: gpt-header-002 */}
      <div 
        data-block-id={BLOCK_IDS.GPT_HEADER}
        className="px-6 py-4 border-b border-border bg-card"
      >
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span>🧠</span>
          <span>Blueprint Brainstorm GPT</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Capture ideas and generate structured JSON blueprints
        </p>
      </div>
      
      {/* BLOCK_ID: gpt-launch-003 */}
      <div 
        data-block-id={BLOCK_IDS.GPT_LAUNCH}
        className="flex-1 p-6 flex items-center justify-center bg-muted/20"
      >
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Launch Blueprint Brainstorm GPT
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Due to browser security restrictions, the GPT opens in a new window. 
              Once you generate your blueprint JSON, copy it and paste it into the right panel.
            </p>
          </div>

          <button
            onClick={openGPT}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
          >
            <span>Open Blueprint GPT</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Keep the GPT window open while working in this console
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
