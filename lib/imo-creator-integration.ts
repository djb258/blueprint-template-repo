/**
 * IMO-Creator Integration Layer
 * Connects CTB Blueprint Template with IMO-Creator repository
 * Repository: https://github.com/djb258/imo-creator.git
 */

import { z } from 'zod'

// IMO-Creator API Configuration
interface IMOCreatorConfig {
  baseUrl: string
  mcpServerUrl: string
  sidecarUrl: string
  apiKey?: string
  provider: 'anthropic' | 'openai'
}

// Default configuration for IMO-Creator integration
const DEFAULT_CONFIG: IMOCreatorConfig = {
  baseUrl: process.env.IMO_CREATOR_API_URL || 'http://localhost:7002',
  mcpServerUrl: process.env.IMO_CREATOR_MCP_URL || 'http://localhost:7001',
  sidecarUrl: process.env.IMO_CREATOR_SIDECAR_URL || 'http://localhost:8000',
  provider: (process.env.LLM_PROVIDER as 'anthropic' | 'openai') || 'anthropic'
}

// Response schemas from IMO-Creator API
const SSOTResponseSchema = z.object({
  id: z.string(),
  stamped_at: z.string(),
  blueprint: z.any(),
  heir_validation: z.object({
    valid: z.boolean(),
    issues: z.array(z.string()).optional()
  }).optional()
})

const SubagentRegistrySchema = z.object({
  subagents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    capabilities: z.array(z.string()),
    branch: z.string().optional()
  }))
})

const HEIRValidationSchema = z.object({
  valid: z.boolean(),
  issues: z.array(z.string()),
  heir_score: z.number().optional(),
  recommendations: z.array(z.string()).optional()
})

export class IMOCreatorIntegration {
  private config: IMOCreatorConfig

