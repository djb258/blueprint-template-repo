# Blueprint Engine

A lean validation and emission engine for software blueprints.

## Overview

The Blueprint Engine transforms high-level project specifications into modular,
LLM-consumable artifacts that guide implementation. It validates blueprint structure
and emits small, focused files for each layer of the system.

**Core Philosophy:**
- IMO (Input → Middle → Output) as first-class citizen
- Altitude-based planning (30k, 20k, 10k, 5k feet)
- CTB (Christmas Tree Backbone) governance
- Doctrine enforcement (HEIR, ORBT, BARTON)

**What it is:** A validation and emission engine
**What it is NOT:** A deployment runtime or hosting platform

## Architecture

```
/engine
├── /gates              # Validation layer
│   └── gate_runner.py  # Validates 01-04 JSON inputs
├── /emit               # Generation layer
│   └── emit_steps.py   # Emits modular blueprint files
└── /prompts            # LLM prompt templates
    └── /claude
        └── build_v1.txt  # Claude build instructions
```

## Quick Start

### 1. Create a Blueprint

Start with `blueprint.json` at project root:

```json
{
  "project_slug": "my-project",
  "altitudes": {
    "30000": { "project_name": "...", "objective": "..." },
    "20000": { "components": [...], "roles": [...] },
    "10000": { "steps": [...], "apis_services": [...] },
    "5000": { "agent_roles": {...}, "handoffs": [...] }
  },
  "meta": {
    "doctrine": ["HEIR", "ORBT", "BARTON"]
  }
}
```

### 2. Emit Modular Files

```bash
make emit
```

This generates:
- `blueprints/<project>/01_altitude.json` - Multi-altitude plan
- `blueprints/<project>/02_imo.json` - IMO structure
- `blueprints/<project>/03_ctb.json` - CTB governance
- `blueprints/<project>/04_stack.json` - Tech stack
- `blueprints/<project>/05_build_prompt.txt` - Human-readable summary
- `blueprints/<project>/06_ci_config.json` - CI/CD config
- `blueprints/<project>/manifest.json` - File inventory with hashes

### 3. Validate Gates

```bash
make gate
```

Validates all JSON files against required schema. Fails fast if fields are missing.

### 4. Generate Build Prompt

```bash
make prompt
```

Displays the Claude build prompt template with your blueprint context.

## Makefile Targets

| Target | Description |
|--------|-------------|
| `make help` | Show available commands |
| `make emit` | Generate blueprint files from blueprint.json |
| `make gate` | Run validation on generated files |
| `make prompt` | Display Claude build prompt |
| `make all` | Run emit, gate, and prompt in sequence |
| `make test` | Run emit and gate for testing |
| `make clean` | Remove generated blueprint files |

## File Specifications

### 01_altitude.json

Multi-altitude planning breakdown:
- **30,000 ft**: Strategic vision (objectives, stakeholders, success criteria)
- **20,000 ft**: System architecture (components, roles, stages)
- **10,000 ft**: Implementation (steps, APIs, decision points, LLMs)
- **5,000 ft**: Tactical execution (documentation, agents, handoffs)

**Required Fields:**
- `altitudes.30000.project_name`
- `altitudes.30000.objective`

### 02_imo.json

Input → Middle → Output structure:

- **Input**: Data sources, external APIs, user inputs, config files
- **Middle**: Orchestration bay (tools, gates, orchestrators, decision points)
- **Output**: Deliverables, artifacts, documentation, deployments

**Required Fields:**
- `input` (object)
- `middle` (object)
- `output` (object)

### 03_ctb.json

Christmas Tree Backbone governance:

- **HEIR Canopy**: History, Enforcement, Integrity, Repair
- **Star**: Project center (name, unique ID, blueprint version)
- **Branches**: Category branches with nodes
- **Schema Foundation**: STAMPED/SPVPET/STACKED data layers

**Required Fields:**
- `heir_canopy` (object)
- `star` (object)
- `branches` (array)

### 04_stack.json

Technology stack configuration:

- Languages (Python, TypeScript, etc.)
- Frameworks (Next.js, FastAPI, etc.)
- Databases (PostgreSQL/Neon, Firebase, BigQuery)
- Deployment targets (Vercel, Render, etc.)

**Required Fields:**
- `languages` (array)
- `frameworks` (array)
- `deployment` (object)

### 05_build_prompt.txt

Human-readable build instructions summarizing:
- Project objective and altitude breakdown
- Doctrine enforcement requirements
- Build sequence steps
- Generation timestamp

### 06_ci_config.json

CI/CD pipeline configuration:
- Doctrine validation gates
- Build and test pipelines
- Deployment automation
- Notification settings

### manifest.json

File inventory with:
- SHA256 hashes for integrity verification
- File sizes and types
- Generation timestamp
- Total file count and size

## Design Principles

### 1. Modular Files (< 10 KB each)

Each emitted file is small and focused, optimized for LLM consumption.

### 2. Fail Fast Validation

Gate runner exits immediately on validation failure with clear error messages.

### 3. Standard Library Only

No external dependencies. Python 3.11+ standard library only (`json`, `hashlib`, `pathlib`).

### 4. Doctrine-Locked

Blueprint structure follows HEIR/ORBT/BARTON doctrine and cannot be modified
during emission.

### 5. Version Integrity

Manifest tracks SHA256 hashes of all files for tamper detection.

## Extending the Engine

### Adding a New Gate

Edit `engine/gates/gate_runner.py`:

```python
def validate_new_gate(self, data: Dict[str, Any]) -> bool:
    """Validate 05_new_gate.json structure."""
    passed = True

    if "required_field" not in data:
        self.errors.append("05_new_gate.json: Missing required_field")
        passed = False

    return passed
```

Add to gates list in `run_all_gates()`.

### Adding a New Emission Step

Edit `engine/emit/emit_steps.py`:

```python
def emit_new_step(self) -> bool:
    """Emit 07_new_step.json."""
    data = {
        "field": self.blueprint_data.get("source_field", "default")
    }
    return self._write_json_file("07_new_step.json", data)
```

Add to `emit_all()` results list.

### Custom Prompt Template

Create new template in `engine/prompts/<model>/`:
- `engine/prompts/gpt/build_v1.txt`
- `engine/prompts/gemini/build_v1.txt`

Update Makefile to reference new template.

## Doctrine Reference

### HEIR (Governance)
- **History**: Audit trails and lineage tracking
- **Enforcement**: Compliance checks and validation
- **Integrity**: Data verification and consistency
- **Repair**: Self-healing and recovery mechanisms

### ORBT (Discipline)
- **Operate**: How to run the system
- **Repair**: How to fix issues
- **Build**: How to enhance features
- **Train**: How to learn and improve

### BARTON (ID Generation)
Unique ID format: `DB/HIVE/SUB/PROC-YYYYMMDD-HHMMSS-XXXX`

### Schema Layers
- **STAMPED**: Neon/PostgreSQL (Vault - persistent storage)
- **SPVPET**: Firebase (Workbench - real-time data)
- **STACKED**: BigQuery (Warehouse - analytics)

## Examples

See `/examples` directory for:
- `examples/deployment/` - Vercel, Render, Firebase configs
- `examples/mcp-servers/` - MCP server implementations
- `examples/ui-components/` - Next.js/React components

## Contributing

The engine follows strict conventions:
1. Standard library only (no external dependencies)
2. Python 3.11+ compatible
3. Type hints required
4. Max 10 KB per emitted file
5. Fail fast on validation errors

## License

MIT License - See LICENSE file for details
