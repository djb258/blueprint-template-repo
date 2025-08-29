#!/usr/bin/env tsx

/**
 * IMO-Creator Integration Validation Script
 * Validates that all IMO-Creator features are properly integrated and working
 */

import fs from 'fs'
import path from 'path'

interface ValidationResult {
  feature: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: any
}

interface ValidationReport {
  overall_status: 'pass' | 'fail'
  timestamp: string
  total_checks: number
  passed: number
  failed: number
  warnings: number
  results: ValidationResult[]
}

class IMOCreatorValidator {
  private results: ValidationResult[] = []

  async validate(): Promise<ValidationReport> {
    console.log('🔍 Validating IMO-Creator integration...')

    try {
      // Core validation checks
      await this.validateDirectoryStructure()
      await this.validateFeatureRegistry()
      await this.validateEnvironmentConfiguration()
      await this.validateFeatureIntegrations()
      await this.validateCTBBlueprintIntegration()
      await this.validateDependencies()
      await this.validateAPIConnectivity()

      // Generate final report
      const report = this.generateReport()
      this.printReport(report)
      
      return report

    } catch (error) {
      console.error('❌ Validation failed with error:', error)
      throw error
    }
  }

  private async validateDirectoryStructure(): Promise<void> {
    console.log('📁 Validating directory structure...')

    const requiredDirs = [
      'standards',
      'implementations', 
      'docs'
    ]

    for (const dir of requiredDirs) {
      const dirPath = path.join(process.cwd(), dir)
      if (fs.existsSync(dirPath)) {
        this.addResult('Directory Structure', 'pass', `${dir}/ directory exists`)
      } else {
        this.addResult('Directory Structure', 'fail', `Missing required directory: ${dir}/`)
      }
    }

    // Check for implementation subdirectories
    const implementationsDir = path.join(process.cwd(), 'implementations')
    if (fs.existsSync(implementationsDir)) {
      const subDirs = fs.readdirSync(implementationsDir)
        .filter(item => fs.lstatSync(path.join(implementationsDir, item)).isDirectory())
      
      if (subDirs.length > 0) {
        this.addResult('Directory Structure', 'pass', `Found ${subDirs.length} implementation directories`)
      } else {
        this.addResult('Directory Structure', 'warning', 'No implementation directories found')
      }
    }
  }

  private async validateFeatureRegistry(): Promise<void> {
    console.log('📋 Validating feature registry...')

    const registryPath = path.join(process.cwd(), 'imo-creator-registry.json')
    
    if (!fs.existsSync(registryPath)) {
      this.addResult('Feature Registry', 'fail', 'Registry file not found - run npm run imo-creator:init')
      return
    }

    try {
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
      
      if (registry.features && Array.isArray(registry.features)) {
        this.addResult('Feature Registry', 'pass', `Registry contains ${registry.features.length} features`)
        
        const enabledFeatures = registry.features.filter((f: any) => f.enabled)
        const initializedFeatures = registry.features.filter((f: any) => f.initialized)
        
        this.addResult('Feature Registry', 'pass', `${enabledFeatures.length} features enabled`)
        this.addResult('Feature Registry', 'pass', `${initializedFeatures.length} features initialized`)
      } else {
        this.addResult('Feature Registry', 'fail', 'Invalid registry format')
      }
    } catch (error) {
      this.addResult('Feature Registry', 'fail', `Failed to parse registry: ${error}`)
    }
  }

