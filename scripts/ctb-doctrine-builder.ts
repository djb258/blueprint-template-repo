#!/usr/bin/env tsx

/**
 * CTB Doctrine Builder - Doctrine-locked Christmas Tree Backbone System
 * HEIR Canopy • Vertical IMO • ORBT Discipline • CARB Runtime • Schema Grounding
 */

import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { createHash } from 'crypto'
import * as yaml from 'js-yaml'

// ================== DOCTRINE SCHEMAS ==================

// HEIR Canopy Schema - History • Enforcement • Integrity • Repair
const HEIRSchema = z.object({
  history: z.object({
    decisions: z.array(z.string()),
    evolution: z.array(z.string()),
    lessons_learned: z.array(z.string())
  }),
  enforcement: z.object({
    policies: z.array(z.string()),
    compliance_gates: z.array(z.string()),
    violation_handlers: z.array(z.string())
  }),
  integrity: z.object({
    validations: z.array(z.string()),
    audit_trails: z.array(z.string()),
    checksums: z.array(z.string())
  }),
  repair: z.object({
    failure_modes: z.array(z.string()),
    recovery_procedures: z.array(z.string()),
    rollback_plans: z.array(z.string())
  })
})

// IMO Middle Orchestration Bay Schema
const IMOMiddleSchema = z.object({
  orchestration: z.object({
    orchestrator: z.string(),
    subagents: z.array(z.string()).optional(),
    tools: z.array(z.string()),
    playbook: z.array(z.string())
  }),
  operations: z.array(z.object({
    title: z.string(),
    tool: z.string(),
    computation: z.string(),
    inputs: z.array(z.string()).optional(),
    outputs: z.array(z.string()).optional()
  })),
  contracts: z.object({
    preconditions: z.array(z.string()),
    postconditions: z.array(z.string()),
    io_contracts: z.object({
      input_contract: z.array(z.string()).optional(),
      output_contract: z.array(z.string()).optional()
    }).optional()
  }),
  promotion: z.object({
    gate: z.boolean(),
    rules: z.array(z.string()),
    destinations: z.array(z.string()),
    human_firebreak: z.boolean()
  }),
  failure: z.object({
    failure_modes: z.array(z.string()),
    retries: z.number(),
    fallback_plan: z.array(z.string()),
    incident_log: z.string()
  }),
  observability: z.object({
    metrics: z.array(z.string()),
    logs: z.array(z.string()),
    trace_fields: z.array(z.string())
  }),
  tempo_sla: z.string().optional()
})

// Vertical IMO Schema - Input → Middle → Output
const IMOSchema = z.object({
  input: z.array(z.string()),
  middle: IMOMiddleSchema,
  output: z.array(z.string())
})

// ORBT Discipline Schema - Operate • Repair • Build • Train
const ORBTSchema = z.object({
  operate: z.array(z.string()),
  repair: z.array(z.string()),
  build: z.array(z.string()),
  train: z.array(z.string())
})

// CARB Runtime Overlay Schema - Compliance • Automation • Repair • Blueprint
const CARBSchema = z.object({
  compliance: z.array(z.string()),
  automation: z.array(z.string()),
  repair: z.array(z.string()),
  blueprint: z.array(z.string())
})

// Schema Grounding - STAMPED/SPVPET/STACKED
const SchemaGroundingSchema = z.object({
  neon: z.object({
    name: z.literal("STAMPED (Vault)"),
    sample_tables: z.array(z.object({
      table: z.string(),
      key_columns: z.array(z.string())
    }))
  }),
  firebase: z.object({
    name: z.literal("SPVPET (Working Memory)"),
    sample_collections: z.array(z.object({
      collection: z.string(),
      key_fields: z.array(z.string())
    }))
  }),
  bigquery: z.object({
    name: z.literal("STACKED (Analytics)"),
    sample_datasets: z.array(z.object({
      dataset: z.string(),
      key_fields: z.array(z.string())
    }))
  })
})

// Node Schema with all doctrine components
const CTBNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  altitude: z.string(),
  orientation: z.literal("vertical"),
  IMO: IMOSchema,
  ORBT: ORBTSchema,
  CARB: CARBSchema,
  links: z.object({
    repo: z.string().url(),
    render_endpoint: z.string().url(),
    firebase_doc: z.string().optional(),
    neon_table: z.string().optional()
  }),
  badges: z.array(z.string())
})

// Branch Schema
const CTBBranchSchema = z.object({
  id: z.string(),
  name: z.string(),
  altitude: z.string(),
  render_hints: z.object({
    icon: z.string()
  }),
  nodes: z.array(CTBNodeSchema)
})

