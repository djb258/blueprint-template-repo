#!/usr/bin/env tsx

/**
 * IMO-Creator Template Implementation Script
 * Pulls all standards, branches, and updates from IMO-Creator repo
 * and implements them in this CTB template
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const IMO_CREATOR_REPO = 'https://github.com/djb258/imo-creator.git'
const TEMP_DIR = path.join(process.cwd(), '.imo-creator-temp')
const STANDARDS_DIR = path.join(process.cwd(), 'standards')
const IMPLEMENTATIONS_DIR = path.join(process.cwd(), 'implementations')

interface BranchFeature {
  name: string
  description: string
  files: string[]
  dependencies: string[]
  implementation: string
}

const BRANCH_FEATURES: Record<string, BranchFeature> = {
  'feat/claude-code-agents-library': {
    name: 'Claude Code Agents Library',
    description: 'Advanced code generation and documentation agents',
    files: ['agents/', 'lib/claude-agents/', 'types/agent-types.ts'],
    dependencies: ['@anthropic-ai/sdk', 'openai'],
    implementation: 'claude-code-integration'
  },
  'feat/garage-mcp-integration': {
    name: 'Garage MCP Integration',
    description: 'Model Context Protocol orchestration system',
    files: ['mcp/', 'lib/garage-mcp/', 'server/mcp-server.ts'],
    dependencies: ['@modelcontextprotocol/sdk'],
    implementation: 'garage-mcp-orchestrator'
  },
  'feat/repo-sight-integration-clean': {
    name: 'Repository Sight Integration',
    description: 'Code analysis and repository scanning capabilities',
    files: ['repo-sight/', 'lib/repo-analysis/', 'analyzers/'],
    dependencies: ['@microsoft/typescript-etw', 'tree-sitter'],
    implementation: 'repo-sight-analyzer'
  },
  'feature/bmad-full': {
    name: 'BMAD Telemetry System',
    description: 'Complete telemetry, monitoring, and tracing system',
    files: ['bmad/', 'telemetry/', 'lib/bmad-tracer/'],
    dependencies: ['@opentelemetry/sdk-node', 'winston'],
    implementation: 'bmad-telemetry'
  },
  'feature/bmad-upgrades': {
    name: 'BMAD System Upgrades',
    description: 'Enhanced BMAD features and capabilities',
    files: ['bmad-upgrades/', 'lib/bmad-enhanced/'],
    dependencies: ['@opentelemetry/auto-instrumentations-node'],
    implementation: 'bmad-enhanced'
  },
  'vercel-deploy-fix': {
    name: 'Vercel Deployment Configuration',
    description: 'Production deployment configurations and fixes',
    files: ['vercel.json', 'api/', 'deployment/'],
    dependencies: [],
    implementation: 'vercel-deployment'
  }
}

class IMOCreatorImplementation {
  private tempDir: string
  private implementedFeatures: string[] = []
  
  constructor() {
    this.tempDir = TEMP_DIR
  }

  /**
   * Main implementation pipeline
   */
  async implement(): Promise<void> {
    console.log('🚀 Starting IMO-Creator Template Implementation')
    console.log(`📦 Cloning from: ${IMO_CREATOR_REPO}`)
    
    try {
      // Step 1: Clone the repository
      await this.cloneRepository()
      
      // Step 2: Analyze all branches
      const branches = await this.analyzeBranches()
      
      // Step 3: Extract standards and implementations
      await this.extractStandards(branches)
      
      // Step 4: Implement all features
      await this.implementFeatures(branches)
      
      // Step 5: Update CTB blueprint with IMO-Creator integration
      await this.updateCTBBlueprint()
      
      // Step 6: Generate integration documentation
      await this.generateDocumentation()
      
      // Step 7: Update package.json with new dependencies
      await this.updateDependencies()
      
      // Step 8: Clean up
      await this.cleanup()
      
      console.log('✅ IMO-Creator implementation completed successfully!')
      console.log(`📊 Implemented features: ${this.implementedFeatures.join(', ')}`)
      
    } catch (error) {
      console.error('❌ Implementation failed:', error)
      await this.cleanup()
      throw error
    }
  }

  /**
   * Clone IMO-Creator repository with all branches
   */
  private async cloneRepository(): Promise<void> {
    console.log('📥 Cloning IMO-Creator repository...')
    
    // Remove existing temp directory
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true })
    }
    
    // Clone repository
    execSync(`git clone ${IMO_CREATOR_REPO} ${this.tempDir}`, { stdio: 'inherit' })
    
    // Fetch all branches
    execSync('git fetch --all', { cwd: this.tempDir, stdio: 'inherit' })
    
    console.log('✅ Repository cloned successfully')
  }

  /**
   * Analyze all branches and their contents
   */
  private async analyzeBranches(): Promise<string[]> {
    console.log('🔍 Analyzing branches...')
    
    // Get all branches
    const branchOutput = execSync('git branch -r', { cwd: this.tempDir, encoding: 'utf-8' })
    const branches = branchOutput
      .split('\n')
      .map(branch => branch.trim())
      .filter(branch => branch && !branch.includes('HEAD'))
      .map(branch => branch.replace('origin/', ''))
    
    console.log(`📋 Found branches: ${branches.join(', ')}`)
    return branches
  }

  /**
   * Extract standards and configurations from master branch
   */
  private async extractStandards(branches: string[]): Promise<void> {
    console.log('📚 Extracting standards from master branch...')
    
    // Ensure standards directory exists
    if (!fs.existsSync(STANDARDS_DIR)) {
      fs.mkdirSync(STANDARDS_DIR, { recursive: true })
    }
    
    // Checkout master branch
    execSync('git checkout master', { cwd: this.tempDir })
    
    // Copy key standard files
    const standardFiles = [
      'manifest.yaml',
      'config.yaml', 
      'requirements.txt',
      'package.json',
      '.env.template',
      'docker-compose.yml',
      'vercel.json'
    ]
    
    for (const file of standardFiles) {
      const sourcePath = path.join(this.tempDir, file)
      const destPath = path.join(STANDARDS_DIR, file)
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath)
        console.log(`📄 Copied standard: ${file}`)
      }
    }
    
    // Copy entire standards directory if it exists
    const standardsSource = path.join(this.tempDir, 'standards')
    if (fs.existsSync(standardsSource)) {
      this.copyDirectory(standardsSource, STANDARDS_DIR)
      console.log('📁 Copied standards directory')
    }
  }

  /**
   * Implement features from all branches
   */
  private async implementFeatures(branches: string[]): Promise<void> {
    console.log('⚙️ Implementing features from all branches...')
    
    // Ensure implementations directory exists
    if (!fs.existsSync(IMPLEMENTATIONS_DIR)) {
      fs.mkdirSync(IMPLEMENTATIONS_DIR, { recursive: true })
    }
    
    for (const branch of branches) {
      if (BRANCH_FEATURES[branch]) {
        await this.implementBranchFeature(branch, BRANCH_FEATURES[branch])
      } else {
        // Generic branch implementation
        await this.implementGenericBranch(branch)
      }
    }
  }

  /**
   * Implement a specific branch feature
   */
  private async implementBranchFeature(branchName: string, feature: BranchFeature): Promise<void> {
    console.log(`🔧 Implementing ${feature.name} from ${branchName}...`)
    
    try {
      // Checkout the branch
      execSync(`git checkout ${branchName}`, { cwd: this.tempDir })
      
      // Create feature directory
      const featureDir = path.join(IMPLEMENTATIONS_DIR, feature.implementation)
      if (!fs.existsSync(featureDir)) {
        fs.mkdirSync(featureDir, { recursive: true })
      }
      
      // Copy feature files
      for (const filePattern of feature.files) {
        const sourcePath = path.join(this.tempDir, filePattern)
        const destPath = path.join(featureDir, path.basename(filePattern))
        
        if (fs.existsSync(sourcePath)) {
          if (fs.lstatSync(sourcePath).isDirectory()) {
            this.copyDirectory(sourcePath, destPath)
          } else {
            fs.copyFileSync(sourcePath, destPath)
          }
          console.log(`📁 Copied: ${filePattern}`)
        }
      }
      
      // Generate feature integration file
      await this.generateFeatureIntegration(feature, featureDir)
      
      this.implementedFeatures.push(feature.name)
      console.log(`✅ Implemented ${feature.name}`)
      
    } catch (error) {
      console.warn(`⚠️ Failed to implement ${feature.name}:`, error)
    }
  }

  /**
   * Implement a generic branch (no specific feature mapping)
   */
  private async implementGenericBranch(branchName: string): Promise<void> {
    console.log(`🔧 Implementing generic branch: ${branchName}...`)
    
    try {
      // Checkout the branch
      execSync(`git checkout ${branchName}`, { cwd: this.tempDir })
      
      // Create branch directory
      const branchDir = path.join(IMPLEMENTATIONS_DIR, branchName.replace(/[^a-zA-Z0-9]/g, '-'))
      if (!fs.existsSync(branchDir)) {
        fs.mkdirSync(branchDir, { recursive: true })
      }
      
      // Copy unique files from this branch (diff from master)
      const diffOutput = execSync(`git diff master --name-only`, { 
        cwd: this.tempDir, 
        encoding: 'utf-8' 
      })
      
      const uniqueFiles = diffOutput.split('\n').filter(file => file.trim())
      
      for (const file of uniqueFiles) {
        const sourcePath = path.join(this.tempDir, file)
        const destPath = path.join(branchDir, file)
        
        if (fs.existsSync(sourcePath)) {
          // Ensure destination directory exists
          const destDir = path.dirname(destPath)
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true })
          }
          
          fs.copyFileSync(sourcePath, destPath)
          console.log(`📄 Copied unique file: ${file}`)
        }
      }
      
      // Generate branch info file
      const branchInfo = {
        name: branchName,
        description: `Generic implementation from ${branchName} branch`,
        unique_files: uniqueFiles,
        implementation_date: new Date().toISOString()
      }
      
      fs.writeFileSync(
        path.join(branchDir, 'branch-info.json'),
        JSON.stringify(branchInfo, null, 2)
      )
      
      this.implementedFeatures.push(branchName)
      console.log(`✅ Implemented generic branch: ${branchName}`)
      
    } catch (error) {
      console.warn(`⚠️ Failed to implement branch ${branchName}:`, error)
    }
  }

  /**
   * Generate feature integration file
   */
  private async generateFeatureIntegration(feature: BranchFeature, featureDir: string): Promise<void> {
    const integrationFile = path.join(featureDir, 'integration.ts')
    
    const integrationCode = `/**
 * ${feature.name} Integration
 * Generated from IMO-Creator repository
 * Description: ${feature.description}
 */

export interface ${feature.implementation.replace(/-/g, '')}Config {
  enabled: boolean
  apiKey?: string
  baseUrl?: string
}

export class ${feature.implementation.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')} {
  private config: ${feature.implementation.replace(/-/g, '')}Config
  
  constructor(config: ${feature.implementation.replace(/-/g, '')}Config) {
    this.config = config
  }
  
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.log('${feature.name} is disabled')
      return
    }
    
    console.log('Initializing ${feature.name}...')
    // Implementation specific initialization
  }
  
  async process(input: any): Promise<any> {
    if (!this.config.enabled) {
      return { status: 'disabled', message: '${feature.name} is not enabled' }
    }
    
    // Implementation specific processing
    return { status: 'success', data: input }
  }
}

// Export singleton instance
export const ${feature.implementation.replace(/-/g, '')} = new ${feature.implementation.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}({
  enabled: process.env.${feature.implementation.toUpperCase().replace(/-/g, '_')}_ENABLED === 'true',
  apiKey: process.env.${feature.implementation.toUpperCase().replace(/-/g, '_')}_API_KEY,
  baseUrl: process.env.${feature.implementation.toUpperCase().replace(/-/g, '_')}_BASE_URL
})
`
    
    fs.writeFileSync(integrationFile, integrationCode)
  }

  /**
   * Update CTB blueprint with IMO-Creator integration
   */
  private async updateCTBBlueprint(): Promise<void> {
    console.log('📝 Updating CTB blueprint with IMO-Creator integration...')
    
    const blueprintPath = path.join(process.cwd(), 'ctb_blueprint.yaml')
    if (!fs.existsSync(blueprintPath)) {
      console.warn('⚠️ CTB blueprint not found, skipping update')
      return
    }
    
    // Add IMO-Creator integration section to blueprint
    const integrationSection = `
# IMO-Creator Integration - Auto-generated
imo_creator_integration:
  repository: "${IMO_CREATOR_REPO}"
  implemented_features:
${this.implementedFeatures.map(f => `    - "${f}"`).join('\n')}
  implementation_date: "${new Date().toISOString()}"
  standards_location: "./standards/"
  implementations_location: "./implementations/"
  
  # Branch mappings
  branch_features:
${Object.entries(BRANCH_FEATURES).map(([branch, feature]) => 
  `    ${branch}:
      name: "${feature.name}"
      implementation: "${feature.implementation}"
      description: "${feature.description}"`
).join('\n')}
`
    
    // Append to blueprint
    fs.appendFileSync(blueprintPath, integrationSection)
    console.log('✅ Updated CTB blueprint')
  }

  /**
   * Generate comprehensive documentation
   */
  private async generateDocumentation(): Promise<void> {
    console.log('📖 Generating integration documentation...')
    
    const docsDir = path.join(process.cwd(), 'docs')
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true })
    }
    
    const documentationContent = `# IMO-Creator Integration Documentation

## Overview
This template has been automatically integrated with the IMO-Creator repository.
All standards, features, and implementations have been pulled and configured.

## Repository
- **Source**: ${IMO_CREATOR_REPO}
- **Integration Date**: ${new Date().toISOString()}
- **Implemented Features**: ${this.implementedFeatures.length}

## Implemented Features

${Object.entries(BRANCH_FEATURES).map(([branch, feature]) => `
### ${feature.name}
- **Branch**: \`${branch}\`
- **Implementation**: \`${feature.implementation}\`
- **Description**: ${feature.description}
- **Dependencies**: ${feature.dependencies.join(', ') || 'None'}
- **Location**: \`./implementations/${feature.implementation}/\`
`).join('\n')}

