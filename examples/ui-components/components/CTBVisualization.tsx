import React from 'react'
import styles from './CTBVisualization.module.css'

interface IMOMiddle {
  orchestration: {
    orchestrator: string
    subagents?: string[]
    tools: string[]
    playbook: string[]
  }
  operations: Array<{
    title: string
    tool: string
    computation: string
  }>
  contracts: {
    preconditions: string[]
    postconditions: string[]
  }
  promotion: {
    gate: boolean
    rules: string[]
    human_firebreak: boolean
  }
  failure: {
    failure_modes: string[]
    retries: number
    fallback_plan: string[]
  }
  observability: {
    metrics: string[]
    logs: string[]
    trace_fields: string[]
  }
}

interface CTBNode {
  id: string
  label: string
  altitude: string
  IMO: {
    input: string[]
    middle: IMOMiddle
    output: string[]
  }
  ORBT: {
    operate: string[]
    repair: string[]
    build: string[]
    train: string[]
  }
  CARB?: {
    compliance: string[]
    automation: string[]
    repair: string[]
    blueprint: string[]
  }
  badges?: string[]
}

interface CTBBranch {
  id: string
  name: string
  altitude: string
  render_hints: {
    icon: string
  }
  nodes: CTBNode[]
}

interface CTBBlueprintProps {
  blueprint: {
    meta: {
      doctrine_lock: boolean
      notes: string[]
    }
    heir: {
      name: string
      acronym: string
      description: string
    }
    star: {
      name: string
      tagline: string
      render_hints: {
        icon: string
      }
    }
    branches: CTBBranch[]
    schemas: {
      neon: { name: string }
      firebase: { name: string }
      bigquery: { name: string }
    }
  }
}

export const CTBVisualization: React.FC<CTBBlueprintProps> = ({ blueprint }) => {
  return (
    <div className={styles.ctbContainer}>
      {/* HEIR Canopy */}
      <div className={styles.heirCanopy}>
        <div className={styles.canopyHeader}>
          <h2>{blueprint.heir.name}</h2>
          <p className={styles.acronym}>{blueprint.heir.acronym}</p>
          <p className={styles.description}>{blueprint.heir.description}</p>
        </div>
      </div>

      {/* Star */}
      <div className={styles.star}>
        <span className={styles.starIcon}>
          {blueprint.star.render_hints.icon}
        </span>
        <h1>{blueprint.star.name}</h1>
        <p className={styles.tagline}>{blueprint.star.tagline}</p>
      </div>

      {/* Tree Structure */}
      <div className={styles.treeStructure}>
        <svg className={styles.treeSvg} viewBox="0 0 800 600">
          {/* Tree lines */}
          <path
            d="M 400 100 L 400 150 L 200 250 M 400 150 L 600 250 M 400 150 L 400 500"
            stroke="#228B22"
            strokeWidth="3"
            fill="none"
          />
        </svg>

        {/* Branches */}
        <div className={styles.branches}>
          {blueprint.branches.map((branch, branchIndex) => (
            <div key={branch.id} className={styles.branch}>
              <div className={styles.branchHeader}>
                <span className={styles.branchIcon}>{branch.render_hints.icon}</span>
                <h3>{branch.name}</h3>
                <span className={styles.altitude}>[{branch.altitude}]</span>
              </div>

              {/* Nodes */}
              {branch.nodes.map((node) => (
                <div key={node.id} className={styles.node}>
                  <h4 className={styles.nodeLabel}>
                    🔷 {node.label} [{node.altitude}]
                  </h4>

                  {/* Vertical IMO Structure */}
                  <div className={styles.imoContainer}>
                    {/* Input */}
                    <div className={styles.imoSection}>
                      <h5>📥 INPUT</h5>
                      <ul>
                        {node.IMO.input.map((input, i) => (
                          <li key={i}>{input}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Middle - Orchestration Bay */}
                    <div className={`${styles.imoSection} ${styles.middle}`}>
                      <h5>⚙️ MIDDLE (Orchestration Bay)</h5>
                      <div className={styles.orchestration}>
                        <div className={styles.orchestratorInfo}>
                          <strong>🎭 Orchestrator:</strong> {node.IMO.middle.orchestration.orchestrator}
                        </div>
                        <div className={styles.tools}>
                          <strong>🔧 Tools:</strong> {node.IMO.middle.orchestration.tools.join(', ')}
                        </div>
                        <div className={styles.operations}>
                          <strong>📋 Operations:</strong>
                          <ul>
                            {node.IMO.middle.operations.map((op, i) => (
                              <li key={i}>
                                <strong>{op.title}:</strong> {op.computation}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className={styles.gates}>
                          <span className={node.IMO.middle.promotion.gate ? styles.gateActive : styles.gateInactive}>
                            🚪 Promotion Gate: {node.IMO.middle.promotion.gate ? '✅' : '❌'}
                          </span>
                          {node.IMO.middle.promotion.human_firebreak && (
                            <span className={styles.firebreak}>🔥 Human Firebreak</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Output */}
                    <div className={styles.imoSection}>
                      <h5>📤 OUTPUT</h5>
                      <ul>
                        {node.IMO.output.map((output, i) => (
                          <li key={i}>→ {output}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ORBT Discipline */}
                  <div className={styles.orbtContainer}>
                    <h5>ORBT Discipline</h5>
                    <div className={styles.orbtGrid}>
                      <div className={styles.orbtItem}>
                        <strong>🔄 Operate:</strong>
                        <span>{node.ORBT.operate.join(' • ')}</span>
                      </div>
                      <div className={styles.orbtItem}>
                        <strong>🔧 Repair:</strong>
                        <span>{node.ORBT.repair.join(' • ')}</span>
                      </div>
                      <div className={styles.orbtItem}>
                        <strong>🏗️ Build:</strong>
                        <span>{node.ORBT.build.join(' • ')}</span>
                      </div>
                      <div className={styles.orbtItem}>
                        <strong>📚 Train:</strong>
                        <span>{node.ORBT.train.join(' • ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* CARB Runtime (if present) */}
                  {node.CARB && (
                    <div className={styles.carbContainer}>
                      <h5>CARB Runtime</h5>
                      <div className={styles.carbGrid}>
                        {node.CARB.compliance.length > 0 && (
                          <div className={styles.carbItem}>
                            <strong>✓ Compliance:</strong>
                            <span>{node.CARB.compliance.join(' • ')}</span>
                          </div>
                        )}
                        {node.CARB.automation.length > 0 && (
                          <div className={styles.carbItem}>
                            <strong>⚡ Automation:</strong>
                            <span>{node.CARB.automation.join(' • ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  {node.badges && (
                    <div className={styles.badges}>
                      {node.badges.map((badge, i) => (
                        <span key={i} className={styles.badge}>
                          🏷️ {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Schema Foundation */}
      <div className={styles.schemaFoundation}>
        <h3>Schema Grounding</h3>
        <div className={styles.schemaGrid}>
          <div className={styles.schemaItem}>
            <span className={styles.schemaIcon}>🗄️</span>
            <strong>{blueprint.schemas.neon.name}</strong>
            <p>Neon PostgreSQL</p>
          </div>
          <div className={styles.schemaItem}>
            <span className={styles.schemaIcon}>📝</span>
            <strong>{blueprint.schemas.firebase.name}</strong>
            <p>Firebase</p>
          </div>
          <div className={styles.schemaItem}>
            <span className={styles.schemaIcon}>📊</span>
            <strong>{blueprint.schemas.bigquery.name}</strong>
            <p>BigQuery</p>
          </div>
        </div>
      </div>
    </div>
  )
}