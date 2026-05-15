# AI-Layoffs Tracker — Redesign Plan

## Design Philosophy

**Not a dashboard. A terminal.**

The site should feel like a Bloomberg Terminal or a premium financial data product — not a SaaS admin panel. Information density is high, but every pixel is intentional. No decoration. No gradients. No emojis. The data is the design.

## What "AI Slop" Looks Like (Current Site)

- 🤖 emoji brand name
- 📊📋 emojis in section headers
- #0f172a generic Tailwind slate dark background
- Red-400 to green-400 gradient text on hero
- Default Recharts with visible grid lines and axes
- Rounded-lg cards with slate-700 borders
- Generic bordered table with alternating row backgrounds
- "Layoffs / $1B AI" — a made-up metric nobody asked for
- Cookie-cutter Tailwind spacing and typography

## What Premium Looks Like (Target)

- Pure black background (#000000)
- Zero emojis anywhere in the UI
- Typography is the hero — massive, tight tracking, weight contrast
- Data presented like it matters — monospace numbers, aligned columns
- Single accent color, used sparingly
- 1px borders in #1a1a1a, not rounded shadow cards
- Charts with no grid lines, no axes labels, minimal
- Bloomberg Terminal information density without the clutter

---

## Color System

### Backgrounds

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-base` | `#000000` | Page background |
| `bg-surface` | `#0a0a0a` | Elevated surface (header, footer) |
| `bg-hover` | `#111111` | Hover states on rows |
| `bg-active` | `#1a1a1a` | Active/selected states |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#fafafa` | Headlines, primary data |
| `text-secondary` | `#a3a3a3` | Labels, descriptions |
| `text-tertiary` | `#525252` | Timestamps, meta |
| `text-muted` | `#262626` | Disabled, placeholders |

### Accent — Two Data Types ONLY

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-layoff` | `#e11d48` | Layoff numbers, layoff bars, layoff indicators |
| `accent-investment` | `#06b6d4` | AI investment numbers, investment bars |
| `accent-brand` | `#fafafa` | Logo, brand moments |

**Rules:**
- NO gradients anywhere
- NO green for AI (too obvious/cheap)
- NO red for layoffs (use rose/salmon — #e11d48 is rose-600)
- NO background colors behind numbers
- The two accents appear ONLY on the data itself, never on UI chrome

### Borders

| Token | Hex | Usage |
|-------|-----|-------|
| `border-subtle` | `#171717` | Row separators, section dividers |
| `border-hover` | `#262626` | Hover border states |

---

## Typography

### Font Stack

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", "Fira Code", "Menlo", monospace;
```

**Install:** `npm install @fontsource/inter @fontsource/jetbrains-mono`

### Type Scale

| Token | Size | Weight | Tracking | Line Height | Usage |
|-------|------|--------|----------|-------------|-------|
| `display` | 48px | 700 | -0.03em | 1.1 | Hero headline |
| `title-1` | 32px | 600 | -0.02em | 1.2 | Page titles |
| `title-2` | 24px | 600 | -0.01em | 1.3 | Section headers |
| `title-3` | 18px | 500 | 0 | 1.4 | Card titles |
| `body` | 14px | 400 | 0 | 1.5 | Body text |
| `body-sm` | 13px | 400 | 0 | 1.5 | Descriptions |
| `caption` | 12px | 500 | 0.02em | 1.4 | Labels, uppercase |
| `data-lg` | 28px | 500 | -0.02em | 1 | Large stat numbers |
| `data-md` | 18px | 500 | -0.01em | 1 | Medium stat numbers |
| `data-sm` | 13px | 500 | 0 | 1 | Table numbers (MONO) |

**All numbers in data tables use `font-mono`.** This ensures alignment.

---

## Spacing System

Use a 4px base grid. No arbitrary Tailwind spacing.

| Token | Value |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 24px |
| `space-6` | 32px |
| `space-7` | 48px |
| `space-8` | 64px |
| `space-9` | 96px |

---

## Layout

### Page Structure

```
┌────────────────────────────────────────┐
│  AI-Layoffs          About  GitHub       │  ← Fixed header, 48px height
├────────────────────────────────────────┤
│                                        │
│  THE LAYOFFS                           │  ← Hero, massive type
│  AND THE INVESTMENT                    │
│                                        │
│  [total stats row]                     │  ← 4 stat cards, horizontal
│                                        │
│  ───────────────────────────────────── │  ← 1px border
│                                        │
│  [chart: layoffs vs AI over time]      │  ← Full width, minimal
│                                        │
│  ───────────────────────────────────── │
│                                        │
│  ALL COMPANIES                         │  ← Section header
│                                        │
│  Company          Sector    Layoffs    │  ← Data table
│  ───────────────────────────────────── │
│  Meta             Big Tech  27,000     │
│  Amazon           Big Tech  38,000     │
│  ...                                   │
│                                        │
├────────────────────────────────────────┤
│  © 2026  ·  GitHub  ·  Live Site       │  ← Minimal footer
└────────────────────────────────────────┘
```

### Header

- Height: 48px
- Background: #0a0a0a (bg-surface)
- Border-bottom: 1px solid #171717
- Left: "AI-Layoffs" in `title-3` weight 600
- Right: "About", "GitHub" in `body-sm` weight 400, text-secondary
- No logo icon. Text only.
- Position: sticky top

### Hero

```
THE LAYOFFS          ← display, weight 700, text-primary
AND THE INVESTMENT   ← display, weight 700, text-primary
```

- Padding-top: space-8 (64px)
- Padding-bottom: space-6 (32px)
- Subtitle below: "Tech companies are firing thousands of employees while spending billions on artificial intelligence." — `body`, text-secondary, max-width 560px
- NO gradient text. NO emojis.

### Stats Row (4 cards, horizontal)

Below hero, before the chart. Four numbers in a row:

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ 108,724  │  │ $725B    │  │ 22       │  │ 60+      │
│ Laid Off │  │ AI Spend │  │ Companies│  │ Events   │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

- Number: `data-lg`, font-mono, text-primary
- Label: `caption`, uppercase, text-tertiary
- Border: 1px solid #171717
- Padding: space-4 (16px)
- No background color change (stays #000000)
- On hover: border-color #262626

### Chart Section

- Section title: "OVER TIME" in `title-2` weight 600
- Chart: dual-axis line chart
  - Layoff line: #e11d48 (rose), 2px stroke
  - AI investment line: #06b6d4 (cyan), 2px stroke
  - NO grid lines
  - NO axis labels (use custom tooltip)
  - X-axis: years, minimal ticks
  - Y-axis: no visible labels, just ticks
  - Tooltip: custom dark tooltip with data values
  - Background: transparent
  - Height: 300px
  - Margin: minimal

### Company Table

This is the most important UI element. It should feel like a terminal.

**Columns:**

| Company | Sector | Layoffs | AI Investment | Last Event |
|---------|--------|---------|---------------|------------|

**Design:**
- Full width
- Header row: `caption`, uppercase, text-tertiary, padding-y 12px
- Border-bottom on header: 1px solid #171717
- Data rows: padding-y 16px
- Row separator: 1px solid #171717 (subtle)
- NO alternating row backgrounds
- Hover: background #0a0a0a (not #111 — keep it subtle)
- Company name: `body`, weight 500, text-primary
- Sector: `caption`, text-tertiary, uppercase
- Layoffs: `data-sm`, font-mono, text-primary with a small ● rose indicator before number
- AI Investment: `data-sm`, font-mono, text-primary with a small ● cyan indicator before number
- Last Event: `body-sm`, text-tertiary, date only (e.g., "May 2025")
- Sortable columns: click header to sort, show ↑↓ indicator

**Remove:**
- ❌ "Layoffs / $1B AI" column — this is a meaningless metric
- ❌ Rounded corners on table
- ❌ Background colors on cells
- ❌ Emoji indicators

**Add:**
- ✅ Small colored dot (●) before each number to indicate type
- ✅ Company name links to detail page (underline on hover)
- ✅ Sorting on all numeric columns

### Company Detail Page

**Hero Stats:**
- Company name: `title-1`
- Two large numbers side by side:
  - Left: Total Layoffs (rose dot + number)
  - Right: Total AI Investment (cyan dot + number)
- Below: "Last updated: [date]"

**Event Timeline:**
- Vertical timeline with dots
- Rose dot for layoffs, cyan dot for investments
- Date on left, event description on right
- Source link: `body-sm`, text-tertiary, underline on hover

---

## Component Specifications

### Button

```
padding: 8px 16px
border: 1px solid #262626
background: transparent
color: #fafafa
font: body-sm, weight 500
border-radius: 0  (sharp corners)
hover: border-color #525252, background #0a0a0a
active: background #1a1a1a
```

### Filter/Select

```
padding: 8px 12px
border: 1px solid #171717
background: #0a0a0a
color: #a3a3a3
font: body-sm
border-radius: 0
hover: border-color #262626
focus: border-color #525252, outline none
```

### Link

```
color: #a3a3a3
text-decoration: none
hover: color #fafafa, underline
```

---

## Interaction Design

### Hover States

- Table rows: background transitions to #0a0a0a, 150ms ease
- Links: color transitions to #fafafa, 150ms ease
- Buttons: border-color transitions, 150ms ease
- Stats cards: border-color transitions to #262626

### Loading States

- Skeleton: #0a0a0a background with animated #111111 pulse
- No spinners. Ever.

### Scroll Behavior

- Smooth scroll for anchor links
- Header stays fixed with backdrop-blur on scroll (optional)

---

## Chart Redesign (Recharts → Custom Minimal)

The current Recharts setup looks cheap. Replace with a carefully configured Recharts instance:

```
<LineChart>
  <CartesianGrid strokeDasharray="none" stroke="#171717" vertical={false} />
  <XAxis 
    dataKey="year" 
    axisLine={false} 
    tickLine={false}
    tick={{ fill: '#525252', fontSize: 12, fontFamily: 'JetBrains Mono' }}
  />
  <YAxis 
    axisLine={false} 
    tickLine={false}
    tick={{ fill: '#525252', fontSize: 12, fontFamily: 'JetBrains Mono' }}
  />
  <Tooltip 
    contentStyle={{ 
      background: '#0a0a0a', 
      border: '1px solid #262626',
      borderRadius: 0,
      color: '#fafafa',
      fontFamily: 'JetBrains Mono',
      fontSize: 12
    }}
  />
  <Line 
    type="monotone" 
    dataKey="layoffs" 
    stroke="#e11d48" 
    strokeWidth={2}
    dot={false}
    activeDot={{ r: 4, fill: '#e11d48' }}
  />
  <Line 
    type="monotone" 
    dataKey="investment" 
    stroke="#06b6d4" 
    strokeWidth={2}
    dot={false}
    activeDot={{ r: 4, fill: '#06b6d4' }}
  />
</LineChart>
```

Key changes:
- No vertical grid lines
- Minimal horizontal grid (#171717)
- No axis lines
- Monospace ticks
- Custom tooltip (sharp corners, dark)
- No dots on lines (only on hover)
- 2px stroke width

---

## OG Image Redesign

Current OG is a generic card. New OG should feel like a financial data terminal:

- Background: #000000
- Two massive numbers:
  - Left: Total Layoffs in rose (#e11d48)
  - Right: Total AI Spend in cyan (#06b6d4)
- Below: "AI-Layoffs Tracker" in white
- Monospace fonts for numbers
- No gradients, no emojis
- Clean, terminal aesthetic

---

## Animation & Motion

### Page Load

- Staggered fade-in for table rows (50ms delay each)
- Stats numbers count up from 0 to value (800ms, easeOutExpo)

### Scroll

- Section headers fade in when entering viewport
- Chart draws itself on first view (line animation)

### Micro-interactions

- Table row hover: 150ms background transition
- Number changes: subtle color flash (rose or cyan) for 300ms

---

## Responsive Breakpoints

| Name | Width | Changes |
|------|-------|---------|
| Mobile | < 640px | Single column, stacked stats, horizontal scroll table |
| Tablet | 640-1024px | 2-column stats, full table |
| Desktop | > 1024px | Full layout as designed |

### Mobile Table

On mobile, the table becomes cards:

```
┌────────────────────────┐
│ Meta                   │
│ Big Tech               │
│ ● 27,000    ● $65B    │
│ Last: May 2025         │
└────────────────────────┘
```

- Full width cards
- 1px border
- No rounded corners
- Two numbers side by side with colored dots

---

## Migration Plan (Files to Change)

1. **Install fonts:** `npm install @fontsource/inter @fontsource/jetbrains-mono`
2. **globals.css:** Replace all Tailwind defaults with custom design tokens
3. **layout.tsx:** Remove emojis, update header/footer design
4. **page.tsx:** Complete redesign — hero, stats, chart, table
5. **CompanyTable.tsx:** Rewrite table component
6. **ComparisonChart.tsx:** Rewrite chart with minimal Recharts config
7. **CompanyCard.tsx:** Rewrite mobile card
8. **Remove:** FilterBar.tsx, EventTimeline.tsx (inline instead)
9. **company/[slug]/page.tsx:** Redesign detail page
10. **opengraph-image.tsx:** Redesign OG images

---

## Checklist

- [ ] Pure black background (#000000)
- [ ] Zero emojis in the entire UI
- [ ] Inter + JetBrains Mono font stack
- [ ] Custom color palette (no Tailwind defaults)
- [ ] Sharp corners everywhere (border-radius: 0)
- [ ] 1px borders only (#171717)
- [ ] Monospace for all numbers
- [ ] Remove "Layoffs / $1B AI" column
- [ ] Minimal chart (no grid lines, no dots)
- [ ] Bloomberg-style data table
- [ ] Proper hover states (subtle, not flashy)
- [ ] OG images redesigned to match
