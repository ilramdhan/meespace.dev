# UI Design Guidelines

Best practices for maintaining consistent UI across the meespace.dev portfolio.

## Color Palette

### Primary Colors
| Name | Value | Usage |
|------|-------|-------|
| `primary` | `#d0e6dc` | Buttons, accents, highlights |
| `primary-dark` | `#b0c9be` | Hover states |
| `accent-purple` | `#e6e6fa` | Secondary accents |

### Text Colors
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `text-main` | `#121715` | `#ffffff` |
| `text-muted` | `#658174` | `#a3b5ae` |

### Background Colors
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `background-light` | `#F5F5F7` | - |
| `background-dark` | - | `#161c19` |
| Card bg | `white` | `#1e1e1e` |

---

## Components

### Buttons

**Always use `bg-primary text-text-main` for primary buttons** - this ensures visibility in both light and dark modes.

```tsx
// ✅ Correct - visible in all themes
<button className="bg-primary hover:bg-primary-dark text-text-main">
  Click Me
</button>

// ❌ Wrong - invisible in some themes
<button className="bg-sage-green text-white">
  Click Me
</button>
```

**Use shared Button component:**
```tsx
import { Button } from "@/components/shared/Button";

<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Ghost Button</Button>
```

### Cards

**Always use `rounded-xl`** for cards, not `rounded-card`.

```tsx
// ✅ Correct
<div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800">

// ❌ Wrong
<div className="... rounded-card">
```

**Use shared Card component:**
```tsx
import { Card } from "@/components/shared/Card";

<Card variant="default" padding="md">
  Card content
</Card>
```

### Badges

Use the Badge component for status indicators:

```tsx
import { Badge } from "@/components/shared/Badge";

<Badge variant="success" dot>Published</Badge>
<Badge variant="warning">Draft</Badge>
<Badge variant="neutral">Archived</Badge>
```

---

## Layout Rules

### Admin Panel
- Navbar: `sticky top-0 z-50`
- Content padding: `px-8`
- Max width: `max-w-[1400px] mx-auto`
- Card spacing: `gap-6`

### Page Headers
Title and actions must align with card content below:
```tsx
<div className="max-w-[1400px] mx-auto px-8">
  <PageHeader title="..." actions={...} />
</div>

<div className="max-w-[1400px] mx-auto px-8">
  <Card>...</Card>
</div>
```

---

## Dark Mode

Always provide dark variants for colors:

```tsx
// ✅ Correct
<div className="bg-white dark:bg-[#1e1e1e] text-text-main dark:text-white">

// ❌ Wrong - missing dark variant
<div className="bg-white text-black">
```

---

## Shared Components Location

All reusable components are in `src/components/shared/`:

| Component | Purpose |
|-----------|---------|
| `Button` | Primary/secondary/ghost buttons |
| `Card` | Consistent card with rounded-xl |
| `PageHeader` | Page title and description |
| `Badge` | Status badges with variants |
| `Icon` | Material Symbols wrapper |

---

## Spacing Patterns

### Use `flex gap` instead of `space-y`

When pages contain modals or fixed overlays, **always use `flex flex-col gap-6`** instead of `space-y-6`.

```tsx
// ✅ Correct - gap doesn't interfere with fixed modals
<div className="flex flex-col gap-6">
  <Header />
  <Content />
</div>

// ❌ Wrong - space-y creates margin that breaks modal backdrops
<div className="space-y-6">
  <Header />
  <Content />
</div>
```

**Why?** `space-y-*` uses `margin-block-end` which affects the positioning of `position: fixed` elements like modal backdrops, creating visible gaps.

### Content Wrapper Pattern

All admin pages must use consistent content wrapper:

```tsx
// Standard content wrapper
<div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
  {/* Content */}
</div>
```

Key classes:
- `max-w-[1400px]` - Maximum width
- `w-full` - Ensures full width for justify-between
- `mx-auto` - Center alignment
- `px-8` - Horizontal padding
- `pb-8` - Bottom padding

---

## Modal & Overlay Z-Index

Use this z-index hierarchy for proper stacking:

| Element | Z-Index | Purpose |
|---------|---------|---------|
| Sticky Navbar | `z-40` | Admin header |
| Modal Backdrop | `z-[60]` | Dark overlay behind modal |
| Modal Content | `z-[70]` | Modal dialog |

```tsx
// Modal backdrop - must be higher than navbar
<div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]" />

// Modal content - higher than backdrop
<div className="fixed inset-0 flex items-center justify-center z-[70]">
  <div className="bg-white rounded-xl ...">
    {/* Modal content */}
  </div>
</div>
```

---

## Common Pitfalls

### ❌ Don't use `bg-sage-green text-white`

This color combination has poor contrast in both light and dark modes.

```tsx
// ❌ Wrong - invisible button
<button className="bg-sage-green text-white">Save</button>

// ✅ Correct - visible in all modes
<button className="bg-primary hover:bg-primary-dark text-text-main">Save</button>
```

### ❌ Don't use `rounded-card`

Use `rounded-xl` for consistent card corners.

### ❌ Don't forget `w-full` for justify-between

`justify-between` requires the container to have full width:

```tsx
// ❌ Wrong - justify-between may not work
<div className="max-w-[1400px] mx-auto">
  <div className="flex justify-between">...</div>
</div>

// ✅ Correct - w-full ensures full width
<div className="max-w-[1400px] w-full mx-auto">
  <div className="flex justify-between w-full">...</div>
</div>
```

### ❌ Don't use margin-based spacing with fixed overlays

Modal backdrops with `position: fixed` are affected by parent margins. Use gap instead.

---

*Last updated: January 2026*