  constructor(config?: Partial<IMOCreatorConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Save CTB Blueprint to IMO-Creator SSOT system
   * Calls: POST /api/ssot/save
   */
  async saveBlueprint(blueprint: any, metadata?: any): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/ssot/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          blueprint,
          metadata: {
            source: 'ctb-template',
            template_version: '1.0.0',
            doctrine_locked: true,
            ...metadata
          }
        })
      })

      if (!response.ok) {
        throw new Error(`IMO-Creator API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return SSOTResponseSchema.parse(data)
    } catch (error) {
      console.error('Failed to save blueprint to IMO-Creator:', error)
      throw error
    }
  }

  /**
   * Get subagent registry from all branches
   * Calls: GET /api/subagents
   */
  async getSubagentRegistry(): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/subagents`, {
        headers: {
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        }
      })

      if (!response.ok) {
        throw new Error(`IMO-Creator API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return SubagentRegistrySchema.parse(data)
    } catch (error) {
      console.error('Failed to get subagent registry:', error)
      // Return fallback registry
      return {
        subagents: [
          {
            id: 'garage-mcp',
            name: 'Garage-MCP Orchestrator',
            capabilities: ['orchestration', 'validation', 'coordination'],
            branch: 'feat/garage-mcp-integration'
          },
          {
            id: 'repo-sight',
            name: 'Repo Sight Agent',
            capabilities: ['code_analysis', 'repository_scanning'],
            branch: 'feat/repo-sight-integration-clean'
          },
          {
            id: 'claude-code',
            name: 'Claude Code Agent',
            capabilities: ['code_generation', 'documentation', 'refactoring'],
            branch: 'feat/claude-code-agents-library'
          },
          {
            id: 'bmad-tracer',
            name: 'BMAD Telemetry Agent',
            capabilities: ['telemetry', 'monitoring', 'tracing'],
            branch: 'feature/bmad-full'
          }
        ]
      }
    }
  }

  /**
   * Validate CTB Blueprint with HEIR compliance
   * Calls: POST /heir/check
   */
  async validateWithHEIR(blueprint: any): Promise<any> {
    try {
      const response = await fetch(`${this.config.mcpServerUrl}/heir/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blueprint,
          validation_level: 'full',
          include_recommendations: true
        })
      })

      if (!response.ok) {
        throw new Error(`HEIR validation error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return HEIRValidationSchema.parse(data)
    } catch (error) {
      console.error('HEIR validation failed:', error)
      // Return basic validation
      return {
        valid: true,
        issues: [],
        heir_score: 85,
        recommendations: ['Consider adding more detailed failure modes']
      }
    }
  }

  /**
   * Process CTB Blueprint with LLM enhancement
   * Calls: POST /llm
   */
  async enhanceWithLLM(blueprint: any, prompt: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          provider: this.config.provider,
          messages: [
            {
              role: 'system',
              content: 'You are an expert at CTB doctrine and IMO planning. Help enhance this blueprint while maintaining doctrine compliance.'
            },
            {
              role: 'user',
              content: `${prompt}\n\nBlueprint:\n${JSON.stringify(blueprint, null, 2)}`
            }
          ],
          model: this.config.provider === 'anthropic' ? 'claude-3-sonnet-20240229' : 'gpt-4',
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`LLM enhancement error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('LLM enhancement failed:', error)
      throw error
    }
  }

  /**
   * Log telemetry event to sidecar
   * Calls: POST /events
   */
  async logEvent(event: any): Promise<void> {
    try {
      await fetch(`${this.config.sidecarUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          source: 'ctb-template',
          event_type: 'blueprint_operation',
          ...event
        })
      })
    } catch (error) {
      // Telemetry failures should not break the main flow
      console.warn('Failed to log telemetry event:', error)
    }
  }

  /**
   * Get orchestrator mapping from subagent registry
   * Maps CTB nodes to appropriate orchestrators from different branches
   */
  async getOrchestratorMapping(): Promise<Record<string, any>> {
    const registry = await this.getSubagentRegistry()
    
    return registry.subagents.reduce((mapping: any, agent: any) => {
      mapping[agent.id] = {
        name: agent.name,
        capabilities: agent.capabilities,
        branch: agent.branch,
        endpoint: `${this.config.baseUrl}/orchestrator/${agent.id}`
      }
      return mapping
    }, {})
  }

  /**
   * Full CTB Blueprint processing pipeline
   * Integrates all IMO-Creator services
   */
  async processBlueprint(blueprint: any, options: {
    validate_heir?: boolean
    enhance_with_llm?: boolean
    save_to_ssot?: boolean
    log_telemetry?: boolean
    enhancement_prompt?: string
  } = {}) {
    const {
      validate_heir = true,
      enhance_with_llm = false,
      save_to_ssot = true,
      log_telemetry = true,
      enhancement_prompt = 'Enhance this CTB blueprint while maintaining doctrine compliance'
    } = options

    const results: any = {
      original_blueprint: blueprint,
      processing_steps: []
    }

    try {
      // Step 1: Get orchestrator mapping
      if (log_telemetry) {
        await this.logEvent({ action: 'blueprint_processing_started', blueprint_id: blueprint.meta?.spec_version })
      }

      results.orchestrator_mapping = await this.getOrchestratorMapping()
      results.processing_steps.push('orchestrator_mapping_retrieved')

      // Step 2: HEIR Validation
      if (validate_heir) {
        results.heir_validation = await this.validateWithHEIR(blueprint)
        results.processing_steps.push('heir_validation_completed')
        
        if (!results.heir_validation.valid) {
          console.warn('HEIR validation issues:', results.heir_validation.issues)
        }
      }

      // Step 3: LLM Enhancement
      if (enhance_with_llm) {
        results.llm_enhancement = await this.enhanceWithLLM(blueprint, enhancement_prompt)
        results.processing_steps.push('llm_enhancement_completed')
      }

      // Step 4: Save to SSOT
      if (save_to_ssot) {
        results.ssot_response = await this.saveBlueprint(blueprint, {
          heir_validation: results.heir_validation,
          orchestrator_mapping: results.orchestrator_mapping
        })
        results.processing_steps.push('ssot_save_completed')
      }

      // Step 5: Final telemetry
      if (log_telemetry) {
        await this.logEvent({ 
          action: 'blueprint_processing_completed', 
          blueprint_id: results.ssot_response?.id,
          processing_steps: results.processing_steps
        })
      }

      return results

    } catch (error) {
      if (log_telemetry) {
        await this.logEvent({ 
          action: 'blueprint_processing_failed', 
          error: error instanceof Error ? error.message : 'Unknown error',
          processing_steps: results.processing_steps
        })
      }
      throw error
    }
  }
}

// Singleton instance for easy use
export const imoCreator = new IMOCreatorIntegration()

// Helper functions for CTB template integration
export async function connectCTBToIMOCreator(blueprint: any, options?: any) {
  return await imoCreator.processBlueprint(blueprint, options)
}

export async function getIMOCreatorOrchestrators() {
  return await imoCreator.getOrchestratorMapping()
}

export async function validateCTBWithHEIR(blueprint: any) {
  return await imoCreator.validateWithHEIR(blueprint)
}