#!/usr/bin/env tsx

import { z } from 'zod'
import fs from 'fs'
import path from 'path'

// CTB Schema definitions
const CTBNodeSchema = z.object({
  label: z.string(),
  IMO: z.object({
    input: z.string(),
    middle: z.string(),
    output: z.string()
  }),
  ORBT: z.object({
    operate: z.string(),
    repair: z.string(),
    build: z.string(),
    train: z.string()
  }),
  orchestrator: z.string().optional(),
  sub_agent: z.string().optional()
})

const CTBBranchSchema = z.object({
  name: z.string(),
  nodes: z.array(CTBNodeSchema).min(1),
  sub_branches: z.array(z.lazy(() => CTBBranchSchema)).optional()
})

const CTBBlueprintSchema = z.object({
  star: z.object({
    name: z.string()
  }),
  branches: z.array(CTBBranchSchema).min(1)
})

interface CTBRenderResult {
  diagram: string
  checklist: Array<{
    branch: string
    node: string
    train_doc: string
    orchestrator?: string
    sub_agent?: string
  }>
  summary: {
    branches: number
    nodes: number
    sub_branches: number
    errors: string[]
  }
}

type CTBMode = "normal" | "garage-mcp"

export class CTBBuilder {
  
  // Convert IMO blueprint to CTB format
  convertIMOToCTB(imoBlueprint: any, mode: CTBMode = "normal"): any {
    const altitudes = imoBlueprint.altitudes
    
    // Map project name to star
    const star = {
      name: altitudes["30000"].project_name || imoBlueprint.project_slug
    }
    
    // Create branches from altitude data
    const branches = []
    
    // Strategic Branch (30,000ft)
    if (altitudes["30000"]) {
      branches.push({
        name: "Strategic Vision",
        nodes: [
          {
            label: "Project Objectives",
            IMO: {
              input: "Business requirements and stakeholder needs",
              middle: altitudes["30000"].objective || "Define project vision",
              output: "Clear success criteria and stakeholder alignment"
            },
            ORBT: {
              operate: "Monitor project alignment with business objectives",
              repair: "Realign project scope when objectives drift",
              build: "Establish governance and decision-making frameworks",
              train: "Stakeholder communication and expectation management"
            }
          }
        ]
      })
    }
    
    // System Architecture Branch (20,000ft)
    if (altitudes["20000"]) {
      const systemNodes = []
      
      // Components node
      if (altitudes["20000"].components?.length > 0) {
        systemNodes.push({
          label: "System Components",
          IMO: {
            input: "Requirements and technical constraints",
            middle: `Architect: ${altitudes["20000"].components.join(', ')}`,
            output: "Component specifications and interfaces"
          },
          ORBT: {
            operate: "Monitor component performance and health",
            repair: "Debug and fix component integration issues",
            build: "Develop and deploy system components",
            train: "Component architecture documentation and onboarding"
          }
        })
      }
      
      // Roles and stages
      if (altitudes["20000"].roles?.length > 0 || altitudes["20000"].stages?.length > 0) {
        systemNodes.push({
          label: "Process Flow",
          IMO: {
            input: `Roles: ${altitudes["20000"].roles?.join(', ') || 'N/A'}`,
            middle: `Stages: ${altitudes["20000"].stages?.join(' → ') || 'N/A'}`,
            output: "Workflow and role definitions"
          },
          ORBT: {
            operate: "Execute stage transitions and role handoffs",
            repair: "Resolve workflow bottlenecks and role conflicts",
            build: "Design process automation and tooling",
            train: "Role-specific training and process documentation"
          }
        })
      }
      
      if (systemNodes.length > 0) {
        branches.push({
          name: "System Architecture",
          nodes: systemNodes
        })
      }
    }
    
    // Implementation Branch (10,000ft)
    if (altitudes["10000"]) {
      const implNodes = []
      
      if (altitudes["10000"].steps?.length > 0) {
        implNodes.push({
          label: "Implementation Steps",
          IMO: {
            input: "Technical specifications and requirements",
            middle: `Execute: ${altitudes["10000"].steps.slice(0, 3).join(', ')}${altitudes["10000"].steps.length > 3 ? '...' : ''}`,
            output: "Working features and functionality"
          },
          ORBT: {
            operate: "Monitor implementation progress and quality",
            repair: "Fix bugs and technical debt",
            build: "Develop features according to specifications",
            train: "Code reviews and technical documentation"
          }
        })
      }
      
      if (altitudes["10000"].apis_services?.length > 0) {
        implNodes.push({
          label: "APIs & Services",
          IMO: {
            input: "Service requirements and integration needs",
            middle: `Integrate: ${altitudes["10000"].apis_services.join(', ')}`,
            output: "Working API connections and service integrations"
          },
          ORBT: {
            operate: "Monitor API health and service availability",
            repair: "Fix integration issues and service failures",
            build: "Implement API connections and service layers",
            train: "API documentation and service operation guides"
          }
        })
      }
      
      if (implNodes.length > 0) {
        branches.push({
          name: "Implementation",
          nodes: implNodes
        })
      }
    }
    
    // Tactical Branch (5,000ft)
    if (altitudes["5000"]) {
      const tacticalNodes = []
      
      // Agent roles
      const agentRoles = altitudes["5000"].agent_roles
      if (agentRoles && Object.values(agentRoles).some((role: any) => role)) {
        const agentNode: any = {
          label: "Agent Coordination",
          IMO: {
            input: "Task requirements and coordination needs",
            middle: "Coordinate between Claude, Project GPT, Whimsical GPT, Sidecar, and HEIR agents",
            output: "Coordinated task execution and handoffs"
          },
          ORBT: {
            operate: "Orchestrate agent workflows and communications",
            repair: "Resolve agent conflicts and coordination issues",
            build: "Implement agent integration and communication protocols",
            train: "Agent operation guides and handoff procedures"
          }
        }
        
        // Only add orchestrator/sub_agent in garage-mcp mode
        if (mode === "garage-mcp") {
          agentNode.orchestrator = "main_coordinator"
          agentNode.sub_agent = "task_distributor"
        }
        
        tacticalNodes.push(agentNode)
      }
      
      // Documentation and handoffs
      if (altitudes["5000"].documentation_plan?.length > 0 || altitudes["5000"].handoffs?.length > 0) {
        tacticalNodes.push({
          label: "Documentation & Handoffs",
          IMO: {
            input: "Knowledge and deliverable requirements",
            middle: "Document processes and execute clean handoffs",
            output: "Complete documentation and successful knowledge transfer"
          },
          ORBT: {
            operate: "Maintain documentation currency and execute handoffs",
            repair: "Fix documentation gaps and handoff failures",
            build: "Create comprehensive documentation and handoff procedures",
            train: "Documentation standards and handoff protocols"
          }
        })
      }
      
      if (tacticalNodes.length > 0) {
        branches.push({
          name: "Tactical Execution",
          nodes: tacticalNodes
        })
      }
    }
    
    return {
      star,
      branches
    }
  }
  