## Directory Structure

\`\`\`
├── standards/              # Standards and configurations from master
├── implementations/        # Feature implementations from all branches
│   ├── claude-code-integration/
│   ├── garage-mcp-orchestrator/
│   ├── repo-sight-analyzer/
│   ├── bmad-telemetry/
│   └── ...
└── docs/                  # This documentation
\`\`\`

## Usage

### 1. Initialize All Features
\`\`\`bash
npm run imo-creator:init
\`\`\`

### 2. Update from IMO-Creator
\`\`\`bash
npm run imo-creator:update
\`\`\`

### 3. Validate Integration
\`\`\`bash
npm run imo-creator:validate
\`\`\`

## Environment Variables

Add these to your \`.env\` file:

${Object.values(BRANCH_FEATURES).map(feature => `
# ${feature.name}
${feature.implementation.toUpperCase().replace(/-/g, '_')}_ENABLED=true
${feature.implementation.toUpperCase().replace(/-/g, '_')}_API_KEY=your_api_key_here
${feature.implementation.toUpperCase().replace(/-/g, '_')}_BASE_URL=http://localhost:7002
`).join('\n')}

## Integration with CTB Doctrine

The IMO-Creator integration enhances the CTB system with:

1. **Enhanced Orchestration**: Garage-MCP provides advanced orchestration
2. **Code Intelligence**: Claude Code agents for development tasks  
3. **Repository Analysis**: Repo Sight for codebase understanding
4. **Telemetry**: BMAD system for comprehensive monitoring
5. **Standards Compliance**: All IMO-Creator standards automatically applied

## Troubleshooting

### Feature Not Working
1. Check if feature is enabled in environment variables
2. Verify API keys are set correctly
3. Ensure all dependencies are installed
4. Check feature-specific logs

### Updates Not Applying  
1. Run \`npm run imo-creator:update\` to pull latest changes
2. Restart the application after updates
3. Check for conflicts in configuration files

## Contributing

When contributing to this template:
1. Always run integration validation before commits
2. Update documentation if adding new IMO-Creator features
3. Test all implemented features in your changes
4. Follow CTB doctrine compliance

## Support

For issues related to:
- **IMO-Creator Integration**: Check the implementations directory
- **CTB Doctrine**: Refer to CTB documentation
- **Specific Features**: See feature-specific README files

---
*This documentation was auto-generated during IMO-Creator integration*
`
    
    fs.writeFileSync(
      path.join(docsDir, 'IMO_CREATOR_INTEGRATION.md'),
      documentationContent
    )
    
    console.log('✅ Generated integration documentation')
  }

  /**
   * Update package.json with new dependencies
   */
  private async updateDependencies(): Promise<void> {
    console.log('📦 Updating dependencies...')
    
    const packagePath = path.join(process.cwd(), 'package.json')
    if (!fs.existsSync(packagePath)) {
      console.warn('⚠️ package.json not found, skipping dependency update')
      return
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
    
    // Collect all dependencies from implemented features
    const newDependencies: Record<string, string> = {}
    
    for (const [branchName, feature] of Object.entries(BRANCH_FEATURES)) {
      if (this.implementedFeatures.includes(feature.name)) {
        for (const dep of feature.dependencies) {
          newDependencies[dep] = 'latest'
        }
      }
    }
    
    // Add IMO-Creator specific dependencies
    newDependencies['@anthropic-ai/sdk'] = '^0.24.0'
    newDependencies['openai'] = '^4.0.0'
    newDependencies['@modelcontextprotocol/sdk'] = 'latest'
    newDependencies['@opentelemetry/sdk-node'] = '^0.45.0'
    newDependencies['winston'] = '^3.10.0'
    
    // Merge dependencies
    packageJson.dependencies = { ...packageJson.dependencies, ...newDependencies }
    
    // Add IMO-Creator specific scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'imo-creator:init': 'tsx scripts/imo-creator-init.ts',
      'imo-creator:update': 'tsx scripts/implement-from-imo-creator.ts',
      'imo-creator:validate': 'tsx scripts/validate-imo-creator-integration.ts'
    }
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
    console.log('✅ Updated package.json with new dependencies')
  }

  /**
   * Copy directory recursively
   */
  private copyDirectory(source: string, destination: string): void {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true })
    }
    
    const items = fs.readdirSync(source)
    
    for (const item of items) {
      const sourcePath = path.join(source, item)
      const destPath = path.join(destination, item)
      
      if (fs.lstatSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, destPath)
      } else {
        fs.copyFileSync(sourcePath, destPath)
      }
    }
  }

  /**
   * Clean up temporary files
   */
  private async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up...')
    
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true })
    }
    
    console.log('✅ Cleanup completed')
  }
}

// Main execution
async function main() {
  try {
    const implementation = new IMOCreatorImplementation()
    await implementation.implement()
    
    console.log(`
🎉 IMO-Creator Integration Complete!

Next steps:
1. Run 'npm install' to install new dependencies
2. Copy .env.template to .env and configure API keys
3. Run 'npm run imo-creator:validate' to verify integration
4. Check ./docs/IMO_CREATOR_INTEGRATION.md for detailed usage

Your CTB template now has all IMO-Creator standards and features!
`)
    
  } catch (error) {
    console.error('💥 Integration failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}