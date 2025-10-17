# Blueprint Console UI

A modern React-based UI for the Blueprint Engine.

## Overview

This UI provides a visual interface for interacting with the Blueprint Engine's
validation and emission capabilities. Built with Vite, React, TypeScript, and Shadcn UI.

## Quick Start

```bash
cd ui
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`

## Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **React Router** - Navigation

## Integration with Blueprint Engine

The UI connects to the Blueprint Engine through API endpoints that call:

- `python ../engine/gates/gate_runner.py` - Validation
- `python ../engine/emit/emit_steps.py` - Blueprint generation

Blueprint outputs from `../blueprints/sample_blueprint/` are displayed in the UI.

## Structure

```
ui/
├── src/
│   ├── components/       # UI components
│   │   ├── Header.tsx
│   │   ├── LeftPanel.tsx
│   │   ├── RightPanel.tsx
│   │   └── ui/           # Shadcn components
│   ├── pages/
│   │   └── BlueprintConsole.tsx
│   ├── lib/              # Utilities
│   └── App.tsx
├── public/               # Static assets
└── package.json
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- **Edit Mode** - Visual block ID indicators for easy component editing
- **Two-Panel Layout** - Left panel for controls, right panel for output
- **Dark Mode** - Built-in theme support
- **Responsive** - Mobile-friendly design

## Connecting to Engine

The UI will be configured to:
1. Trigger `make emit` to generate blueprints
2. Run `make gate` to validate outputs
3. Display results from `blueprints/sample_blueprint/`
4. Show manifest.json for file integrity

## Next Steps

1. Add API routes to trigger engine commands
2. Display blueprint JSON files in the UI
3. Add real-time validation feedback
4. Integrate with manifest.json for version tracking
