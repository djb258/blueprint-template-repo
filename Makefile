#===============================================================================
# Blueprint Engine - Makefile
#===============================================================================
# Lean validation and emission engine for blueprint projects.
# Keeps IMO, Altitude, and CTB as first-class citizens.
#
# Usage:
#   make gate          - Run validation gates on blueprint files
#   make emit          - Emit modular JSON files from blueprint.json
#   make prompt        - Render Claude build prompt from blueprint data
#   make all           - Run gate, emit, and prompt in sequence
#   make clean         - Remove generated blueprint files
#   make help          - Show this help message
#===============================================================================

# Configuration
PYTHON := python
BLUEPRINT_SOURCE := blueprint.json
OUTPUT_DIR := blueprints/sample_blueprint
ENGINE_DIR := engine

# Python scripts
GATE_RUNNER := $(ENGINE_DIR)/gates/gate_runner.py
EMIT_STEPS := $(ENGINE_DIR)/emit/emit_steps.py
CLAUDE_PROMPT := $(ENGINE_DIR)/prompts/claude/build_v1.txt

#===============================================================================
# Primary Targets
#===============================================================================

.PHONY: all
all: emit gate prompt
	@echo ""
	@echo "=========================================="
	@echo "Blueprint Engine - All Steps Complete"
	@echo "=========================================="

.PHONY: gate
gate:
	@echo "=========================================="
	@echo "Running Gate Validation..."
	@echo "=========================================="
	$(PYTHON) $(GATE_RUNNER) $(OUTPUT_DIR)

.PHONY: emit
emit:
	@echo "=========================================="
	@echo "Emitting Blueprint Files..."
	@echo "=========================================="
	$(PYTHON) $(EMIT_STEPS) $(BLUEPRINT_SOURCE) $(OUTPUT_DIR)

.PHONY: prompt
prompt: emit
	@echo "=========================================="
	@echo "Claude Build Prompt"
	@echo "=========================================="
	@cat $(CLAUDE_PROMPT)
	@echo ""
	@echo "Blueprint files ready at: $(OUTPUT_DIR)"
	@echo "  - 01_altitude.json"
	@echo "  - 02_imo.json"
	@echo "  - 03_ctb.json"
	@echo "  - 04_stack.json"
	@echo "  - 05_build_prompt.txt"
	@echo "  - 06_ci_config.json"
	@echo "  - manifest.json"

#===============================================================================
# Utility Targets
#===============================================================================

.PHONY: clean
clean:
	@echo "Cleaning generated blueprint files..."
	@rm -rf $(OUTPUT_DIR)/*.json $(OUTPUT_DIR)/*.txt
	@echo "Done."

.PHONY: test
test: emit gate
	@echo "=========================================="
	@echo "Blueprint Engine - Test Complete"
	@echo "=========================================="

.PHONY: help
help:
	@echo "Blueprint Engine - Makefile Help"
	@echo ""
	@echo "Available targets:"
	@echo "  make all       - Run emit, gate, and prompt in sequence"
	@echo "  make gate      - Validate blueprint JSON files (gates 01-04)"
	@echo "  make emit      - Generate modular JSON files from blueprint.json"
	@echo "  make prompt    - Display Claude build prompt template"
	@echo "  make test      - Run emit and gate validation"
	@echo "  make clean     - Remove generated blueprint files"
	@echo "  make help      - Show this help message"
	@echo ""
	@echo "Configuration:"
	@echo "  BLUEPRINT_SOURCE = $(BLUEPRINT_SOURCE)"
	@echo "  OUTPUT_DIR       = $(OUTPUT_DIR)"
	@echo "  ENGINE_DIR       = $(ENGINE_DIR)"

.DEFAULT_GOAL := help
