# CTB Doctrine One-Pager - Plasmic Implementation Guide

## Step-by-Step Plasmic Build

### 1. Setup New Plasmic Project

1. Go to [plasmic.app](https://plasmic.app) 
2. Create new project: "CTB Doctrine Explainer"
3. Set canvas size: Desktop first (1200px wide)
4. Choose blank template

### 2. Global Design System

#### Colors (Design Tokens)
```
Create these color tokens in Plasmic:

Primary Colors:
- heir-green: #2E8B57
- imo-blue: #4169E1  
- orbt-purple: #9370DB
- carb-red: #DC143C
- schema-brown: #8B4513
- star-gold: #FFD700

Neutrals:
- dark-bg: #1e3c72
- dark-bg-secondary: #2a5298
- text-primary: #ffffff
- text-secondary: #e2e8f0
- text-muted: #94a3b8

Accents:
- success: #10b981
- warning: #f59e0b
- error: #ef4444
```

#### Typography Scale
```
Create text styles:

Hero Headline: 
- Font: Inter Bold
- Size: 3.5rem (56px)
- Line height: 1.1
- Color: text-primary

Section Headline:
- Font: Inter Semibold  
- Size: 2.25rem (36px)
- Line height: 1.2
- Color: text-primary

Card Title:
- Font: Inter Medium
- Size: 1.5rem (24px)
- Line height: 1.3
- Color: text-primary

Body Text:
- Font: Inter Regular
- Size: 1rem (16px)  
- Line height: 1.6
- Color: text-secondary

Code Text:
- Font: Fira Code
- Size: 0.875rem (14px)
- Background: rgba(0,0,0,0.3)
- Padding: 2px 6px
- Border radius: 4px
```

### 3. Component Library

#### A. HEIRBanner Component

**Structure:**
```
HEIRBanner [Full width container]
├── Background: Linear gradient (heir-green to darker heir-green)
├── Content Container [Max width 1200px, centered]
│   ├── Pattern Overlay [Diagonal stripes, opacity 10%]
│   ├── Title: "HEIR CANOPY" [Hero headline style]
│   ├── Subtitle: "History • Enforcement • Integrity • Repair" [Section headline]
│   └── Description [Body text, max-width 600px, centered]
```

**Styling:**
- Height: 120px
- Padding: 2rem vertical
- Border bottom: 3px solid darker heir-green
- Shadow: Large shadow underneath

#### B. DoctrineCard Component

**Props:**
- icon (text): Emoji like "🏛️"
- title (text): "HEIR CANOPY"  
- subtitle (text): "History • Enforcement • Integrity • Repair"
- description (text): Long description
- color (color): Primary color for accents

**Structure:**
```
DoctrineCard [Card container]
├── Card Background [White with subtle shadow]
├── Color Bar [Top border, 4px, using prop color]
├── Content Wrapper [Padding 1.5rem]
│   ├── Icon [Large emoji, centered]
│   ├── Title [Card title style]
│   ├── Subtitle [Smaller text, prop color]
│   ├── Description [Body text]
│   └── Features List [Bullet points]
```

**Hover State:**
- Transform: translateY(-4px)
- Shadow: Larger shadow
- Color bar: Slightly more opacity

#### C. IMOStructure Component

**Structure:**
```
IMOStructure [Three column grid]
├── Input Column [1fr]
│   ├── Header: "📥 INPUT" [Card title + icon]
│   ├── Description [Body text]  
│   └── List Items [Bullet list]
├── Middle Column [1.5fr - EMPHASIZED]
│   ├── Header: "⚙️ MIDDLE" [Larger, highlighted]
│   ├── Emphasis Box [Background color, border]
│   ├── Description [Highlighted text]
│   └── Detailed List [More items, nested]
└── Output Column [1fr]
    ├── Header: "📤 OUTPUT" [Card title + icon]
    ├── Description [Body text]
    └── List Items [Bullet list]
```

**Middle Column Special Styling:**
- Background: rgba(imo-blue, 0.1)
- Border: 2px solid imo-blue
- Transform: scale(1.05)
- Shadow: More prominent
- All text slightly larger

#### D. CommandCard Component

**Props:**
- number (text): "1"
- title (text): "VALIDATE YOUR BLUEPRINT"
- command (text): "npm run validate:ctb"
- description (text): Description
- features (list): Checkmark list

**Structure:**
```
CommandCard [Terminal-style card]
├── Card Background [Dark, code-like]
├── Number Badge [Circular, bright color]
├── Title [Card title, bright text]
├── Terminal Window
│   ├── Terminal Header [Dots, window controls]
│   ├── Command Line [Code text, syntax highlighting]
│   └── Output Preview [Success message]
├── Description [Body text]
└── Feature List [Checkmarks + text]
```

**Styling:**
- Background: #1a1a1a (dark)
- Border: 1px solid #333
- Terminal window: Authentic terminal colors
- Command: Green text on dark background

#### E. CTBNode Component

**Structure:**
```
CTBNode [Vertical card layout]
├── Node Header
│   ├── Icon: "🔷"
│   ├── Title: Node name
│   └── Altitude Badge: "[10k altitude]"
├── IMO Section [Three blocks]
│   ├── Input Block [Collapsed list]
│   ├── Middle Block [EMPHASIZED, expanded]
│   └── Output Block [Collapsed list]
├── ORBT Section [Four small badges]
│   ├── Operate Badge
│   ├── Repair Badge  
│   ├── Build Badge
│   └── Train Badge
└── Footer Badges [Horizontal chips]
```

**Interactive:**
- Click to expand/collapse sections
- Hover to highlight related parts
- Middle section always emphasized

#### F. BenefitCard Component

**Props:**
- icon (text): "✅" 
- title (text): Benefit title
- description (text): Benefit description
- quote (text): Customer quote

**Structure:**
```
BenefitCard [Clean card layout]
├── Icon [Large checkmark or relevant emoji]
├── Title [Card title style]
├── Description [Body text, good line height]
├── Quote Block [Italic, indented]
│   ├── Quote Text [Italic style]
│   └── Attribution [Smaller text]
└── Background [Subtle gradient]
```

### 4. Page Layout Implementation

#### Section 1: Hero
```
Hero Section [Full viewport height]
├── HEIRBanner Component [Top]
├── Content Container [Centered, max-width]
│   ├── Star Icon [Large, animated pulse]
│   ├── Main Headline [Hero text style]
│   ├── Tagline [Highlighted text]
│   ├── Description [Body text, max-width 600px]
│   └── CTA Buttons [Primary + Secondary]
└── Background [Gradient from dark-bg to dark-bg-secondary]
```

**Animations:**
- Star icon: Pulse animation (scale 1 to 1.1)
- Text: Fade in from bottom with stagger
- Buttons: Hover lift effect

#### Section 2: Doctrine Overview
```
Doctrine Section [Padding top/bottom 4rem]
├── Section Header [Centered]
│   ├── Title: "The Five Pillars of CTB Doctrine"
│   └── Subtitle: "Built for systems that scale..."
└── Doctrine Grid [5 columns, responsive to 1 column mobile]
    ├── DoctrineCard [HEIR, heir-green]
    ├── DoctrineCard [IMO, imo-blue]  
    ├── DoctrineCard [ORBT, orbt-purple]
    ├── DoctrineCard [CARB, carb-red]
    └── DoctrineCard [Schema, schema-brown]
```

**Responsive Breakpoints:**
- Desktop: 5 columns
- Tablet: 2-3 columns  
- Mobile: 1 column

#### Section 3: IMO Deep Dive
```
IMO Section [Special background treatment]
├── Background [Subtle imo-blue gradient]
├── Section Header [Problem/solution format]
│   ├── Problem: "❌ Common Mistake..."
│   └── Solution: "✅ Reality..."
├── IMOStructure Component [Three columns]
└── Key Insight Box [Highlighted callout]
```

**Special Styling:**
- Different background color
- Middle column emphasized with transform
- Insight box with border and icon

#### Section 4: Commands
```
Commands Section [Dark background]
├── Section Header 
└── Command Grid [3 columns]
    ├── CommandCard [Validate]
    ├── CommandCard [Visualize]  
    └── CommandCard [Deploy]
```

**Background:**
- Darker than main sections
- Code/terminal aesthetic
- Subtle dot pattern overlay

#### Section 5: Benefits
```
Benefits Section
├── Section Header
└── Benefits Grid [2x2 grid, responsive]
    ├── BenefitCard [Doctrine Enforcement]
    ├── BenefitCard [Visual Clarity]
    ├── BenefitCard [Operational Intelligence]
    └── BenefitCard [Schema Grounding]
```

#### Section 6: Live Example
```
Example Section [Full width background]
├── Section Header
└── CTBNode Component [Large, centered]
    └── Fully expanded with all details
```

#### Section 7: CTA
```
CTA Section [Full width, gradient background]
├── Final Headline [Large, centered]
├── CTA Button Grid [3 buttons horizontal]
│   ├── GitHub Button
│   ├── Demo Button
│   └── Docs Button  
└── Footer Note [Small text, centered]
```

### 5. Responsive Design

#### Mobile Adaptations
- Stack all grids to single column
- Reduce font sizes appropriately
- Adjust padding/margins
- Make CTAButtons full width
- Simplify IMO structure to vertical stack

#### Tablet Adaptations  
- 2-3 column grids where appropriate
- Maintain emphasis on Middle column in IMO
- Adjust component sizing

### 6. Animations & Interactions

#### Scroll Animations
```javascript
// Add these as Plasmic interactions:

1. Fade In From Bottom:
   - Trigger: Element enters viewport
   - Effect: Opacity 0 → 1, translateY(20px) → 0
   - Duration: 600ms, ease-out

2. Card Hover Lift:
   - Trigger: Mouse enter
   - Effect: translateY(0) → translateY(-4px)
   - Shadow: increase blur and spread
   - Duration: 200ms

3. Star Pulse:
   - Trigger: Page load
   - Effect: scale(1) → scale(1.1) → scale(1)
   - Duration: 2s, infinite loop

4. Command Copy:
   - Trigger: Click command text
   - Effect: Copy to clipboard + temporary "Copied!" message
```

### 7. SEO & Performance

#### Meta Tags
```html
<title>CTB Doctrine | Christmas Tree Backbone Visualization System</title>
<meta name="description" content="Transform complex systems into doctrine-compliant visualizations. HEIR canopy, vertical IMO, ORBT discipline, CARB runtime, schema grounding.">
<meta name="keywords" content="architecture, visualization, doctrine, CTB, system design">
```

#### Performance Optimizations
- Use Plasmic's built-in image optimization
- Minimize custom code components
- Use Plasmic's responsive image features
- Enable lazy loading for below-fold content

### 8. Launch Checklist

- [ ] All components created and styled
- [ ] Responsive design tested on all breakpoints
- [ ] All copy and content added
- [ ] Links to GitHub repo and demo working
- [ ] SEO meta tags configured
- [ ] Performance optimized
- [ ] Cross-browser testing complete
- [ ] Publish to custom domain or Plasmic subdomain

### 9. Post-Launch

#### Analytics to Track
- Time on page
- Scroll depth (especially to IMO section)
- Click-through rate to GitHub repo
- Click-through rate to live demo
- Mobile vs desktop usage

#### A/B Tests to Consider
- Hero headline variations
- CTA button text
- IMO section prominence
- Benefits order and messaging