# CSS & Design Tools Implementation Plan (Phase 5-7)

This document outlines the implementation strategy for 20 CSS and Design utility tools. Each tool must follow the project's standards for UI, localization (i18n), and responsiveness.

## Core Requirements for All Tools
1. **Multilingual Support**: All text strings must be in `en.json` and `ur.json`. Use `t()` for translation.
2. **Visual Consistency**: Use the 12-column grid layout. Result area should be on the right (lg:col-span-3 for settings, lg:col-span-9 for main area).
3. **Responsive Design**: Mobile-first approach with full functionality on all screen sizes.
4. **Interactive Elements**: Real-time previews, copy-to-clipboard buttons, and visual feedback.
5. **Documentation**: Each tool must include an "About" section and FAQs in the localization files.
6. **Navigation**: Use the `ToolNavigation` component with the correct tool ID.

---

## Phase 5: Visual CSS Generators (Tools 61-67)
Focus: Visual editors for common CSS properties with live previews.

- [ ] **Build 61: CSS Gradient Generator**
  - Features: Visual drag handles, multi-stop support, linear/radial toggle, copy CSS.
- [ ] **Build 62: Box Shadow Generator**
  - Features: Multi-layer support, blur/spread/offset sliders, inset toggle, live preview.
- [ ] **Build 63: Border Radius Generator**
  - Features: Individual corner editing, visual handles, px/% toggle.
- [ ] **Build 64: CSS Flexbox Playground**
  - Features: Interactive property toggles (flex-direction, justify-content, align-items), dynamic item count.
- [ ] **Build 65: CSS Grid Generator**
  - Features: Visual column/row builder, area names, gap control, explicit/implicit grid toggle.
- [ ] **Build 66: Glassmorphism Generator**
  - Features: Background blur, opacity, border width sliders, mesh gradient background for preview.
- [ ] **Build 67: Neumorphism Generator**
  - Features: Light direction control, concave/convex/flat toggles, border radius, distance/intensity sliders.
- [ ] **Batch Tasks**: Add translation keys + FAQs for tools 61-67.

## Phase 6: Color & Typography Suite (Tools 68-74)
Focus: Design systems, color accessibility, and unit management.

- [ ] **Build 68: CSS Animation Builder**
  - Features: Keyframe editor, common presets (fade, slide, bounce), timing function picker (cubic-bezier), duration slider.
- [ ] **Build 69: Color Palette Generator**
  - Features: Complementary, triadic, monochromatic schemes, export as CSS/SCSS/Tailwind.
- [ ] **Build 70: Color Contrast Checker**
  - Features: WCAG AA/AAA pass/fail indicator, contrast ratio calculation, real-time font preview.
- [ ] **Build 71: Color Format Converter**
  - Features: Convert between HEX, RGB, HSL, HSV, CMYK. Color picker integration.
- [ ] **Build 72: Tailwind Class Lookup**
  - Features: Searchable cheatsheet for Tailwind CSS classes, one-click copy.
- [ ] **Build 73: CSS Specificity Calculator**
  - Features: Paste CSS selectors, get (id, class, tag) score breakdown with comparison logic.
- [ ] **Build 74: CSS Unit Converter**
  - Features: Instant conversion between px, rem, em, vh, vw, %. Configurable base font size.
- [ ] **Batch Tasks**: Add translation keys + FAQs for tools 68-74.

## Phase 7: Advanced Layout & Logic (Tools 75-80)
Focus: Complex CSS features and modern layout techniques.

- [ ] **Build 75: Typography Scale Generator**
  - Features: Base size selection, scale ratio (Golden Ratio, Perfect Fourth, etc.), fluid typography (`clamp()`) output.
- [ ] **Build 76: CSS Variables Generator**
  - Features: Paste raw CSS to extract all `var()` tokens, rename/organize into a clean `:root` block.
- [ ] **Build 77: Clip-Path Generator**
  - Features: Polygon/Circle/Ellipse drag editor, custom point addition, SVG + CSS output.
- [ ] **Build 78: Scroll Snap Generator**
  - Features: Axis control, align/stop configuration, interactive preview container.
- [ ] **Build 79: Media Query Builder**
  - Features: Preset device sizes, min/max-width toggle, orientation, logical operators.
- [ ] **Build 80: Z-Index Visualizer**
  - Features: 3D-style stack diagram, conflict detection, relative vs absolute context visualization.
- [ ] **Batch Tasks**: Add translation keys + FAQs for tools 75-80.

---

## Technical Considerations
- **UI Components**: Use `@/components/ui/` (Radix UI + Tailwind) for sliders, tabs, and switches.
- **State Management**: Use React hooks for real-time reactivity.
- **Icon Set**: Use `lucide-react` for consistent visual language.
- **Performance**: Ensure heavy visual editors (like Clip-Path or Animation) are optimized for smooth interaction.