  // Validate CTB schema
  validateSchema(ctbBlueprint: any, requiredKeys: string[], mode: CTBMode): string[] {
    const errors: string[] = []
    
    try {
      // Basic schema validation
      const result = CTBBlueprintSchema.safeParse(ctbBlueprint)
      if (!result.success) {
        result.error.errors.forEach(error => {
          errors.push(`${error.path.join('.')}: ${error.message}`)
        })
      }
      
      // Mode-specific validation
      if (mode === "normal") {
        // In normal mode, orchestrator/sub_agent not allowed
        const hasOrchestrator = this.checkForProperty(ctbBlueprint, 'orchestrator')
        const hasSubAgent = this.checkForProperty(ctbBlueprint, 'sub_agent')
        
        if (hasOrchestrator) {
          errors.push("orchestrator field not allowed in normal mode")
        }
        if (hasSubAgent) {
          errors.push("sub_agent field not allowed in normal mode")
        }
      }
      
      // Required keys validation
      requiredKeys.forEach(keyPath => {
        if (!this.hasNestedProperty(ctbBlueprint, keyPath)) {
          errors.push(`Missing required field: ${keyPath}`)
        }
      })
      
    } catch (error) {
      errors.push(`Schema validation failed: ${error}`)
    }
    
    return errors
  }
  
