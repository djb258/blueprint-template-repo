import React, { useEffect, useState } from 'react'
import { CTBVisualization } from '../components/CTBVisualization'
import yaml from 'js-yaml'

export default function CTBDashboard() {
  const [blueprint, setBlueprint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [doctrineStatus, setDoctrineStatus] = useState({
    heir_canopy: false,
    vertical_imo: false,
    orbt_discipline: false,
    schema_grounding: false,
    promotion_gates: false
  })

  useEffect(() => {
    loadBlueprint()
  }, [])

  const loadBlueprint = async () => {
    try {
      // In production, this would fetch from your API
      // For now, we'll load the local YAML file
      const response = await fetch('/api/ctb-blueprint')
      const yamlText = await response.text()
      const parsed = yaml.load(yamlText)
      
      setBlueprint(parsed)
      
      // Validate doctrine compliance
      const status = await validateDoctrine(parsed)
      setDoctrineStatus(status)
      
      setLoading(false)
    } catch (err) {
      console.error('Failed to load CTB blueprint:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const validateDoctrine = async (blueprint) => {
    // In production, call your validation API
    // For now, basic client-side checks
    return {
      heir_canopy: !!blueprint.heir,
      vertical_imo: blueprint.branches?.every(b => 
        b.nodes?.every(n => n.orientation === 'vertical' && n.IMO)
      ),
      orbt_discipline: blueprint.branches?.every(b =>
        b.nodes?.every(n => n.ORBT)
      ),
      schema_grounding: !!blueprint.schemas?.neon && 
                       !!blueprint.schemas?.firebase && 
                       !!blueprint.schemas?.bigquery,
      promotion_gates: blueprint.branches?.every(b =>
        b.nodes?.every(n => n.IMO?.middle?.promotion?.gate !== undefined)
      )
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading CTB Blueprint...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>❌ Failed to Load CTB Blueprint</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Doctrine Status Bar */}
      <div className="doctrine-status-bar">
        <h3>📋 Doctrine Compliance</h3>
        <div className="status-indicators">
          <div className={`indicator ${doctrineStatus.heir_canopy ? 'pass' : 'fail'}`}>
            <span className="icon">{doctrineStatus.heir_canopy ? '✅' : '❌'}</span>
            <span>HEIR Canopy</span>
          </div>
          <div className={`indicator ${doctrineStatus.vertical_imo ? 'pass' : 'fail'}`}>
            <span className="icon">{doctrineStatus.vertical_imo ? '✅' : '❌'}</span>
            <span>Vertical IMO</span>
          </div>
          <div className={`indicator ${doctrineStatus.orbt_discipline ? 'pass' : 'fail'}`}>
            <span className="icon">{doctrineStatus.orbt_discipline ? '✅' : '❌'}</span>
            <span>ORBT Discipline</span>
          </div>
          <div className={`indicator ${doctrineStatus.schema_grounding ? 'pass' : 'fail'}`}>
            <span className="icon">{doctrineStatus.schema_grounding ? '✅' : '❌'}</span>
            <span>Schema Grounding</span>
          </div>
          <div className={`indicator ${doctrineStatus.promotion_gates ? 'pass' : 'fail'}`}>
            <span className="icon">{doctrineStatus.promotion_gates ? '✅' : '❌'}</span>
            <span>Promotion Gates</span>
          </div>
        </div>
      </div>

      {/* CTB Visualization */}
      {blueprint && <CTBVisualization blueprint={blueprint} />}

      {/* Export Options */}
      <div className="export-options">
        <h3>📤 Export Options</h3>
        <div className="export-buttons">
          <button onClick={() => exportToWhimsical(blueprint)}>
            🎨 Export to Whimsical
          </button>
          <button onClick={() => exportToJSON(blueprint)}>
            📄 Download JSON
          </button>
          <button onClick={() => exportToMarkdown(blueprint)}>
            📝 Export Markdown
          </button>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          color: white;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .doctrine-status-bar {
          background: rgba(0, 0, 0, 0.3);
          padding: 1.5rem;
          margin: 0;
          backdrop-filter: blur(10px);
        }

        .doctrine-status-bar h3 {
          color: white;
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .status-indicators {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .indicator.pass {
          background: rgba(0, 255, 0, 0.2);
          border: 2px solid #00ff00;
        }

        .indicator.fail {
          background: rgba(255, 0, 0, 0.2);
          border: 2px solid #ff0000;
        }

        .indicator .icon {
          font-size: 1.2rem;
        }

        .export-options {
          background: rgba(0, 0, 0, 0.3);
          padding: 2rem;
          margin: 2rem 0 0 0;
          backdrop-filter: blur(10px);
          text-align: center;
        }

        .export-options h3 {
          color: white;
          margin: 0 0 1.5rem 0;
        }

        .export-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .export-buttons button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .export-buttons button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .error-container button {
          padding: 0.75rem 2rem;
          background: #4169E1;
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  )
}

// Export functions
function exportToWhimsical(blueprint) {
  // Convert to Whimsical-compatible JSON
  const whimsicalData = {
    diagram_type: 'flowchart',
    theme: 'christmas_tree',
    // ... conversion logic
  }
  
  const blob = new Blob([JSON.stringify(whimsicalData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ctb-whimsical.json'
  a.click()
}

function exportToJSON(blueprint) {
  const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ctb-blueprint.json'
  a.click()
}

function exportToMarkdown(blueprint) {
  let markdown = `# ${blueprint.star?.name}\n\n`
  markdown += `## HEIR Canopy\n${blueprint.heir?.acronym}\n\n`
  // ... generate markdown representation
  
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ctb-blueprint.md'
  a.click()
}