// Complete CTB Blueprint Schema
const CTBDoctrineBlueprintSchema = z.object({
  meta: z.object({
    spec_version: z.string(),
    doctrine_lock: z.boolean(),
    notes: z.array(z.string())
  }),
  heir: z.object({
    name: z.string(),
    acronym: z.string(),
    description: z.string(),
    render_hints: z.object({
      style: z.string(),
      badge: z.string(),
      legend: z.boolean()
    })
  }),
  star: z.object({
    id: z.string(),
    name: z.string(),
    altitude: z.string(),
    tagline: z.string(),
    render_hints: z.object({
      icon: z.string(),
      emphasis: z.boolean()
    })
  }),
  branches: z.array(CTBBranchSchema),
  schemas: SchemaGroundingSchema,
  legend: z.object({
    altitudes: z.array(z.object({
      label: z.string(),
      description: z.string()
    })),
    acronyms: z.record(z.string())
  }),
  constraints: z.object({
    require_heir_canopy: z.boolean(),
    require_vertical_imo: z.boolean(),
    require_orbt_per_node: z.boolean(),
    require_middle_operations: z.boolean(),
    require_schemas_base: z.boolean(),
    allow_carb_optional: z.boolean()
  }),
  render_hints: z.object({
    layout: z.string(),
    imo_stack_style: z.string(),
    branch_alignment: z.string(),
    schema_band_position: z.string(),
    colors: z.record(z.string()),
    emphasis: z.object({
      middle_column_scale: z.number(),
      middle_highlight: z.boolean()
    })
  }),
  telemetry: z.object({
    trace_id: z.string(),
    version_hash: z.string(),
    timestamp_iso: z.string()
  })
})

// ================== DOCTRINE ENFORCEMENT ==================

export class CTBDoctrineBuilder {
  private doctrineViolations: string[] = []
  
  /**
   * Validate blueprint against doctrine constraints
   */
  validateDoctrine(blueprint: any): { valid: boolean; violations: string[] } {
    this.doctrineViolations = []
    
    try {
      // Schema validation
      const result = CTBDoctrineBlueprintSchema.safeParse(blueprint)
      if (!result.success) {
        result.error.errors.forEach(error => {
          this.doctrineViolations.push(`Schema: ${error.path.join('.')}: ${error.message}`)
        })
      }
      
      // Doctrine constraint validation
      if (blueprint.constraints) {
        if (blueprint.constraints.require_heir_canopy && !blueprint.heir) {
          this.doctrineViolations.push("DOCTRINE: HEIR canopy is required but missing")
        }
        
        if (blueprint.constraints.require_vertical_imo) {
          blueprint.branches?.forEach((branch: any) => {
            branch.nodes?.forEach((node: any) => {
              if (!node.IMO || node.orientation !== "vertical") {
                this.doctrineViolations.push(`DOCTRINE: Node ${node.label} must have vertical IMO`)
              }
              
              // Validate IMO middle orchestration bay
              if (!node.IMO?.middle?.orchestration) {
                this.doctrineViolations.push(`DOCTRINE: Node ${node.label} missing orchestration bay`)
              }
              
              if (!node.IMO?.middle?.operations?.length) {
                this.doctrineViolations.push(`DOCTRINE: Node ${node.label} missing operations`)
              }
              
              if (!node.IMO?.middle?.promotion?.gate) {
                this.doctrineViolations.push(`DOCTRINE: Node ${node.label} missing promotion gate`)
              }
            })
          })
        }
        
        if (blueprint.constraints.require_orbt_per_node) {
          blueprint.branches?.forEach((branch: any) => {
            branch.nodes?.forEach((node: any) => {
              if (!node.ORBT) {
                this.doctrineViolations.push(`DOCTRINE: Node ${node.label} missing ORBT discipline`)
              }
            })
          })
        }
        
        if (blueprint.constraints.require_schemas_base) {
          if (!blueprint.schemas?.neon || !blueprint.schemas?.firebase || !blueprint.schemas?.bigquery) {
            this.doctrineViolations.push("DOCTRINE: Schema grounding (STAMPED/SPVPET/STACKED) required")
          }
        }
      }
      
    } catch (error) {
      this.doctrineViolations.push(`Validation error: ${error}`)
    }
    
    return {
      valid: this.doctrineViolations.length === 0,
      violations: this.doctrineViolations
    }
  }
  
