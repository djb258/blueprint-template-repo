#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import * as YAML from 'yaml'
import { CTBSchema } from '../lib/ctbSchema'
import { z } from 'zod'

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  doctrineChecks: {
    heirCanopy: boolean
    verticalIMO: boolean
    orbtDiscipline: boolean
    schemaGrounding: boolean
    promotionGates: boolean
    middleOperations: boolean
  }
}

class CTBValidator {
  private result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    doctrineChecks: {
      heirCanopy: false,
      verticalIMO: false,
      orbtDiscipline: false,
      schemaGrounding: false,
      promotionGates: false,
      middleOperations: false
    }
  }

  async validate(filePath: string): Promise<ValidationResult> {
    try {
      // Read YAML file
      if (!fs.existsSync(filePath)) {
        this.result.errors.push(`File not found: ${filePath}`)
        this.result.valid = false
        return this.result
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      let parsed: any

      try {
        parsed = YAML.parse(content)
      } catch (e) {
        this.result.errors.push(`Invalid YAML: ${e}`)
        this.result.valid = false
        return this.result
      }

      // Schema validation
      try {
        CTBSchema.parse(parsed)
      } catch (e) {
        if (e instanceof z.ZodError) {
          e.errors.forEach(err => {
            this.result.errors.push(`${err.path.join('.')}: ${err.message}`)
          })
          this.result.valid = false
        }
      }

      // Doctrine checks
      this.checkDoctrine(parsed)

      // Set overall validity
      this.result.valid = this.result.errors.length === 0

      return this.result

    } catch (error) {
      this.result.errors.push(`Validation failed: ${error}`)
      this.result.valid = false
      return this.result
    }
  }

  private checkDoctrine(blueprint: any) {
    // Check HEIR Canopy
    if (blueprint.heir && blueprint.heir.name && blueprint.heir.acronym) {
      this.result.doctrineChecks.heirCanopy = true
    } else {
      this.result.errors.push('DOCTRINE: HEIR canopy is required')
    }

    // Check Vertical IMO
    let allVerticalIMO = true
    blueprint.branches?.forEach((branch: any) => {
      branch.nodes?.forEach((node: any) => {
        if (node.orientation !== 'vertical') {
          allVerticalIMO = false
          this.result.errors.push(`DOCTRINE: Node ${node.label} must have vertical orientation`)
        }
        if (!node.IMO || !node.IMO.input || !node.IMO.middle || !node.IMO.output) {
          allVerticalIMO = false
          this.result.errors.push(`DOCTRINE: Node ${node.label} missing complete IMO structure`)
        }
      })
    })
    this.result.doctrineChecks.verticalIMO = allVerticalIMO

    // Check ORBT Discipline
    let allORBT = true
    blueprint.branches?.forEach((branch: any) => {
      branch.nodes?.forEach((node: any) => {
        if (!node.ORBT || !node.ORBT.operate || !node.ORBT.repair || !node.ORBT.build || !node.ORBT.train) {
          allORBT = false
          this.result.errors.push(`DOCTRINE: Node ${node.label} missing ORBT discipline`)
        }
      })
    })
    this.result.doctrineChecks.orbtDiscipline = allORBT

    // Check Schema Grounding
    if (blueprint.schemas?.neon && blueprint.schemas?.firebase && blueprint.schemas?.bigquery) {
      this.result.doctrineChecks.schemaGrounding = true
    } else {
      this.result.errors.push('DOCTRINE: Schema grounding (STAMPED/SPVPET/STACKED) required')
    }

    // Check Promotion Gates
    let allGates = true
    blueprint.branches?.forEach((branch: any) => {
      branch.nodes?.forEach((node: any) => {
        if (!node.IMO?.middle?.promotion?.gate === undefined) {
          allGates = false
          this.result.warnings.push(`Node ${node.label} missing promotion gate definition`)
        }
      })
    })
    this.result.doctrineChecks.promotionGates = allGates

    // Check Middle Operations
    let allOperations = true
    blueprint.branches?.forEach((branch: any) => {
      branch.nodes?.forEach((node: any) => {
        if (!node.IMO?.middle?.operations || node.IMO.middle.operations.length === 0) {
          allOperations = false
          this.result.errors.push(`DOCTRINE: Node ${node.label} missing middle operations`)
        }
        if (!node.IMO?.middle?.orchestration?.orchestrator) {
          allOperations = false
          this.result.errors.push(`DOCTRINE: Node ${node.label} missing orchestrator`)
        }
      })
    })
    this.result.doctrineChecks.middleOperations = allOperations

    // Check constraints
    if (blueprint.constraints) {
      if (blueprint.constraints.require_heir_canopy && !this.result.doctrineChecks.heirCanopy) {
        this.result.errors.push('CONSTRAINT: HEIR canopy is required by constraints')
      }
      if (blueprint.constraints.require_vertical_imo && !this.result.doctrineChecks.verticalIMO) {
        this.result.errors.push('CONSTRAINT: Vertical IMO is required by constraints')
      }
      if (blueprint.constraints.require_orbt_per_node && !this.result.doctrineChecks.orbtDiscipline) {
        this.result.errors.push('CONSTRAINT: ORBT discipline is required by constraints')
      }
      if (blueprint.constraints.require_schemas_base && !this.result.doctrineChecks.schemaGrounding) {
        this.result.errors.push('CONSTRAINT: Schema grounding is required by constraints')
      }
    }
  }

  printReport(result: ValidationResult) {
    console.log('\n🎄 CTB Doctrine Validation Report')
    console.log('═'.repeat(50))
    
    // Overall status
    const statusIcon = result.valid ? '✅' : '❌'
    const statusText = result.valid ? 'PASS' : 'FAIL'
    console.log(`\nStatus: ${statusIcon} ${statusText}`)
    
    // Doctrine checks
    console.log('\n📋 Doctrine Compliance:')
    console.log(`  ${result.doctrineChecks.heirCanopy ? '✅' : '❌'} HEIR Canopy`)
    console.log(`  ${result.doctrineChecks.verticalIMO ? '✅' : '❌'} Vertical IMO`)
    console.log(`  ${result.doctrineChecks.orbtDiscipline ? '✅' : '❌'} ORBT Discipline`)
    console.log(`  ${result.doctrineChecks.schemaGrounding ? '✅' : '❌'} Schema Grounding`)
    console.log(`  ${result.doctrineChecks.promotionGates ? '✅' : '❌'} Promotion Gates`)
    console.log(`  ${result.doctrineChecks.middleOperations ? '✅' : '❌'} Middle Operations`)
    
    // Errors
    if (result.errors.length > 0) {
      console.log(`\n❌ Errors (${result.errors.length}):`)
      result.errors.forEach(err => console.log(`  • ${err}`))
    }
    
    // Warnings
    if (result.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${result.warnings.length}):`)
      result.warnings.forEach(warn => console.log(`  • ${warn}`))
    }
    
    // Summary
    console.log('\n' + '═'.repeat(50))
    if (result.valid) {
      console.log('✅ CTB Blueprint is doctrine-compliant!')
      console.log('🎄 Ready for illustration at http://localhost:3000/illustration')
    } else {
      console.log('❌ CTB Blueprint failed validation')
      console.log('Fix the errors above and run validation again')
      if (process.env.CI) {
        console.log('\n🚫 CI/CD: This PR will be blocked')
      }
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const filePath = args[0] || 'ctb_blueprint.yaml'
  
  console.log(`🔍 Validating: ${filePath}`)
  
  const validator = new CTBValidator()
  const result = await validator.validate(filePath)
  
  validator.printReport(result)
  
  // Exit with appropriate code for CI/CD
  process.exit(result.valid ? 0 : 1)
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export { CTBValidator }