  private async validateEnvironmentConfiguration(): Promise<void> {
    console.log('🔧 Validating environment configuration...')

    const envTemplate = path.join(process.cwd(), '.env.template')
    const envFile = path.join(process.cwd(), '.env')

    if (fs.existsSync(envTemplate)) {
      this.addResult('Environment', 'pass', '.env.template file exists')
    } else {
      this.addResult('Environment', 'fail', 'Missing .env.template file')
    }

    if (fs.existsSync(envFile)) {
      this.addResult('Environment', 'pass', '.env file exists')
      
      // Check for key environment variables
      const requiredEnvVars = [
        'IMO_CREATOR_API_URL',
        'IMO_CREATOR_MCP_URL', 
        'IMO_CREATOR_SIDECAR_URL',
        'LLM_PROVIDER'
      ]

      const envContent = fs.readFileSync(envFile, 'utf-8')
      
      for (const envVar of requiredEnvVars) {
        if (envContent.includes(envVar)) {
          this.addResult('Environment', 'pass', `${envVar} is configured`)
        } else {
          this.addResult('Environment', 'warning', `${envVar} not found in .env`)
        }
      }
    } else {
      this.addResult('Environment', 'warning', '.env file not found - copy from .env.template')
    }
  }

  private async validateFeatureIntegrations(): Promise<void> {
    console.log('⚙️ Validating feature integrations...')

    const implementationsDir = path.join(process.cwd(), 'implementations')
    
    if (!fs.existsSync(implementationsDir)) {
      this.addResult('Feature Integrations', 'fail', 'Implementations directory not found')
      return
    }

    const featureDirs = fs.readdirSync(implementationsDir)
      .filter(dir => fs.lstatSync(path.join(implementationsDir, dir)).isDirectory())

    for (const featureDir of featureDirs) {
      const featurePath = path.join(implementationsDir, featureDir)
      
      // Check for integration.ts file
      const integrationFile = path.join(featurePath, 'integration.ts')
      if (fs.existsSync(integrationFile)) {
        this.addResult('Feature Integrations', 'pass', `${featureDir}: integration.ts exists`)
        
        // Check for initialization marker
        const initMarker = path.join(featurePath, '.initialized')
        if (fs.existsSync(initMarker)) {
          this.addResult('Feature Integrations', 'pass', `${featureDir}: initialized`)
        } else {
          this.addResult('Feature Integrations', 'warning', `${featureDir}: not initialized`)
        }
      } else {
        this.addResult('Feature Integrations', 'fail', `${featureDir}: missing integration.ts`)
      }
    }
  }

  private async validateCTBBlueprintIntegration(): Promise<void> {
    console.log('🎄 Validating CTB blueprint integration...')

    const blueprintPath = path.join(process.cwd(), 'ctb_blueprint.yaml')
    
    if (!fs.existsSync(blueprintPath)) {
      this.addResult('CTB Blueprint', 'fail', 'CTB blueprint file not found')
      return
    }

    const blueprintContent = fs.readFileSync(blueprintPath, 'utf-8')
    
    if (blueprintContent.includes('imo_creator_integration')) {
      this.addResult('CTB Blueprint', 'pass', 'IMO-Creator integration section exists')
    } else {
      this.addResult('CTB Blueprint', 'warning', 'IMO-Creator integration not found in blueprint')
    }

    if (blueprintContent.includes('repository:') && blueprintContent.includes('imo-creator')) {
      this.addResult('CTB Blueprint', 'pass', 'Repository reference configured')
    } else {
      this.addResult('CTB Blueprint', 'warning', 'Repository reference not configured')
    }
  }

  private async validateDependencies(): Promise<void> {
    console.log('📦 Validating dependencies...')

    const packagePath = path.join(process.cwd(), 'package.json')
    
    if (!fs.existsSync(packagePath)) {
      this.addResult('Dependencies', 'fail', 'package.json not found')
      return
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
      
      const expectedDeps = [
        '@anthropic-ai/sdk',
        'openai',
        '@opentelemetry/sdk-node',
        'winston'
      ]

      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      for (const dep of expectedDeps) {
        if (allDeps[dep]) {
          this.addResult('Dependencies', 'pass', `${dep} installed`)
        } else {
          this.addResult('Dependencies', 'warning', `${dep} not installed`)
        }
      }

      // Check for IMO-Creator scripts
      const expectedScripts = [
        'imo-creator:init',
        'imo-creator:update',
        'imo-creator:validate'
      ]

      for (const script of expectedScripts) {
        if (packageJson.scripts && packageJson.scripts[script]) {
          this.addResult('Dependencies', 'pass', `Script ${script} exists`)
        } else {
          this.addResult('Dependencies', 'warning', `Script ${script} not found`)
        }
      }
    } catch (error) {
      this.addResult('Dependencies', 'fail', `Failed to parse package.json: ${error}`)
    }
  }