  private hasNestedProperty(obj: any, path: string): boolean {
    const parts = path.split('.')
    let current = obj
    
    for (const part of parts) {
      if (part.includes('[]')) {
        // Handle array notation like branches[].name
        const arrayKey = part.replace('[]', '')
        if (!current || !current[arrayKey] || !Array.isArray(current[arrayKey]) || current[arrayKey].length === 0) {
          return false
        }
        // Check if all array elements have the required structure
        return current[arrayKey].every((item: any) => this.checkRemainingPath(item, parts.slice(parts.indexOf(part) + 1)))
      } else {
        if (!current || current[part] === undefined) {
          return false
        }
        current = current[part]
      }
    }
    
    return true
  }
  
  private checkRemainingPath(obj: any, remainingParts: string[]): boolean {
    if (remainingParts.length === 0) return true
    
    let current = obj
    for (const part of remainingParts) {
      if (part.includes('[]')) {
        const arrayKey = part.replace('[]', '')
        if (!current || !current[arrayKey] || !Array.isArray(current[arrayKey]) || current[arrayKey].length === 0) {
          return false
        }
        return current[arrayKey].every((item: any) => this.checkRemainingPath(item, remainingParts.slice(remainingParts.indexOf(part) + 1)))
      } else {
        if (!current || current[part] === undefined) {
          return false
        }
        current = current[part]
      }
    }
    return true
  }
  
  private checkForProperty(obj: any, propertyName: string): boolean {
    if (!obj) return false
    
    // Check recursively for the property
    const checkObject = (current: any): boolean => {
      if (typeof current !== 'object' || current === null) return false
      
      if (current.hasOwnProperty(propertyName)) {
        return true
      }
      
      for (const value of Object.values(current)) {
        if (Array.isArray(value)) {
          if (value.some(item => checkObject(item))) {
            return true
          }
        } else if (typeof value === 'object' && value !== null) {
          if (checkObject(value)) {
            return true
          }
        }
      }
      
      return false
    }
    
    return checkObject(obj)
  }
  
  private countSubBranches(ctbBlueprint: any): number {
    let count = 0
    
    const countInBranch = (branch: any) => {
      if (branch.sub_branches) {
        count += branch.sub_branches.length
        branch.sub_branches.forEach(countInBranch)
      }
    }
    
    ctbBlueprint.branches?.forEach(countInBranch)
    return count
  }
  
