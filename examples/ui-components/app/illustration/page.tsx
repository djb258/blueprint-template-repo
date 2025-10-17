import fs from "node:fs";
import path from "node:path";
import * as YAML from "yaml";
import { CTBSchema } from "@/lib/ctbSchema";

function HeirCanopy({ heir }: any) {
  return (
    <div className="w-full rounded-md p-4 border text-center bg-gradient-to-b from-green-900/20 to-green-800/10 border-green-700">
      <div className="text-xl font-semibold text-green-100">{heir.name}</div>
      <div className="mt-1 text-yellow-300">{heir.acronym}</div>
      <p className="mt-2 text-sm opacity-80">{heir.description}</p>
    </div>
  );
}

function VerticalIMO({ node }: any) {
  return (
    <div className="rounded-md border p-3 w-80 bg-blue-900/20 border-blue-700">
      <div className="font-semibold mb-1 text-cyan-200">
        {node.label} <span className="text-xs opacity-70">({node.altitude})</span>
      </div>

      {/* Vertical IMO */}
      <section className="space-y-2">
        <div className="bg-black/20 p-2 rounded">
          <div className="text-sm font-medium text-yellow-300">📥 Input</div>
          <ul className="list-disc list-inside text-sm text-gray-300">
            {node.IMO.input.map((s: string, i: number) => (<li key={i}>{s}</li>))}
          </ul>
        </div>

        <div className="bg-yellow-900/20 p-2 rounded border border-yellow-700" style={{ transform: "scale(1.05)" }}>
          <div className="text-sm font-medium text-yellow-300">⚙️ Middle (Orchestration Bay)</div>
          <div className="text-xs opacity-80 mb-1 text-gray-300">
            🎭 Orchestrator: {node.IMO.middle.orchestration.orchestrator}
          </div>
          <ul className="list-disc list-inside text-sm">
            {node.IMO.middle.operations.map((op: any, i: number) => (
              <li key={i} className="text-gray-300">
                <div className="font-medium text-cyan-300">{op.title}</div>
                <div className="text-xs opacity-80">Tool: {op.tool}</div>
                <div className="text-xs opacity-80">Compute: {op.computation}</div>
              </li>
            ))}
          </ul>
          {node.IMO.middle.promotion && (
            <div className="mt-2 flex gap-2 text-xs">
              <span className={node.IMO.middle.promotion.gate ? "text-green-400" : "text-red-400"}>
                🚪 Gate: {node.IMO.middle.promotion.gate ? "✅" : "❌"}
              </span>
              {node.IMO.middle.promotion.human_firebreak && (
                <span className="text-orange-400">🔥 Human Firebreak</span>
              )}
            </div>
          )}
        </div>

        <div className="bg-black/20 p-2 rounded">
          <div className="text-sm font-medium text-yellow-300">📤 Output</div>
          <ul className="list-disc list-inside text-sm text-gray-300">
            {node.IMO.output.map((s: string, i: number) => (<li key={i}>{s}</li>))}
          </ul>
        </div>
      </section>

      {/* ORBT & CARB badges */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-purple-900/20 p-2 rounded">
          <div className="font-semibold mb-1 text-purple-300">ORBT</div>
          <ul className="list-disc list-inside text-gray-400">
            <li>🔄 Operate: {node.ORBT.operate.length}</li>
            <li>🔧 Repair: {node.ORBT.repair.length}</li>
            <li>🏗️ Build: {node.ORBT.build.length}</li>
            <li>📚 Train: {node.ORBT.train.length}</li>
          </ul>
        </div>
        {node.CARB && (
          <div className="bg-pink-900/20 p-2 rounded">
            <div className="font-semibold mb-1 text-pink-300">CARB</div>
            <ul className="list-disc list-inside text-gray-400">
              {node.CARB.compliance?.length > 0 && <li>✓ Compliance</li>}
              {node.CARB.automation?.length > 0 && <li>⚡ Automation</li>}
              {node.CARB.repair?.length > 0 && <li>🔧 Repair</li>}
              {node.CARB.blueprint?.length > 0 && <li>📋 Blueprint</li>}
            </ul>
          </div>
        )}
      </div>

      {/* Badges */}
      {node.badges && node.badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {node.badges.map((badge: string, i: number) => (
            <span key={i} className="text-xs px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              🏷️ {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function IllustrationPage() {
  const file = fs.readFileSync(path.join(process.cwd(), "ctb_blueprint.yaml"), "utf-8");
  const yaml = YAML.parse(file);
  const parsed = CTBSchema.parse(yaml);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto p-4 space-y-6">
        <HeirCanopy heir={parsed.heir} />
        
        <section className="text-center">
          <div className="text-4xl mb-2">⭐</div>
          <h1 className="text-2xl font-semibold text-yellow-300">{parsed.star.name}</h1>
          <p className="opacity-80 text-sm italic">{parsed.star.tagline}</p>
        </section>

        {/* Tree visualization SVG */}
        <div className="relative">
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 400">
            <path
              d="M 400 50 L 400 100 L 200 200 M 400 100 L 600 200 M 400 100 L 400 350"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
            />
          </svg>
          
          {/* Branches */}
          {parsed.branches.map((b: any) => (
            <section key={b.id} className="relative mt-8">
              <div className="text-lg font-semibold text-green-300 mb-3">
                {b.render_hints?.icon} {b.name} 
                <span className="text-xs opacity-70 ml-2">({b.altitude})</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {b.nodes.map((n: any) => (<VerticalIMO key={n.id} node={n} />))}
              </div>
            </section>
          ))}
        </div>

        {/* Schema Foundation */}
        <section className="mt-12 bg-gradient-to-b from-amber-900/20 to-amber-800/10 rounded-lg p-6 border border-amber-700">
          <h2 className="text-xl font-semibold text-center mb-4 text-yellow-300">Schema Grounding</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="border border-blue-700 rounded-md p-3 bg-blue-900/20">
              <div className="font-semibold text-blue-300">🗄️ {parsed.schemas.neon.name}</div>
              {(parsed.schemas.neon.sample_tables ?? []).map((t: any, i: number) => (
                <div key={i} className="mt-2 text-sm">
                  <div className="font-medium text-gray-300">{t.table}</div>
                  <div className="text-xs opacity-80">keys: {t.key_columns.join(", ")}</div>
                </div>
              ))}
            </div>
            <div className="border border-orange-700 rounded-md p-3 bg-orange-900/20">
              <div className="font-semibold text-orange-300">📝 {parsed.schemas.firebase.name}</div>
              {(parsed.schemas.firebase.sample_collections ?? []).map((c: any, i: number) => (
                <div key={i} className="mt-2 text-sm">
                  <div className="font-medium text-gray-300">{c.collection}</div>
                  <div className="text-xs opacity-80">fields: {c.key_fields.join(", ")}</div>
                </div>
              ))}
            </div>
            <div className="border border-purple-700 rounded-md p-3 bg-purple-900/20">
              <div className="font-semibold text-purple-300">📊 {parsed.schemas.bigquery.name}</div>
              {(parsed.schemas.bigquery.sample_datasets ?? []).map((d: any, i: number) => (
                <div key={i} className="mt-2 text-sm">
                  <div className="font-medium text-gray-300">{d.dataset}</div>
                  <div className="text-xs opacity-80">fields: {d.key_fields.join(", ")}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}