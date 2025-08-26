# CTB (Christmas Tree Backbone) - Developer Documentation

## Doctrine Overview

The CTB system implements a doctrine-locked visualization framework with five core components:

### 🏛️ **HEIR Canopy**
**History • Enforcement • Integrity • Repair**

Overarching compliance framework that sits above all other components. Every CTB must have a HEIR canopy that defines the governance and compliance layer.

### 📊 **IMO - Vertical Planning Mechanism**
**Input → Middle (Orchestration) → Output**

**NOT** a simple input/output mapping. IMO is a *vertical planning mechanism* where:
- **Input**: What flows into the node
- **Middle**: The orchestration bay containing tools, orchestrator, contracts, promotion gates, failure handling, and observability
- **Output**: What flows out of the node

The Middle section is the core orchestration layer and should be visually emphasized.

### 🔄 **ORBT - Discipline Lens**
**Operate • Repair • Build • Train**

Applied to every node as a discipline framework:
- **Operate**: How to run the system
- **Repair**: How to fix when it breaks
- **Build**: How to enhance/extend
- **Train**: How to learn and onboard

### ⚡ **CARB - Runtime Overlay**
**Compliance • Automation • Repair • Blueprint**

Optional runtime layer that can be applied to nodes for:
- **Compliance**: Regulatory and policy adherence
- **Automation**: Automated processes and triggers
- **Repair**: Self-healing and recovery mechanisms
- **Blueprint**: Connection back to the master blueprint

### 🗄️ **Schemas Base**
**STAMPED / SPVPET / STACKED**

Foundation layer providing data persistence:
- **STAMPED**: Neon PostgreSQL (Vault/Persistence)
- **SPVPET**: Firebase (Working Memory/Real-time)
- **STACKED**: BigQuery (Analytics/Reporting)

## File Structure

```
ctb_blueprint.yaml           # Single source of truth
docs/ctb_whimsical.json     # Whimsical export format
lib/ctbSchema.ts            # Zod validation schema
app/illustration/page.tsx   # React visualization
scripts/validate-ctb.ts     # Validation script
```

## Commands

```bash
npm run validate:ctb        # Validate blueprint against doctrine
npm run illustration:dev    # Run Next.js on port 3000
```

## Development Workflow

1. **Edit Blueprint**: Modify `ctb_blueprint.yaml`
2. **Validate Locally**: Run `npm run validate:ctb`
3. **View Illustration**: Run `npm run illustration:dev` and visit `/illustration`
4. **Commit Changes**: CI will validate on PR

## Validation Rules

The validator enforces:

✅ HEIR canopy presence and structure  
✅ Vertical IMO with orchestration bay in middle  
✅ ORBT discipline on all nodes  
✅ Schema grounding (STAMPED/SPVPET/STACKED)  
✅ Promotion gates and orchestrator definitions  
✅ Constraint compliance  

## CI/CD Integration

GitHub Actions automatically:
- Validates `ctb_blueprint.yaml` on PR
- Blocks PRs that violate doctrine
- Checks schema drift and constraint violations

## Illustration Requirements

The `/illustration` route must render:

1. **HEIR Canopy Banner**: Top section with acronym explanation
2. **Star Section**: Project name and tagline
3. **Branch Sections**: Each branch with its nodes
4. **Vertical IMO Cards**: Input/Middle/Output with emphasis on Middle
5. **Middle Section**: Visually emphasized orchestration bay showing:
   - Orchestrator name
   - Tools and operations
   - Promotion gates and firebreaks
6. **ORBT Badges**: Operate/Repair/Build/Train indicators
7. **CARB Badges**: Optional compliance overlays
8. **Schema Foundation**: STAMPED/SPVPET/STACKED panel at bottom

## File Synchronization

⚠️ **Critical**: `ctb_blueprint.yaml` and `docs/ctb_whimsical.json` must stay in lockstep.

When editing either file, ensure both are updated to maintain compatibility with:
- Whimsical GPT import/export
- Illustration rendering
- Doctrine validation

## Common Issues

### ❌ "Missing vertical IMO"
Ensure all nodes have `orientation: "vertical"` and complete IMO structure.

### ❌ "Missing orchestration bay"
Each node's `IMO.middle` must contain `orchestration`, `operations`, `promotion`, `failure`, and `observability`.

### ❌ "HEIR canopy required"
Blueprint must have `heir` object with `name`, `acronym`, and `description`.

### ❌ "Schema grounding missing"
Blueprint must define all three schemas: `neon`, `firebase`, and `bigquery`.

## Architecture Principles

1. **Doctrine First**: Structure follows doctrine, not convenience
2. **Single Source**: `ctb_blueprint.yaml` is the authoritative source
3. **Visual Hierarchy**: HEIR → Star → Branches → Nodes → Schemas
4. **Validation Early**: Catch violations before merge
5. **Whimsical Compatible**: Export must work with Whimsical GPT