  // Render CTB diagram
  renderCTBDiagram(ctbBlueprint: any, mode: CTBMode): string {
    const lines: string[] = []
    
    // ASCII Christmas Tree Header
    lines.push("```")
    lines.push("        ⭐ " + ctbBlueprint.star.name)
    lines.push("       /|\\")
    lines.push("      / | \\")
    lines.push("     /  |  \\")
    lines.push("    /   |   \\")
    lines.push("   /_   |   _\\")
    lines.push("      \\ | /")
    lines.push("       \\|/")
    lines.push("        |")
    
    // Branches
    ctbBlueprint.branches.forEach((branch: any, branchIndex: number) => {
      const isLast = branchIndex === ctbBlueprint.branches.length - 1
      const branchSymbol = isLast ? "└─" : "├─"
      
      lines.push(`        ${branchSymbol} 🌿 ${branch.name}`)
      
      // Nodes
      branch.nodes.forEach((node: any, nodeIndex: number) => {
        const isLastNode = nodeIndex === branch.nodes.length - 1
        const nodeSymbol = isLastNode ? "   └─" : "   ├─"
        const prefix = isLast ? "        " : "        │"
        
        lines.push(`${prefix}${nodeSymbol} 🔷 ${node.label}`)
        
        // IMO details
        const imoPrefix = isLast ? "          " : "        │ "
        const nodePrefix = isLastNode ? "     " : "   │ "
        
        lines.push(`${prefix}${nodePrefix}   📥 Input: ${node.IMO.input}`)
        lines.push(`${prefix}${nodePrefix}   ⚙️  Middle: ${node.IMO.middle}`)
        lines.push(`${prefix}${nodePrefix}   📤 Output: ${node.IMO.output}`)
        
        // ORBT details
        lines.push(`${prefix}${nodePrefix}   🔄 Operate: ${node.ORBT.operate}`)
        lines.push(`${prefix}${nodePrefix}   🔧 Repair: ${node.ORBT.repair}`)
        lines.push(`${prefix}${nodePrefix}   🏗️  Build: ${node.ORBT.build}`)
        lines.push(`${prefix}${nodePrefix}   📚 Train: ${node.ORBT.train}`)
        
        // Mode-specific additions
        if (mode === "garage-mcp") {
          if (node.orchestrator) {
            lines.push(`${prefix}${nodePrefix}   🎭 Orchestrator: ${node.orchestrator}`)
          }
          if (node.sub_agent) {
            lines.push(`${prefix}${nodePrefix}   🤖 Sub-agent: ${node.sub_agent}`)
          }
        }
        
        if (!isLastNode) {
          lines.push(`${prefix}${nodePrefix}`)
        }
      })
    })
    
    lines.push("        |")
    lines.push("      [TRUNK]")
    lines.push("```")
    
    return lines.join('\n')
  }
  
  private renderSchemaError(errors: string[]): string {
    return `
🚫 **CTB Schema Validation Failed**

**Errors:**
${errors.map(error => `• ${error}`).join('\n')}

**Required CTB Structure:**
\`\`\`json
{
  "star": { "name": "Project Name" },
  "branches": [
    {
      "name": "Branch Name",
      "nodes": [
        {
          "label": "Node Label",
          "IMO": {
            "input": "What goes in",
            "middle": "What happens",
            "output": "What comes out"
          },
          "ORBT": {
            "operate": "How to run it",
            "repair": "How to fix it", 
            "build": "How to create it",
            "train": "How to learn it"
          }
        }
      ]
    }
  ]
}
\`\`\`
`
  }
  
  // Main render function
  renderCTB(ctbBlueprint: any, mode: CTBMode = "normal"): CTBRenderResult {
    const requiredKeys = [
      "star.name",
      "branches[].name", 
      "branches[].nodes[].label",
      "branches[].nodes[].IMO.input",
      "branches[].nodes[].IMO.middle", 
      "branches[].nodes[].IMO.output",
      "branches[].nodes[].ORBT.operate",
      "branches[].nodes[].ORBT.repair",
      "branches[].nodes[].ORBT.build",
      "branches[].nodes[].ORBT.train"
    ]
    
    // Schema validation
    const schemaErrors = this.validateSchema(ctbBlueprint, requiredKeys, mode)
    
    if (schemaErrors.length > 0) {
      return {
        diagram: this.renderSchemaError(schemaErrors),
        checklist: [],
        summary: {
          branches: 0,
          nodes: 0,
          sub_branches: 0,
          errors: schemaErrors
        }
      }
    }
    
    // Generate diagram
    const diagram = this.renderCTBDiagram(ctbBlueprint, mode)
    
    // Generate checklist
    const checklist: Array<any> = []
    ctbBlueprint.branches.forEach((branch: any) => {
      branch.nodes.forEach((node: any) => {
        const entry: any = {
          branch: branch.name,
          node: node.label,
          train_doc: node.ORBT.train || "—"
        }
        
        if (mode === "garage-mcp") {
          if (node.orchestrator) {
            entry.orchestrator = `call_orchestrator("${branch.name}.${node.label}")`
          }
          if (node.sub_agent) {
            entry.sub_agent = `call_sub_agent("${branch.name}.${node.label}")`
          }
        }
        
        checklist.push(entry)
      })
    })
    
    // Generate summary
    const summary = {
      branches: ctbBlueprint.branches?.length || 0,
      nodes: ctbBlueprint.branches?.reduce((total: number, branch: any) => 
        total + (branch.nodes?.length || 0), 0) || 0,
      sub_branches: this.countSubBranches(ctbBlueprint),
      errors: schemaErrors
    }
    
    return {
      diagram,
      checklist, 
      summary
    }
  }
  