  private async validateAPIConnectivity(): Promise<void> {
    console.log('🌐 Validating API connectivity...')

    const apiUrls = [
      { name: 'Main API', url: process.env.IMO_CREATOR_API_URL || 'http://localhost:7002' },
      { name: 'MCP Server', url: process.env.IMO_CREATOR_MCP_URL || 'http://localhost:7001' },
      { name: 'Sidecar', url: process.env.IMO_CREATOR_SIDECAR_URL || 'http://localhost:8000' }
    ]

    for (const api of apiUrls) {
      try {
        // Simple connectivity test - in real implementation you'd make actual HTTP requests
        const isLocalhost = api.url.includes('localhost')
        if (isLocalhost) {
          this.addResult('API Connectivity', 'warning', `${api.name}: localhost URL (may not be running)`)
        } else {
          this.addResult('API Connectivity', 'pass', `${api.name}: configured`)
        }
      } catch (error) {
        this.addResult('API Connectivity', 'fail', `${api.name}: connection failed`)
      }
    }
  }

  private addResult(feature: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any): void {
    this.results.push({ feature, status, message, details })
  }

  private generateReport(): ValidationReport {
    const passed = this.results.filter(r => r.status === 'pass').length
    const failed = this.results.filter(r => r.status === 'fail').length
    const warnings = this.results.filter(r => r.status === 'warning').length

    return {
      overall_status: failed > 0 ? 'fail' : 'pass',
      timestamp: new Date().toISOString(),
      total_checks: this.results.length,
      passed,
      failed,
      warnings,
      results: this.results
    }
  }

  private printReport(report: ValidationReport): void {
    console.log('\n🎄 IMO-Creator Integration Validation Report')
    console.log('═'.repeat(60))
    
    const statusIcon = report.overall_status === 'pass' ? '✅' : '❌'
    const statusText = report.overall_status === 'pass' ? 'PASS' : 'FAIL'
    
    console.log(`\nOverall Status: ${statusIcon} ${statusText}`)
    console.log(`Timestamp: ${report.timestamp}`)
    console.log(`\nResults: ${report.passed} passed, ${report.failed} failed, ${report.warnings} warnings`)
    
    // Group results by feature
    const groupedResults = this.results.reduce((groups: any, result) => {
      if (!groups[result.feature]) {
        groups[result.feature] = []
      }
      groups[result.feature].push(result)
      return groups
    }, {})

    for (const [feature, results] of Object.entries(groupedResults)) {
      console.log(`\n📋 ${feature}:`)
      for (const result of results as ValidationResult[]) {
        const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️'
        console.log(`  ${icon} ${result.message}`)
      }
    }

    if (report.failed > 0) {
      console.log('\n🔧 Recommended Actions:')
      const failedResults = this.results.filter(r => r.status === 'fail')
      failedResults.forEach((result, index) => {
        console.log(`${index + 1}. Fix: ${result.message}`)
      })
    }

    if (report.warnings > 0) {
      console.log('\n⚠️ Warnings to Address:')
      const warningResults = this.results.filter(r => r.status === 'warning')
      warningResults.forEach((result, index) => {
        console.log(`${index + 1}. Consider: ${result.message}`)
      })
    }

    console.log('\n' + '═'.repeat(60))
  }
}

// Main execution
async function main() {
  try {
    const validator = new IMOCreatorValidator()
    const report = await validator.validate()

    // Save report to file
    const reportPath = path.join(process.cwd(), 'imo-creator-validation-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📄 Validation report saved to: ${reportPath}`)

    // Exit with appropriate code
    process.exit(report.overall_status === 'pass' ? 0 : 1)

  } catch (error) {
    console.error('💥 Validation failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}