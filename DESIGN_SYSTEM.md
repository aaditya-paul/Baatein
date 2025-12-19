# Baatein Design System

> A comprehensive guide to the UI style, theme, and design philosophy of Baatein.

## 🎯 Design Philosophy

Baatein follows a **"Neutral to Emotion"** design philosophy. The interface starts with deep, neutral tones that create a calm, contemplative space—then allows moments of warmth and emotional resonance through subtle accents and animations.

### Core Principles

1. **Minimalism** - Every element serves a purpose
2. **Calm** - No visual noise or distractions
3. **Warmth** - Inviting despite the dark theme
4. **Clarity** - Typography and spacing prioritize readability
5. **Subtlety** - Animations and transitions are gentle, never jarring

---

## 🎨 Color Palette

The color system is built on a true zinc/neutral gray scale, creating a sophisticated monochromatic foundation.

### Primary Colors

| Token | Value | Color | Usage |
|-------|-------|-------|-------|
| `background` | `#09090b` | ![#09090b](https://via.placeholder.com/20/09090b/09090b.png) Zinc 950 | Main background - Deep neutral black |
| `foreground` | `#f4f4f5` | ![#f4f4f5](https://via.placeholder.com/20/f4f4f5/f4f4f5.png) Zinc 100 | Primary text - Clean white-grey |
| `primary` | `#f4f4f5` | ![#f4f4f5](https://via.placeholder.com/20/f4f4f5/f4f4f5.png) Zinc 100 | Accent color - Monochrome emphasis |
| `primary-foreground` | `#09090b` | ![#09090b](https://via.placeholder.com/20/09090b/09090b.png) Zinc 950 | Text on primary elements |

### Surface Colors

| Token | Value | Color | Usage |
|-------|-------|-------|-------|
| `card` | `#18181b` | ![#18181b](https://via.placeholder.com/20/18181b/18181b.png) Zinc 900 | Cards and elevated surfaces |
| `card-foreground` | `#f4f4f5` | ![#f4f4f5](https://via.placeholder.com/20/f4f4f5/f4f4f5.png) Zinc 100 | Text on cards |
| `popover` | `#09090b` | ![#09090b](https://via.placeholder.com/20/09090b/09090b.png) Zinc 950 | Popovers and dialogs |
| `popover-foreground` | `#f4f4f5` | ![#f4f4f5](https://via.placeholder.com/20/f4f4f5/f4f4f5.png) Zinc 100 | Text in popovers |

### Secondary & Muted Colors

| Token | Value | Color | Usage |
|-------|-------|-------|-------|
| `secondary` | `#27272a` | ![#27272a](https://via.placeholder.com/20/27272a/27272a.png) Zinc 800 | Secondary buttons/elements |
| `secondary-foreground` | `#f4f4f5` | ![#f4f4f5](https://via.placeholder.com/20/f4f4f5/f4f4f5.png) Zinc 100 | Text on secondary |
| `muted` | `#27272a` | ![#27272a](https://via.placeholder.com/20/27272a/27272a.png) Zinc 800 | Muted backgrounds |
| `muted-foreground` | `#a1a1aa` | ![#a1a1aa](https://via.placeholder.com/20/a1a1aa/a1a1aa.png) Zinc 400 | Secondary text, descriptions |
| `accent` | `#27272a` | ![#27272a](https://via.placeholder.com/20/27272a/27272a.png) Zinc 800 | Hover states, subtle emphasis |
| `accent-foreground` | `#f4f4f5` | ![#f4f4f5](https://via.placeholder.com/20/f4f4f5/f4f4f5.png) Zinc 100 | Text on accents |

### Border & Input

| Token | Value | Color | Usage |
|-------|-------|-------|-------|
| `border` | `#27272a` | ![#27272a](https://via.placeholder.com/20/27272a/27272a.png) Zinc 800 | Borders - Subtle separation |
| `input` | `#27272a` | ![#27272a](https://via.placeholder.com/20/27272a/27272a.png) Zinc 800 | Input field backgrounds |
| `ring` | `#a1a1aa` | ![#a1a1aa](https://via.placeholder.com/20/a1a1aa/a1a1aa.png) Zinc 400 | Focus rings |

### Semantic Colors

| Token | Value | Color | Usage |
|-------|-------|-------|-------|
| `destructive` | `#7f1d1d` | ![#7f1d1d](https://via.placeholder.com/20/7f1d1d/7f1d1d.png) | Destructive actions |
| `destructive-foreground` | `#fef2f2` | ![#fef2f2](https://via.placeholder.com/20/fef2f2/fef2f2.png) | Text on destructive |

---

## 📝 Typography

Baatein uses a dual-font system that balances warmth and professionalism.

### Font Families

**Nunito** (Body Text)
- Usage: All body text, paragraphs, UI labels
- Style: Rounded, warm, highly readable
- Loaded from: Google Fonts
- CSS Variable: `--font-nunito`

**Outfit** (Headings)
- Usage: All headings (h1-h6), titles
- Style: Modern, geometric, slightly more formal
- Weight: 600 (Semi-bold)
- Loaded from: Google Fonts
- CSS Variable: `--font-outfit`

### Type Scale

```css
/* Headings */
h1 { font-size: 2.5rem; }      /* 40px */
h2 { font-size: 2rem; }        /* 32px */
h3 { font-size: 1.875rem; }    /* 30px */
h4 { font-size: 1.5rem; }      /* 24px */
h5 { font-size: 1.25rem; }     /* 20px */
h6 { font-size: 1rem; }        /* 16px */

/* Body */
body { font-size: 1rem; }      /* 16px */
```

### Typography Features

- **Font Smoothing**: Antialiased for crisp rendering
- **Line Height**: Generous spacing for readability
- **Letter Spacing**: Tight tracking on headings (`tracking-tight`)
- **Font Weight**: Headings use 600 weight for emphasis without being heavy

---

## 🧩 Component System

### Button Component

Located at: `components/ui/button.tsx`

#### Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| `default` | Primary white button on dark background | Primary actions ("Start writing") |
| `secondary` | Zinc-800 background | Secondary actions |
| `destructive` | Red button | Delete, cancel operations |
| `outline` | Transparent with border | Alternative actions |
| `ghost` | No background, hover only | Tertiary actions, navigation |
| `link` | Underlined text link | Inline navigation |

#### Sizes

| Size | Height | Padding | Border Radius |
|------|--------|---------|---------------|
| `sm` | 40px | 16px | 12px (rounded-xl) |
| `default` | 48px | 32px | 16px (rounded-2xl) |
| `lg` | 56px | 40px | 24px (rounded-3xl) |
| `icon` | 36px | - | 16px (rounded-2xl) |

#### Design Details

- **Border Radius**: Significantly rounded (16-24px) for a modern, friendly feel
- **Shadows**: Subtle shadows on primary buttons
- **Hover States**: 90% opacity on hover
- **Transitions**: Smooth 200ms color transitions
- **Focus**: Visible ring for accessibility

### Input Component

Located at: `components/ui/input.tsx`

#### Characteristics

- **Height**: 48px (h-12)
- **Border Radius**: 12px (rounded-xl)
- **Border**: 1px solid `border` color
- **Background**: Transparent
- **Padding**: 12px horizontal
- **Placeholder**: `muted-foreground` color
- **Focus State**: 1px ring in `ring` color
- **Shadow**: Subtle shadow-sm

---

## 📐 Spacing & Layout

### Base Unit

The design uses Tailwind's default 4px spacing system with larger gaps for breathing room.

### Common Spacing Patterns

```css
/* Section Gaps */
.space-y-8     /* 32px vertical gap - Major sections */
.space-y-4     /* 16px vertical gap - Related items */
.space-y-2     /* 8px vertical gap - Tight grouping */

/* Padding */
.p-6           /* 24px - Card padding */
.px-8 py-2     /* 32px horizontal, 8px vertical - Button */

/* Margins */
.max-w-md      /* 448px - Content max width */
```

### Border Radius Scale

```css
--radius: 1rem;                    /* 16px - Base */
--radius-md: calc(var(--radius) - 2px);  /* 14px */
--radius-sm: calc(var(--radius) - 4px);  /* 12px */
--radius-lg: var(--radius);        /* 16px */

/* Component-specific */
rounded-xl     /* 12px - Inputs */
rounded-2xl    /* 16px - Default buttons */
rounded-3xl    /* 24px - Large buttons, cards */
rounded-full   /* Pills, FABs */
```

---

## ✨ Animation & Motion

### Framer Motion Usage

Baatein uses Framer Motion for subtle, purposeful animations.

#### Welcome Screen Animation

```typescript
// Entry fade-in
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, ease: "easeOut" }}

// Delayed button appearance
transition={{ delay: 0.5, duration: 0.8 }}
```

#### Principles

1. **Ease**: Use `easeOut` for natural deceleration
2. **Duration**: 300-800ms range (never too fast)
3. **Distance**: Small Y-axis movements (10-20px)
4. **Stagger**: Delayed animations create hierarchy
5. **Purpose**: Animations guide attention, never distract

### CSS Transitions

```css
/* All interactive elements */
transition-colors    /* Color changes */
transition-all       /* Complex multi-property transitions */
duration-300         /* 300ms - Standard */
```

### Ambient Effects

The welcome screen features a subtle **background glow**:

```css
/* Soft radial gradient blur */
width: 500px
height: 500px
background: primary/5 (5% opacity)
blur: 100px
position: absolute center
```

This creates a warm, ethereal atmosphere without being distracting.

---

## 🖼️ Layout Patterns

### Welcome Screen

- **Centering**: Full viewport height centering
- **Z-Index**: Content above ambient effects
- **Spacing**: Generous vertical rhythm (space-y-8)
- **Max Width**: 448px (max-w-md) for content
- **Text Alignment**: Center-aligned for focus

### Journal Pages

- **Container**: Max-width with horizontal padding
- **Header**: Fixed top section with title/subtitle
- **Content**: Scrollable main area
- **FAB**: Fixed bottom-right floating action button
  - Position: `bottom-8 right-8` (mobile)
  - Position: Translated for larger screens to maintain visual balance

### Card Style

```css
/* Empty state card example */
border: 1px dashed border
background: card/50 (50% opacity)
border-radius: 24px (rounded-3xl)
padding: 80px vertical
```

---

## 🎭 UI Personality

### Tone

- **Quiet**: No loud colors or aggressive CTAs
- **Inviting**: Warm neutral tones, rounded corners
- **Confident**: Clear hierarchy, purposeful whitespace
- **Personal**: Feels like a private, safe space

### Voice (in UI Copy)

- **Conversational**: "Your Space", "Nothing here yet. That's okay."
- **Reassuring**: Gentle encouragement without pressure
- **Minimal**: Few words, maximum meaning
- **Lowercase-friendly**: Less formal, more personal

---

## 📱 Responsive Design

### Breakpoints (Tailwind Defaults)

```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

### Responsive Typography

```css
/* Welcome screen heading */
text-4xl      /* Default: 36px */
md:text-5xl   /* Medium+: 48px */

/* Subheading */
text-xl       /* Default: 20px */
md:text-2xl   /* Medium+: 24px */
```

### Responsive Layout

- **Mobile-first**: Base styles for mobile
- **Progressive Enhancement**: Add complexity at larger sizes
- **Touch Targets**: Minimum 44px tap areas
- **FAB Position**: Adapts position based on screen size

---

## ♿ Accessibility

### Focus Management

- **Visible Focus Rings**: All interactive elements show focus
- **Keyboard Navigation**: Full keyboard support
- **Focus Styles**: 1px ring in accessible contrast color

### Color Contrast

All text meets **WCAG AA** standards:
- Foreground on background: 14.5:1 ratio
- Muted foreground on background: 4.8:1 ratio

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- Button elements (not div)
- Descriptive alt text (when images present)

---

## 🔧 Implementation Notes

### CSS Architecture

```
globals.css
├── @theme          /* Tailwind theme tokens */
├── :root           /* CSS custom properties */
└── body/headings   /* Global typography */
```

### Tailwind v4 Features

- **New @theme syntax**: Direct CSS variable mapping
- **Color tokens**: Automatic CSS variable generation
- **No tailwind.config.js**: Configuration in CSS

### Component Patterns

- **CVA (Class Variance Authority)**: Type-safe variant system
- **cn() utility**: Merges Tailwind classes cleanly
- **forwardRef**: All components support refs
- **Composition**: Small, reusable building blocks

---

## 📚 Design Inspirations

- **Apple's Design**: Minimalism and restraint
- **Linear App**: Dark theme sophistication
- **Notion**: Clean information hierarchy
- **Day One**: Personal, journal-focused UX

---

## 🎨 Design Tokens Reference

```css
/* Complete token list */
--color-background: #09090b
--color-foreground: #f4f4f5
--color-card: #18181b
--color-primary: #f4f4f5
--color-secondary: #27272a
--color-muted: #27272a
--color-muted-foreground: #a1a1aa
--color-border: #27272a
--radius: 1rem
--font-sans: Nunito
--font-heading: Outfit
```

---

## 🚀 Future Considerations

### Potential Additions

- **Light Mode**: Alternative theme toggle
- **Accent Colors**: Optional warm tones for personalization
- **Illustrations**: Subtle, minimalist spot illustrations
- **Micro-interactions**: Hover effects on cards
- **Loading States**: Skeleton screens for content loading

### Maintaining Consistency

1. Always use design tokens (CSS variables)
2. Respect the spacing scale
3. Maintain the rounded aesthetic (12px minimum)
4. Keep animations subtle and purposeful
5. Test all changes in dark mode first

---

*This design system is a living document. As Baatein evolves, this guide will be updated to reflect new patterns and components.*

**Last Updated**: December 19, 2025