  /**
   * Render doctrine-locked CTB diagram
   */
  renderDoctrineCTB(blueprint: any): string {
    const lines: string[] = []
    
    // HEIR Canopy
    lines.push("```")
    lines.push("═══════════════════ HEIR CANOPY ═══════════════════")
    lines.push("History • Enforcement • Integrity • Repair")
    lines.push("═══════════════════════════════════════════════════")
    lines.push("")
    
    // Star
    lines.push(`        ${blueprint.star?.render_hints?.icon || "⭐"} ${blueprint.star?.name}`)
    lines.push(`        ${blueprint.star?.tagline || ""}`)
    lines.push("       /|\\")
    lines.push("      / | \\")
    lines.push("     /  |  \\")
    lines.push("    /   |   \\")
    lines.push("   /_   |   _\\")
    lines.push("      \\ | /")
    lines.push("       \\|/")
    lines.push("        |")
    lines.push("")
    
    // Branches and Nodes
    blueprint.branches?.forEach((branch: any, branchIndex: number) => {
      const isLast = branchIndex === blueprint.branches.length - 1
      const branchSymbol = isLast ? "└─" : "├─"
      
      lines.push(`        ${branchSymbol} ${branch.render_hints?.icon || "🌿"} ${branch.name} [${branch.altitude}]`)
      
      branch.nodes?.forEach((node: any, nodeIndex: number) => {
        const isLastNode = nodeIndex === branch.nodes.length - 1
        const nodeSymbol = isLastNode ? "   └─" : "   ├─"
        const prefix = isLast ? "        " : "        │"
        
        lines.push(`${prefix}${nodeSymbol} 🔷 ${node.label} [${node.altitude}]`)
        
        const nodePrefix = isLastNode ? "     " : "   │ "
        
        // Vertical IMO Structure
        lines.push(`${prefix}${nodePrefix}`)
        lines.push(`${prefix}${nodePrefix}   ┌─── INPUT ───┐`)
        node.IMO?.input?.forEach((input: string) => {
          lines.push(`${prefix}${nodePrefix}   │ • ${input}`)
        })
        
        lines.push(`${prefix}${nodePrefix}   ├─── MIDDLE (Orchestration Bay) ───┤`)
        lines.push(`${prefix}${nodePrefix}   │ 🎭 Orchestrator: ${node.IMO?.middle?.orchestration?.orchestrator}`)
        lines.push(`${prefix}${nodePrefix}   │ 🔧 Tools: ${node.IMO?.middle?.orchestration?.tools?.join(", ")}`)
        lines.push(`${prefix}${nodePrefix}   │ 📋 Operations:`)
        node.IMO?.middle?.operations?.forEach((op: any) => {
          lines.push(`${prefix}${nodePrefix}   │   • ${op.title}: ${op.computation}`)
        })
        lines.push(`${prefix}${nodePrefix}   │ 🚪 Promotion Gate: ${node.IMO?.middle?.promotion?.gate ? "✅" : "❌"}`)
        lines.push(`${prefix}${nodePrefix}   │ 🔥 Human Firebreak: ${node.IMO?.middle?.promotion?.human_firebreak ? "✅" : "❌"}`)
        
        lines.push(`${prefix}${nodePrefix}   └─── OUTPUT ───┘`)
        node.IMO?.output?.forEach((output: string) => {
          lines.push(`${prefix}${nodePrefix}   │ → ${output}`)
        })
        
        // ORBT Discipline
        lines.push(`${prefix}${nodePrefix}`)
        lines.push(`${prefix}${nodePrefix}   [ORBT Discipline]`)
        lines.push(`${prefix}${nodePrefix}   🔄 Operate: ${node.ORBT?.operate?.join(" • ")}`)
        lines.push(`${prefix}${nodePrefix}   🔧 Repair: ${node.ORBT?.repair?.join(" • ")}`)
        lines.push(`${prefix}${nodePrefix}   🏗️ Build: ${node.ORBT?.build?.join(" • ")}`)
        lines.push(`${prefix}${nodePrefix}   📚 Train: ${node.ORBT?.train?.join(" • ")}`)
        
        // CARB Runtime Overlay
        if (node.CARB && Object.values(node.CARB).some((v: any) => v?.length > 0)) {
          lines.push(`${prefix}${nodePrefix}`)
          lines.push(`${prefix}${nodePrefix}   [CARB Runtime]`)
          if (node.CARB.compliance?.length > 0) {
            lines.push(`${prefix}${nodePrefix}   ✓ Compliance: ${node.CARB.compliance.join(" • ")}`)
          }
          if (node.CARB.automation?.length > 0) {
            lines.push(`${prefix}${nodePrefix}   ⚡ Automation: ${node.CARB.automation.join(" • ")}`)
          }
        }
        
        // Badges
        if (node.badges?.length > 0) {
          lines.push(`${prefix}${nodePrefix}`)
          lines.push(`${prefix}${nodePrefix}   🏷️ ${node.badges.join(" • ")}`)
        }
        
        if (!isLastNode) {
          lines.push(`${prefix}${nodePrefix}`)
        }
      })
    })
    
    // Trunk and Schema Grounding
    lines.push("")
    lines.push("        |")
    lines.push("      [TRUNK]")
    lines.push("   _____|_____")
    lines.push("  /           \\")
    lines.push(" /   SCHEMAS   \\")
    lines.push("/_______________\\")
    lines.push("│ 🗄️ STAMPED    │ Neon PostgreSQL (Vault)")
    lines.push("│ 📝 SPVPET     │ Firebase (Working Memory)")
    lines.push("│ 📊 STACKED    │ BigQuery (Analytics)")
    lines.push("└───────────────┘")
    lines.push("```")
    
    return lines.join('\n')
  }
  
