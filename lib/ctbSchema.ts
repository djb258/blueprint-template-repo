import { z } from 'zod'

// HEIR Schema
const HEIRSchema = z.object({
  name: z.string(),
  acronym: z.string(),
  description: z.string(),
  render_hints: z.object({
    style: z.string(),
    badge: z.string(),
    legend: z.boolean()
  }).optional()
})

// IMO Middle Orchestration Schema
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

// IMO Schema
const IMOSchema = z.object({
  input: z.array(z.string()),
  middle: IMOMiddleSchema,
  output: z.array(z.string())
})

// ORBT Schema
const ORBTSchema = z.object({
  operate: z.array(z.string()),
  repair: z.array(z.string()),
  build: z.array(z.string()),
  train: z.array(z.string())
})

// CARB Schema
const CARBSchema = z.object({
  compliance: z.array(z.string()),
  automation: z.array(z.string()),
  repair: z.array(z.string()),
  blueprint: z.array(z.string())
})

// Node Schema
const NodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  altitude: z.string(),
  orientation: z.literal("vertical"),
  IMO: IMOSchema,
  ORBT: ORBTSchema,
  CARB: CARBSchema.optional(),
  links: z.object({
    repo: z.string().url(),
    render_endpoint: z.string().url(),
    firebase_doc: z.string().optional(),
    neon_table: z.string().optional()
  }).optional(),
  badges: z.array(z.string()).optional()
})

// Branch Schema
const BranchSchema = z.object({
  id: z.string(),
  name: z.string(),
  altitude: z.string(),
  render_hints: z.object({
    icon: z.string()
  }),
  nodes: z.array(NodeSchema)
})

// Star Schema
const StarSchema = z.object({
  id: z.string(),
  name: z.string(),
  altitude: z.string(),
  tagline: z.string(),
  render_hints: z.object({
    icon: z.string(),
    emphasis: z.boolean()
  })
})

// Schema Tables
const NeonTableSchema = z.object({
  table: z.string(),
  key_columns: z.array(z.string())
})

const FirebaseCollectionSchema = z.object({
  collection: z.string(),
  key_fields: z.array(z.string())
})

const BigQueryDatasetSchema = z.object({
  dataset: z.string(),
  key_fields: z.array(z.string())
})

// Schemas Schema
const SchemasSchema = z.object({
  neon: z.object({
    name: z.string(),
    sample_tables: z.array(NeonTableSchema).optional(),
    render_hints: z.object({
      icon: z.string()
    }).optional()
  }),
  firebase: z.object({
    name: z.string(),
    sample_collections: z.array(FirebaseCollectionSchema).optional(),
    render_hints: z.object({
      icon: z.string()
    }).optional()
  }),
  bigquery: z.object({
    name: z.string(),
    sample_datasets: z.array(BigQueryDatasetSchema).optional(),
    render_hints: z.object({
      icon: z.string()
    }).optional()
  })
})

// Legend Schema
const LegendSchema = z.object({
  altitudes: z.array(z.object({
    label: z.string(),
    description: z.string()
  })),
  acronyms: z.record(z.string())
})

// Constraints Schema
const ConstraintsSchema = z.object({
  require_heir_canopy: z.boolean(),
  require_vertical_imo: z.boolean(),
  require_orbt_per_node: z.boolean(),
  require_middle_operations: z.boolean(),
  require_schemas_base: z.boolean(),
  allow_carb_optional: z.boolean()
})

// Main CTB Schema
export const CTBSchema = z.object({
  meta: z.object({
    spec_version: z.string(),
    doctrine_lock: z.boolean(),
    notes: z.array(z.string())
  }),
  heir: HEIRSchema,
  star: StarSchema,
  branches: z.array(BranchSchema),
  schemas: SchemasSchema,
  legend: LegendSchema,
  constraints: ConstraintsSchema,
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

export type CTBBlueprint = z.infer<typeof CTBSchema>
export type CTBNode = z.infer<typeof NodeSchema>
export type CTBBranch = z.infer<typeof BranchSchema>