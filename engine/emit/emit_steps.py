#!/usr/bin/env python3
"""
Blueprint Engine - Emit Steps (Generation Layer)

Reads blueprint.json and emits modular JSON files:
  - 01_altitude.json: Multi-altitude planning breakdown
  - 02_imo.json: Input → Middle → Output structure
  - 03_ctb.json: Christmas Tree Backbone visualization
  - 04_stack.json: Technology stack configuration
  - 05_build_prompt.txt: Human-readable build instructions
  - 06_ci_config.json: CI/CD configuration
  - manifest.json: File manifest with SHA256 hashes

Each file is kept under 10 KB for optimal LLM consumption.

Python 3.11+ compatible, standard library only.
"""

import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


class BlueprintEmitter:
    """Emits modular blueprint files from blueprint.json."""

    def __init__(self, blueprint_path: Path, output_dir: Path):
        """
        Initialize blueprint emitter.

        Args:
            blueprint_path: Path to source blueprint.json
            output_dir: Directory to write emitted files
        """
        self.blueprint_path = blueprint_path
        self.output_dir = output_dir
        self.blueprint_data: Dict[str, Any] = {}
        self.manifest: Dict[str, Any] = {
            "generated_at": datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
            "source_blueprint": str(blueprint_path),
            "files": {}
        }

    def load_blueprint(self) -> bool:
        """
        Load and parse blueprint.json.

        Returns:
            True if load successful, False otherwise
        """
        if not self.blueprint_path.exists():
            print(f"Error: Blueprint not found at {self.blueprint_path}")
            return False

        try:
            with open(self.blueprint_path, 'r', encoding='utf-8') as f:
                self.blueprint_data = json.load(f)
            print(f"[OK] Loaded blueprint: {self.blueprint_path}")
            return True
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON in blueprint - {e}")
            return False
        except Exception as e:
            print(f"Error: Failed to load blueprint - {e}")
            return False

    def emit_altitude(self) -> bool:
        """
        Emit 01_altitude.json with multi-altitude planning.

        Extracts 30k, 20k, 10k, 5k altitude data from blueprint.

        Returns:
            True if emission successful
        """
        altitudes = self.blueprint_data.get("altitudes", {})

        altitude_data = {
            "altitudes": {
                "30000": altitudes.get("30000", {
                    "project_name": self.blueprint_data.get("project_slug", ""),
                    "objective": "",
                    "success_criteria": [],
                    "stakeholders": []
                }),
                "20000": altitudes.get("20000", {
                    "components": [],
                    "roles": [],
                    "stages": [],
                    "inputs": [],
                    "outputs": []
                }),
                "10000": altitudes.get("10000", {
                    "steps": [],
                    "apis_services": [],
                    "decision_points": [],
                    "llms": [],
                    "compliance": []
                }),
                "5000": altitudes.get("5000", {
                    "documentation_plan": [],
                    "agent_roles": {},
                    "handoffs": [],
                    "firebreak_queue": {}
                })
            },
            "meta": self.blueprint_data.get("meta", {})
        }

        return self._write_json_file("01_altitude.json", altitude_data)

    def emit_imo(self) -> bool:
        """
        Emit 02_imo.json with Input → Middle → Output structure.

        Returns:
            True if emission successful
        """
        # Extract IMO structure from blueprint
        altitudes_10k = self.blueprint_data.get("altitudes", {}).get("10000", {})
        altitudes_20k = self.blueprint_data.get("altitudes", {}).get("20000", {})

        imo_data = {
            "input": {
                "data_sources": altitudes_20k.get("inputs", []),
                "external_apis": altitudes_10k.get("apis_services", []),
                "user_inputs": [],
                "config_files": []
            },
            "middle": {
                "orchestration": {
                    "tools": [],
                    "gates": ["gate_01", "gate_02", "gate_03", "gate_04"],
                    "orchestrators": [],
                    "decision_points": altitudes_10k.get("decision_points", [])
                },
                "processing": {
                    "llms": altitudes_10k.get("llms", []),
                    "transformations": [],
                    "validations": []
                }
            },
            "output": {
                "deliverables": altitudes_20k.get("outputs", []),
                "artifacts": [],
                "documentation": altitudes_10k.get("documentation_plan", []),
                "deployments": []
            },
            "doctrine": {
                "orbt": {
                    "operate": "How to run the system",
                    "repair": "How to fix issues",
                    "build": "How to enhance",
                    "train": "How to learn"
                }
            }
        }

        return self._write_json_file("02_imo.json", imo_data)

    def emit_ctb(self) -> bool:
        """
        Emit 03_ctb.json with Christmas Tree Backbone structure.

        Returns:
            True if emission successful
        """
        meta = self.blueprint_data.get("meta", {})
        trunk_root = self.blueprint_data.get("trunk_root", {})

        ctb_data = {
            "heir_canopy": {
                "history": "Audit trail and lineage tracking",
                "enforcement": "Doctrine compliance checks",
                "integrity": "Data validation and verification",
                "repair": "Self-healing and recovery mechanisms"
            },
            "star": {
                "project_name": self.blueprint_data.get("project_slug", ""),
                "unique_id": meta.get("unique_id", ""),
                "blueprint_version": meta.get("blueprint_version_hash", "")
            },
            "branches": [
                {
                    "name": "doctrine",
                    "category": "governance",
                    "nodes": [
                        {"id": "doctrine-001", "label": "HEIR Compliance", "type": "validation"},
                        {"id": "doctrine-002", "label": "ORBT Discipline", "type": "process"}
                    ]
                },
                {
                    "name": "input",
                    "category": "data_ingestion",
                    "nodes": []
                },
                {
                    "name": "middle",
                    "category": "orchestration",
                    "nodes": []
                },
                {
                    "name": "output",
                    "category": "delivery",
                    "nodes": []
                }
            ],
            "schema_foundation": trunk_root.get("schema_enforcement", []),
            "telemetry": trunk_root.get("telemetry", {})
        }

        return self._write_json_file("03_ctb.json", ctb_data)

    def emit_stack(self) -> bool:
        """
        Emit 04_stack.json with technology stack configuration.

        Returns:
            True if emission successful
        """
        # Infer stack from blueprint data
        trunk_root = self.blueprint_data.get("trunk_root", {})
        schemas = trunk_root.get("schema_enforcement", [])

        # Parse databases from schema enforcement
        databases = []
        for schema in schemas:
            if "Neon" in schema:
                databases.append({"name": "PostgreSQL", "provider": "Neon", "purpose": "vault"})
            elif "Firebase" in schema:
                databases.append({"name": "Firebase", "provider": "Google", "purpose": "workbench"})
            elif "BigQuery" in schema:
                databases.append({"name": "BigQuery", "provider": "Google", "purpose": "warehouse"})

        stack_data = {
            "languages": [
                "Python 3.11+",
                "TypeScript",
                "JavaScript"
            ],
            "frameworks": [
                "Next.js 14",
                "FastAPI",
                "React 18"
            ],
            "databases": databases,
            "deployment": {
                "target": "multi-platform",
                "platforms": [
                    {"name": "Vercel", "purpose": "frontend"},
                    {"name": "Render", "purpose": "backend"}
                ]
            },
            "integrations": {
                "mcp_servers": ["composio", "firebase", "github"],
                "apis": []
            },
            "doctrine": self.blueprint_data.get("meta", {}).get("doctrine", [])
        }

        return self._write_json_file("04_stack.json", stack_data)

    def emit_build_prompt(self) -> bool:
        """
        Emit 05_build_prompt.txt with human-readable build instructions.

        Returns:
            True if emission successful
        """
        meta = self.blueprint_data.get("meta", {})
        altitudes = self.blueprint_data.get("altitudes", {})
        altitude_30k = altitudes.get("30000", {})

        prompt_lines = [
            "=" * 60,
            "BLUEPRINT BUILD INSTRUCTIONS",
            "=" * 60,
            "",
            f"Project: {altitude_30k.get('project_name', self.blueprint_data.get('project_slug', 'Unnamed'))}",
            f"Objective: {altitude_30k.get('objective', 'Not specified')}",
            f"Blueprint Version: {meta.get('blueprint_version_hash', 'N/A')}",
            "",
            "-" * 60,
            "ALTITUDE BREAKDOWN",
            "-" * 60,
            "",
            "30,000 ft - STRATEGIC VISION",
            f"  Stakeholders: {', '.join(altitude_30k.get('stakeholders', ['None listed']))}",
            f"  Success Criteria: {len(altitude_30k.get('success_criteria', []))} defined",
            "",
            "20,000 ft - SYSTEM ARCHITECTURE",
            f"  Components: {len(altitudes.get('20000', {}).get('components', []))} components",
            f"  Roles: {len(altitudes.get('20000', {}).get('roles', []))} roles",
            "",
            "10,000 ft - IMPLEMENTATION",
            f"  Steps: {len(altitudes.get('10000', {}).get('steps', []))} implementation steps",
            f"  APIs/Services: {len(altitudes.get('10000', {}).get('apis_services', []))} integrations",
            "",
            "5,000 ft - TACTICAL EXECUTION",
            f"  Agent Roles: {len(altitudes.get('5000', {}).get('agent_roles', {}))} agents",
            f"  Handoffs: {len(altitudes.get('5000', {}).get('handoffs', []))} handoff points",
            "",
            "-" * 60,
            "DOCTRINE ENFORCEMENT",
            "-" * 60,
            "",
        ]

        doctrine = meta.get("doctrine", [])
        for d in doctrine:
            prompt_lines.append(f"  ✓ {d}")

        prompt_lines.extend([
            "",
            "-" * 60,
            "BUILD SEQUENCE",
            "-" * 60,
            "",
            "1. Validate all gates (make gate)",
            "2. Set up infrastructure from 04_stack.json",
            "3. Implement IMO structure from 02_imo.json",
            "4. Apply CTB governance from 03_ctb.json",
            "5. Follow altitude plan from 01_altitude.json",
            "6. Deploy per 06_ci_config.json",
            "",
            "=" * 60,
            f"Generated: {datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')}",
            "=" * 60,
            ""
        ])

        prompt_text = "\n".join(prompt_lines)
        return self._write_text_file("05_build_prompt.txt", prompt_text)

    def emit_ci_config(self) -> bool:
        """
        Emit 06_ci_config.json with CI/CD configuration.

        Returns:
            True if emission successful
        """
        meta = self.blueprint_data.get("meta", {})

        ci_config = {
            "version": "1.0",
            "doctrine_checks": {
                "enabled": True,
                "gates": ["01_altitude", "02_imo", "03_ctb", "04_stack"],
                "on_failure": "block_merge"
            },
            "pipelines": {
                "validate": {
                    "trigger": "on_pull_request",
                    "steps": [
                        {"name": "Run gate validation", "command": "make gate"},
                        {"name": "Check doctrine compliance", "command": "python tools/repo_compliance_check.py"}
                    ]
                },
                "build": {
                    "trigger": "on_push_to_main",
                    "steps": [
                        {"name": "Install dependencies", "command": "npm install && pip install -r requirements.txt"},
                        {"name": "Build artifacts", "command": "make build"},
                        {"name": "Run tests", "command": "make test"}
                    ]
                },
                "deploy": {
                    "trigger": "on_tag",
                    "steps": [
                        {"name": "Deploy frontend", "platform": "vercel"},
                        {"name": "Deploy backend", "platform": "render"}
                    ]
                }
            },
            "notifications": {
                "on_failure": ["github_status"],
                "on_success": ["github_status"]
            },
            "meta": {
                "blueprint_version": meta.get("blueprint_version_hash", ""),
                "doctrine": meta.get("doctrine", [])
            }
        }

        return self._write_json_file("06_ci_config.json", ci_config)

    def emit_manifest(self) -> bool:
        """
        Emit manifest.json with file inventory and SHA256 hashes.

        Returns:
            True if emission successful
        """
        manifest_data = {
            "manifest_version": "1.0",
            "generated_at": self.manifest["generated_at"],
            "source_blueprint": self.manifest["source_blueprint"],
            "files": self.manifest["files"],
            "summary": {
                "total_files": len(self.manifest["files"]),
                "total_size_bytes": sum(f["size_bytes"] for f in self.manifest["files"].values())
            }
        }

        # Write manifest without adding itself to manifest
        output_path = self.output_dir / "manifest.json"
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(manifest_data, f, indent=2, ensure_ascii=False)
            print(f"[OK] Emitted: manifest.json")
            return True
        except Exception as e:
            print(f"[FAIL] Failed to emit manifest.json: {e}")
            return False

    def _write_json_file(self, filename: str, data: Dict[str, Any]) -> bool:
        """
        Write JSON data to file and update manifest.

        Args:
            filename: Output filename
            data: Data to write as JSON

        Returns:
            True if write successful
        """
        output_path = self.output_dir / filename

        try:
            json_str = json.dumps(data, indent=2, ensure_ascii=False)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(json_str)

            # Calculate SHA256 hash
            sha256_hash = hashlib.sha256(json_str.encode('utf-8')).hexdigest()

            # Update manifest
            self.manifest["files"][filename] = {
                "sha256": sha256_hash,
                "size_bytes": len(json_str.encode('utf-8')),
                "type": "application/json"
            }

            print(f"[OK] Emitted: {filename} ({len(json_str)} bytes)")
            return True

        except Exception as e:
            print(f"[FAIL] Failed to emit {filename}: {e}")
            return False

    def _write_text_file(self, filename: str, content: str) -> bool:
        """
        Write text data to file and update manifest.

        Args:
            filename: Output filename
            content: Text content to write

        Returns:
            True if write successful
        """
        output_path = self.output_dir / filename

        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)

            # Calculate SHA256 hash
            sha256_hash = hashlib.sha256(content.encode('utf-8')).hexdigest()

            # Update manifest
            self.manifest["files"][filename] = {
                "sha256": sha256_hash,
                "size_bytes": len(content.encode('utf-8')),
                "type": "text/plain"
            }

            print(f"[OK] Emitted: {filename} ({len(content)} bytes)")
            return True

        except Exception as e:
            print(f"✗ Failed to emit {filename}: {e}")
            return False

    def emit_all(self) -> bool:
        """
        Emit all blueprint files.

        Returns:
            True if all emissions successful
        """
        print("=" * 60)
        print("Blueprint Engine - Emit Steps")
        print("=" * 60)
        print(f"Source: {self.blueprint_path}")
        print(f"Output: {self.output_dir}")
        print()

        # Ensure output directory exists
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Load blueprint
        if not self.load_blueprint():
            return False

        print()
        print("Emitting modular files...")
        print("-" * 60)

        # Emit all files
        results = [
            self.emit_altitude(),
            self.emit_imo(),
            self.emit_ctb(),
            self.emit_stack(),
            self.emit_build_prompt(),
            self.emit_ci_config(),
        ]

        # Emit manifest last
        results.append(self.emit_manifest())

        print("-" * 60)

        if all(results):
            print(f"[SUCCESS] All files emitted to {self.output_dir}")
            return True
        else:
            print("[FAILURE] Some files failed to emit")
            return False


def main():
    """Main entry point for emit steps."""
    import sys

    if len(sys.argv) < 3:
        print("Usage: python emit_steps.py <blueprint.json> <output_dir>")
        print("Example: python emit_steps.py ../../blueprint.json ../../blueprints/sample_blueprint")
        sys.exit(1)

    blueprint_path = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])

    emitter = BlueprintEmitter(blueprint_path, output_dir)
    success = emitter.emit_all()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