  /**
   * Generate Whimsical-compatible JSON
   */
  generateWhimsicalJSON(blueprint: any): any {
    const nodes: any[] = []
    const edges: any[] = []
    let nodeId = 0
    
    // Add HEIR canopy as top node
    const heirNode = {
      id: `node_${nodeId++}`,
      type: "canopy",
      label: "HEIR",
      subtitle: blueprint.heir?.acronym,
      style: {
        backgroundColor: "#2E8B57",
        textColor: "white",
        border: "3px solid #1C5A3A",
        shape: "trapezoid"
      }
    }
    nodes.push(heirNode)
    
    // Add star
    const starNode = {
      id: `node_${nodeId++}`,
      type: "star",
      label: blueprint.star?.name,
      subtitle: blueprint.star?.tagline,
      style: {
        backgroundColor: "#FFD700",
        shape: "star",
        size: "large"
      }
    }
    nodes.push(starNode)
    edges.push({
      from: heirNode.id,
      to: starNode.id,
      style: "dotted"
    })
    
    // Add branches and nodes
    blueprint.branches?.forEach((branch: any) => {
      const branchNode = {
        id: `node_${nodeId++}`,
        type: "branch",
        label: branch.name,
        altitude: branch.altitude,
        style: {
          backgroundColor: "#228B22",
          shape: "rounded"
        }
      }
      nodes.push(branchNode)
      edges.push({
        from: starNode.id,
        to: branchNode.id,
        style: "solid"
      })
      
      branch.nodes?.forEach((node: any) => {
        const ctbNode = {
          id: `node_${nodeId++}`,
          type: "node",
          label: node.label,
          altitude: node.altitude,
          imo: {
            input: node.IMO?.input,
            middle: {
              orchestrator: node.IMO?.middle?.orchestration?.orchestrator,
              tools: node.IMO?.middle?.orchestration?.tools
            },
            output: node.IMO?.output
          },
          orbt: node.ORBT,
          carb: node.CARB,
          badges: node.badges,
          style: {
            backgroundColor: "#4169E1",
            shape: "rectangle",
            verticalLayout: true
          }
        }
        nodes.push(ctbNode)
        edges.push({
          from: branchNode.id,
          to: ctbNode.id,
          style: "solid"
        })
      })
    })
    
    // Add schema foundation
    const schemaNode = {
      id: `node_${nodeId++}`,
      type: "foundation",
      label: "Schema Grounding",
      schemas: ["STAMPED (Neon)", "SPVPET (Firebase)", "STACKED (BigQuery)"],
      style: {
        backgroundColor: "#8B4513",
        shape: "trapezoid",
        position: "bottom"
      }
    }
    nodes.push(schemaNode)
    edges.push({
      from: starNode.id,
      to: schemaNode.id,
      style: "solid",
      label: "grounded in"
    })
    
    return {
      diagram_type: "flowchart",
      theme: "christmas_tree",
      layout: "hierarchical",
      nodes,
      edges,
      metadata: {
        version_hash: blueprint.telemetry?.version_hash,
        trace_id: blueprint.telemetry?.trace_id,
        generated_at: new Date().toISOString()
      }
    }
  }
  
  /**
   * Generate version hash for blueprint
   */
  generateVersionHash(blueprint: any): string {
    const content = JSON.stringify(blueprint, Object.keys(blueprint).sort())
    return createHash('sha256').update(content).digest('hex').substring(0, 16)
  }
  
  /**
   * Load and process YAML blueprint
   */
  async loadYAMLBlueprint(filePath: string): Promise<any> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const blueprint = yaml.load(content)
      