  // Generate CTB from IMO blueprint file
  async generateCTBFromIMO(imoFilePath: string, outputPath?: string, mode: CTBMode = "normal"): Promise<CTBRenderResult> {
    try {
      // Read IMO blueprint
      const imoContent = fs.readFileSync(imoFilePath, 'utf-8')
      const imoBlueprint = JSON.parse(imoContent)
      
      // Convert to CTB
      const ctbBlueprint = this.convertIMOToCTB(imoBlueprint, mode)
      
      // Render CTB
      const result = this.renderCTB(ctbBlueprint, mode)
      
      // Save CTB blueprint if output path provided
      if (outputPath) {
        const ctbOutput = {
          generated_from: path.basename(imoFilePath),
          generated_at: new Date().toISOString(),
          mode: mode,
          ctb_blueprint: ctbBlueprint,
          render_result: result
        }
        
        fs.writeFileSync(outputPath, JSON.stringify(ctbOutput, null, 2))
      }
      
      return result
      
    } catch (error) {
      throw new Error(`Failed to generate CTB: ${error}`)
    }
  }
}

// CLI usage
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log(`
🎄 CTB (Christmas Tree Backbone) Builder

Usage: 
  tsx scripts/ctb-builder.ts <imo-blueprint.json> [output.json] [mode]

Examples:
  tsx scripts/ctb-builder.ts blueprint.json
  tsx scripts/ctb-builder.ts blueprint.json ctb-output.json normal
  tsx scripts/ctb-builder.ts blueprint.json ctb-output.json garage-mcp

Modes:
  - normal: Doctrine-only CTB (runtime, clean)  
  - garage-mcp: Build-mode (with orchestrator/sub-agent hooks)
`)
    process.exit(1)
  }
  
  const [imoFile, outputFile, mode = "normal"] = args
  const ctbMode = mode as CTBMode
  
  try {
    const builder = new CTBBuilder()
    const result = await builder.generateCTBFromIMO(imoFile, outputFile, ctbMode)
    
    console.log(`\n🎄 CTB Generated Successfully`)
    console.log(`${'='.repeat(50)}`)
    console.log(result.diagram)
    console.log(`\n📊 Summary:`)
    console.log(`   Branches: ${result.summary.branches}`)
    console.log(`   Nodes: ${result.summary.nodes}`)
    console.log(`   Sub-branches: ${result.summary.sub_branches}`)
    
    if (result.checklist.length > 0) {
      console.log(`\n✅ Checklist:`)
      result.checklist.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.branch} → ${item.node}`)
        console.log(`      Train: ${item.train_doc}`)
        if (item.orchestrator) console.log(`      🎭 ${item.orchestrator}`)
        if (item.sub_agent) console.log(`      🤖 ${item.sub_agent}`)
      })
    }
    
    if (outputFile) {
      console.log(`\n💾 Full output saved to: ${outputFile}`)
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