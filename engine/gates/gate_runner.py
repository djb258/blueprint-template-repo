#!/usr/bin/env python3
"""
Blueprint Engine - Gate Runner (Validation Layer)

Validates JSON inputs for gates 01-04:
  - 01_altitude.json: Multi-altitude planning (30k, 20k, 10k, 5k)
  - 02_imo.json: Input → Middle → Output structure
  - 03_ctb.json: Christmas Tree Backbone (HEIR canopy + branches)
  - 04_stack.json: Technology stack and deployment configuration

Fails fast if any required field is missing.
Exit code 0 = all gates pass, non-zero = validation failure.

Python 3.11+ compatible, standard library only.
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple


class GateRunner:
    """Validates blueprint JSON files against required schema."""

    def __init__(self, blueprints_dir: Path):
        """
        Initialize gate runner.

        Args:
            blueprints_dir: Path to directory containing JSON files to validate
        """
        self.blueprints_dir = blueprints_dir
        self.errors: List[str] = []
        self.warnings: List[str] = []

    def validate_altitude(self, data: Dict[str, Any]) -> bool:
        """
        Validate 01_altitude.json structure.

        Required fields:
          - altitudes.30000: Strategic vision
          - altitudes.20000: System architecture
          - altitudes.10000: Implementation details
          - altitudes.5000: Tactical execution

        Args:
            data: Parsed JSON data

        Returns:
            True if validation passes, False otherwise
        """
        passed = True

        if "altitudes" not in data:
            self.errors.append("01_altitude.json: Missing 'altitudes' root object")
            return False

        altitudes = data["altitudes"]
        required_levels = ["30000", "20000", "10000", "5000"]

        for level in required_levels:
            if level not in altitudes:
                self.errors.append(f"01_altitude.json: Missing altitude level '{level}'")
                passed = False
            elif not isinstance(altitudes[level], dict):
                self.errors.append(f"01_altitude.json: Altitude '{level}' must be an object")
                passed = False

        # Validate 30000 ft required fields
        if "30000" in altitudes:
            required_30k = ["project_name", "objective"]
            for field in required_30k:
                if field not in altitudes["30000"] or not altitudes["30000"][field]:
                    self.errors.append(f"01_altitude.json: Missing required field 'altitudes.30000.{field}'")
                    passed = False

        return passed

    def validate_imo(self, data: Dict[str, Any]) -> bool:
        """
        Validate 02_imo.json structure.

        Required fields:
          - input: System inputs and data sources
          - middle: Orchestration bay (tools, gates, orchestrators)
          - output: Deliverables and artifacts

        Args:
            data: Parsed JSON data

        Returns:
            True if validation passes, False otherwise
        """
        passed = True
        required_sections = ["input", "middle", "output"]

        for section in required_sections:
            if section not in data:
                self.errors.append(f"02_imo.json: Missing required section '{section}'")
                passed = False
            elif not isinstance(data[section], dict):
                self.errors.append(f"02_imo.json: Section '{section}' must be an object")
                passed = False

        # Validate middle orchestration
        if "middle" in data:
            if "orchestration" not in data["middle"]:
                self.warnings.append("02_imo.json: 'middle.orchestration' recommended for tooling clarity")

        return passed

    def validate_ctb(self, data: Dict[str, Any]) -> bool:
        """
        Validate 03_ctb.json structure.

        Required fields:
          - heir_canopy: Governance layer (History, Enforcement, Integrity, Repair)
          - star: Project center point
          - branches: Category branches with nodes

        Args:
            data: Parsed JSON data

        Returns:
            True if validation passes, False otherwise
        """
        passed = True
        required_sections = ["heir_canopy", "star", "branches"]

        for section in required_sections:
            if section not in data:
                self.errors.append(f"03_ctb.json: Missing required section '{section}'")
                passed = False

        # Validate HEIR canopy
        if "heir_canopy" in data:
            heir = data["heir_canopy"]
            required_heir = ["history", "enforcement", "integrity", "repair"]
            for field in required_heir:
                if field not in heir:
                    self.warnings.append(f"03_ctb.json: HEIR canopy missing '{field}' field")

        # Validate branches structure
        if "branches" in data:
            if not isinstance(data["branches"], list):
                self.errors.append("03_ctb.json: 'branches' must be an array")
                passed = False
            elif len(data["branches"]) == 0:
                self.warnings.append("03_ctb.json: No branches defined")

        return passed

    def validate_stack(self, data: Dict[str, Any]) -> bool:
        """
        Validate 04_stack.json structure.

        Required fields:
          - languages: Programming languages
          - frameworks: Application frameworks
          - databases: Data storage systems
          - deployment: Deployment configuration

        Args:
            data: Parsed JSON data

        Returns:
            True if validation passes, False otherwise
        """
        passed = True
        required_sections = ["languages", "frameworks", "deployment"]

        for section in required_sections:
            if section not in data:
                self.errors.append(f"04_stack.json: Missing required section '{section}'")
                passed = False

        # Validate deployment configuration
        if "deployment" in data:
            deployment = data["deployment"]
            if "target" not in deployment:
                self.warnings.append("04_stack.json: 'deployment.target' not specified")

        return passed

    def load_and_validate(self, filename: str, validator_func) -> Tuple[bool, Dict[str, Any]]:
        """
        Load JSON file and run validator.

        Args:
            filename: Name of JSON file to load
            validator_func: Validation function to apply

        Returns:
            Tuple of (validation_passed, parsed_data)
        """
        file_path = self.blueprints_dir / filename

        if not file_path.exists():
            self.errors.append(f"{filename}: File not found at {file_path}")
            return False, {}

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.errors.append(f"{filename}: Invalid JSON - {e}")
            return False, {}
        except Exception as e:
            self.errors.append(f"{filename}: Failed to read file - {e}")
            return False, {}

        validation_passed = validator_func(data)
        return validation_passed, data

    def run_all_gates(self) -> bool:
        """
        Run all validation gates (01-04).

        Returns:
            True if all gates pass, False if any fail
        """
        print("=" * 60)
        print("Blueprint Engine - Gate Validation")
        print("=" * 60)
        print(f"Validating blueprints in: {self.blueprints_dir}")
        print()

        gates = [
            ("01_altitude.json", self.validate_altitude),
            ("02_imo.json", self.validate_imo),
            ("03_ctb.json", self.validate_ctb),
            ("04_stack.json", self.validate_stack),
        ]

        all_passed = True

        for filename, validator in gates:
            print(f"Gate: {filename}...", end=" ")
            passed, _ = self.load_and_validate(filename, validator)

            if passed:
                print("[PASS]")
            else:
                print("[FAIL]")
                all_passed = False

        print()
        print("-" * 60)

        # Report errors
        if self.errors:
            print(f"ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"  [X] {error}")
            print()

        # Report warnings
        if self.warnings:
            print(f"WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  [!] {warning}")
            print()

        print("-" * 60)

        if all_passed and not self.errors:
            print("Result: [SUCCESS] ALL GATES PASSED")
            return True
        else:
            print("Result: [FAILURE] VALIDATION FAILED")
            return False


def main():
    """Main entry point for gate runner."""
    if len(sys.argv) < 2:
        print("Usage: python gate_runner.py <blueprints_dir>")
        print("Example: python gate_runner.py ../../blueprints/sample_blueprint")
        sys.exit(1)

    blueprints_dir = Path(sys.argv[1])

    if not blueprints_dir.exists():
        print(f"Error: Directory not found: {blueprints_dir}")
        sys.exit(1)

    runner = GateRunner(blueprints_dir)
    success = runner.run_all_gates()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