      // Add telemetry if missing
      if (!blueprint.telemetry) {
        blueprint.telemetry = {}
      }
      blueprint.telemetry.version_hash = this.generateVersionHash(blueprint)
      blueprint.telemetry.timestamp_iso = new Date().toISOString()
      
      return blueprint
    } catch (error) {
      throw new Error(`Failed to load YAML blueprint: ${error}`)
    }
  }
  
  /**
   * CI/CD enforcement check
   */
  async enforceDoctrineCI(blueprintPath: string): Promise<{ pass: boolean; report: any }> {
    const blueprint = await this.loadYAMLBlueprint(blueprintPath)
    const validation = this.validateDoctrine(blueprint)
    
    const report = {
      pass: validation.valid,
      violations: validation.violations,
      version_hash: blueprint.telemetry?.version_hash,
      timestamp: new Date().toISOString(),
      enforcement: {
        heir_canopy: !validation.violations.some(v => v.includes("HEIR canopy")),
        vertical_imo: !validation.violations.some(v => v.includes("vertical IMO")),
        orbt_discipline: !validation.violations.some(v => v.includes("ORBT discipline")),
        schema_grounding: !validation.violations.some(v => v.includes("Schema grounding")),
        promotion_gates: !validation.violations.some(v => v.includes("promotion gate"))
      }
    }
    
    // Write enforcement report
    const reportPath = path.join(path.dirname(blueprintPath), 'doctrine-enforcement-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    
    return { pass: validation.valid, report }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  
  if (!command) {
    console.log(`
🎄 CTB Doctrine Builder - Doctrine-locked Christmas Tree Backbone

Commands:
  validate <blueprint.yaml>     Validate blueprint against doctrine
  render <blueprint.yaml>       Render doctrine CTB diagram  
  whimsical <blueprint.yaml>    Generate Whimsical-compatible JSON
  enforce <blueprint.yaml>      CI/CD enforcement check

Doctrine Components:
  • HEIR Canopy: History • Enforcement • Integrity • Repair
  • Vertical IMO: Input → Middle (Orchestration Bay) → Output
  • ORBT Discipline: Operate • Repair • Build • Train
  • CARB Runtime: Compliance • Automation • Repair • Blueprint
  • Schema Grounding: STAMPED (Neon) • SPVPET (Firebase) • STACKED (BigQuery)

Example:
  tsx scripts/ctb-doctrine-builder.ts validate ctb_blueprint.yaml
  tsx scripts/ctb-doctrine-builder.ts render ctb_blueprint.yaml
`)
    process.exit(1)
  }
  
  const builder = new CTBDoctrineBuilder()
  
  try {
    const blueprintPath = args[1]
    if (!blueprintPath) {
      console.error("❌ Blueprint path required")
      process.exit(1)
    }
    
    const blueprint = await builder.loadYAMLBlueprint(blueprintPath)
    
    switch (command) {
      case 'validate': {
        const validation = builder.validateDoctrine(blueprint)
        console.log("\n🔍 Doctrine Validation Results")
        console.log("═".repeat(50))
        console.log(`Status: ${validation.valid ? "✅ PASS" : "❌ FAIL"}`)
        if (validation.violations.length > 0) {
          console.log("\nViolations:")
          validation.violations.forEach(v => console.log(`  • ${v}`))
        }
        process.exit(validation.valid ? 0 : 1)
        break
      }
      
      case 'render': {
        const diagram = builder.renderDoctrineCTB(blueprint)
        console.log(diagram)
        break
      }
      
      case 'whimsical': {
        const whimsical = builder.generateWhimsicalJSON(blueprint)
        const outputPath = blueprintPath.replace('.yaml', '-whimsical.json')
        fs.writeFileSync(outputPath, JSON.stringify(whimsical, null, 2))
        console.log(`✅ Whimsical JSON saved to: ${outputPath}`)
        break
      }
      
      case 'enforce': {
        const { pass, report } = await builder.enforceDoctrineCI(blueprintPath)
        console.log("\n🚔 CI/CD Doctrine Enforcement")
        console.log("═".repeat(50))
        console.log(`Status: ${pass ? "✅ PASS" : "❌ BLOCKED"}`)
        console.log("\nEnforcement Checks:")
        Object.entries(report.enforcement).forEach(([check, passed]) => {
          console.log(`  ${passed ? "✅" : "❌"} ${check}`)
        })
        if (!pass) {
          console.log("\n⚠️  PR will be blocked due to doctrine violations")
        }
        process.exit(pass ? 0 : 1)
        break
      }
      
      default:
        console.error(`❌ Unknown command: ${command}`)
        process.exit(1)
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error}`)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { CTBDoctrineBuilder }