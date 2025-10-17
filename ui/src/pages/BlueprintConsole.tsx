// BLOCK MAP:
// - console-main-001: Main console container
// - console-grid-002: Two-panel grid layout
// - edit-mode-button-001: Edit mode helper button

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import { BLOCK_IDS } from "@/lib/blockIds";
import { getAllBlockElements } from "@/lib/getBlockElement";
import { Code2, X } from "lucide-react";
import { toast } from "sonner";

const BlueprintConsole = () => {
  const [showEditHelper, setShowEditHelper] = useState(false);

  // Add visual indicators to all blocks when edit mode is active
  useEffect(() => {
    if (showEditHelper) {
      const blocks = getAllBlockElements();
      
      blocks.forEach((block) => {
        const id = block.getAttribute("data-block-id");
        if (!id) return;

        // Create badge element
        const badge = document.createElement("div");
        badge.className = "block-id-badge";
        badge.textContent = id;
        badge.style.cssText = `
          position: absolute;
          top: 4px;
          left: 4px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
          font-family: monospace;
          z-index: 9999;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
          transition: all 0.2s;
          pointer-events: auto;
        `;

        // Add hover effect
        badge.addEventListener("mouseenter", () => {
          badge.style.transform = "scale(1.05)";
          badge.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.6)";
        });

        badge.addEventListener("mouseleave", () => {
          badge.style.transform = "scale(1)";
          badge.style.boxShadow = "0 2px 8px rgba(139, 92, 246, 0.4)";
        });

        // Click to copy ID
        badge.addEventListener("click", (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(id);
          toast.success(`Copied: ${id}`);
          badge.style.background = "linear-gradient(135deg, #10b981, #059669)";
          setTimeout(() => {
            badge.style.background = "linear-gradient(135deg, #8b5cf6, #6366f1)";
          }, 500);
        });

        // Make parent position relative if it isn't already
        const position = window.getComputedStyle(block).position;
        if (position === "static") {
          block.style.position = "relative";
        }

        // Add highlight outline
        block.style.outline = "2px dashed rgba(139, 92, 246, 0.4)";
        block.style.outlineOffset = "2px";

        block.appendChild(badge);
      });
    } else {
      // Clean up badges and outlines
      const badges = document.querySelectorAll(".block-id-badge");
      badges.forEach((badge) => badge.remove());

      const blocks = getAllBlockElements();
      blocks.forEach((block) => {
        block.style.outline = "";
        block.style.outlineOffset = "";
      });
    }

    return () => {
      // Cleanup on unmount
      const badges = document.querySelectorAll(".block-id-badge");
      badges.forEach((badge) => badge.remove());

      const blocks = getAllBlockElements();
      blocks.forEach((block) => {
        block.style.outline = "";
        block.style.outlineOffset = "";
      });
    };
  }, [showEditHelper]);

  const copyBlockList = () => {
    const blocks = getAllBlockElements();
    const blockList = blocks
      .map((el) => {
        const id = el.getAttribute("data-block-id");
        const tagName = el.tagName.toLowerCase();
        return `${id} - <${tagName}>`;
      })
      .join("\n");

    navigator.clipboard.writeText(blockList);
    toast.success("Copied all block IDs to clipboard");
  };

  return (
    /* BLOCK_ID: console-main-001 */
    <div 
      data-block-id={BLOCK_IDS.CONSOLE_MAIN}
      className="min-h-screen bg-background flex flex-col"
    >
      <Header />
      
      {/* BLOCK_ID: console-grid-002 */}
      <main 
        data-block-id={BLOCK_IDS.CONSOLE_GRID}
        className="flex-1 p-6 overflow-hidden"
      >
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(100vh-8rem)]">
          <LeftPanel />
          <RightPanel />
        </div>
      </main>

      {/* BLOCK_ID: edit-mode-button-001 */}
      <button
        data-block-id={BLOCK_IDS.EDIT_MODE_BUTTON}
        onClick={() => setShowEditHelper(!showEditHelper)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50"
        title={showEditHelper ? "Exit Edit Mode" : "Enter Edit Mode"}
      >
        {showEditHelper ? (
          <X className="w-5 h-5" />
        ) : (
          <Code2 className="w-5 h-5" />
        )}
      </button>

      {/* Edit Mode Helper Panel */}
      {showEditHelper && (
        <div className="fixed bottom-24 right-6 w-96 bg-card border border-border rounded-xl shadow-2xl p-6 z-50 max-h-[600px] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Edit Mode Active
            </h3>
            <button
              onClick={() => setShowEditHelper(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700 rounded-lg p-3">
              <p className="text-sm text-purple-900 dark:text-purple-200 font-medium">
                ✨ Block IDs are now visible on the page!
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                Click any badge to copy its ID
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="mb-3">
                Tell me which block to edit using these IDs:
              </p>
              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <p className="font-medium text-foreground mb-2">Example prompts:</p>
                <ul className="space-y-1 text-xs">
                  <li>• "Change the color of block gpt-launch-003"</li>
                  <li>• "Add a tooltip to block engine-actions-006"</li>
                  <li>• "Update the text in block engine-header-002"</li>
                </ul>
              </div>
            </div>

            <button
              onClick={copyBlockList}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm font-medium"
            >
              Copy All Block IDs
            </button>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Available Blocks:</h4>
              <div className="space-y-2 max-h-80 overflow-auto">
                {Object.entries(BLOCK_IDS).map(([key, id]) => (
                  <div
                    key={id}
                    className="text-xs p-2 bg-muted/30 rounded border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(id);
                      toast.success(`Copied: ${id}`);
                    }}
                  >
                    <code className="text-primary font-mono">{id}</code>
                    <div className="text-muted-foreground mt-1">
                      {key.replace(/_/g, " ").toLowerCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlueprintConsole;


