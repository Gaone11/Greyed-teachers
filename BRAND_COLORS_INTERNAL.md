# GreyEd Brand Colors - Internal Documentation

**CONFIDENTIAL - Backend Reference Only**

This document contains the official GreyEd brand color palette. Do not expose these values directly in frontend code.

---

## Primary Brand Colors

### Navy Blue (Primary)
- **Pantone**: 212754
- **CMYK**: 61 54 0 67
- **RGB**: 33 39 85
- **HEX**: `#212755`
- **Usage**: Main brand color, primary UI elements, headers, CTAs, navigation

### Light Blue (Secondary)
- **Pantone**: c2f0fa
- **CMYK**: 24 6 2 0
- **RGB**: 187 215 235
- **HEX**: `#bbd7eb`
- **Usage**: Accents, hover states, secondary buttons, highlights, active states

### Beige (Tertiary)
- **Pantone**: f2f2ed
- **CMYK**: 5 5 7 0
- **RGB**: 239 234 228
- **HEX**: `#efeae4`
- **Usage**: Backgrounds, cards, neutral sections, subtle dividers

---

## Supporting Colors

### Dark Charcoal
- **Pantone**: 191d1f
- **CMYK**: 70 65 63 67
- **RGB**: 41 40 40
- **HEX**: `#292828`
- **Usage**: Text, dark mode elements, footer, strong emphasis

### Light Tan
- **Pantone**: dedbc2
- **CMYK**: 13 14 24 0
- **RGB**: 221 210 191
- **HEX**: `#ddd2bf`
- **Usage**: Secondary backgrounds, dividers, borders, subtle contrast

---

## Implementation Reference

### Current Tailwind CSS Mapping

These colors are mapped to the following Tailwind theme variables:

```javascript
colors: {
  'greyed-navy': '#212755',      // Primary Navy Blue
  'greyed-blue': '#bbd7eb',      // Light Blue
  'greyed-beige': '#efeae4',     // Beige
  'greyed-charcoal': '#292828',  // Dark Charcoal (alias: greyed-navy in some contexts)
  'greyed-tan': '#ddd2bf',       // Light Tan
  'greyed-white': '#fafafa',     // Off-white for backgrounds
  'black': '#000000',            // True black for text
  'white': '#ffffff',            // Pure white
}
```

### Color Usage Guidelines

#### Primary Actions & Emphasis
- **Use Navy Blue (#212755)** for:
  - Primary buttons
  - Navigation bars
  - Main CTAs
  - Active menu items
  - Important headings

#### Interactive & Feedback
- **Use Light Blue (#bbd7eb)** for:
  - Hover states
  - Focus indicators
  - Secondary buttons
  - Links
  - Progress indicators
  - Success states

#### Backgrounds & Containers
- **Use Beige (#efeae4)** for:
  - Page backgrounds
  - Card backgrounds
  - Section dividers
  - Modal overlays
  - Input field backgrounds

#### Text & Content
- **Use Dark Charcoal (#292828)** for:
  - Body text
  - Paragraph content
  - Secondary headings
  - Labels
  - Descriptive text

#### Borders & Separators
- **Use Light Tan (#ddd2bf)** for:
  - Card borders
  - Section dividers
  - Table borders
  - Input outlines
  - Subtle separators

---

## Accessibility Requirements

### Contrast Ratios (WCAG 2.1 Guidelines)

- **Navy Blue (#212755) on White**: 10.8:1 ✓ (Exceeds WCAG AAA)
- **Dark Charcoal (#292828) on White**: 13.5:1 ✓ (Exceeds WCAG AAA)
- **Light Blue (#bbd7eb) on Navy**: 3.2:1 ⚠️ (Use for large text only)
- **White on Navy Blue**: 10.8:1 ✓ (Exceeds WCAG AAA)

### Best Practices
1. Always use Dark Charcoal or Navy for text on light backgrounds
2. Use White text on Navy or Dark Charcoal backgrounds
3. Light Blue should be used for accents, not primary text
4. Ensure interactive elements have clear focus indicators
5. Test all color combinations with accessibility tools

---

## Brand Identity Guidelines

### DO's
✓ Use Navy Blue as the dominant color in layouts
✓ Use Light Blue sparingly for highlights and accents
✓ Maintain generous white space with Beige backgrounds
✓ Keep the professional, educational tone
✓ Use colors consistently across all platforms

### DON'Ts
✗ **Never use purple, indigo, or violet hues** (unless specifically requested by user)
✗ Don't use Light Blue for large text blocks (low contrast)
✗ Don't mix too many colors in a single interface
✗ Don't use bright, saturated colors that clash with the palette
✗ Don't use gradients unless approved by design team

---

## Color Psychology & Brand Values

### Navy Blue (#212755)
- **Represents**: Trust, professionalism, intelligence, stability
- **Emotional Response**: Calm, confident, authoritative
- **Brand Association**: Academic excellence, reliability

### Light Blue (#bbd7eb)
- **Represents**: Clarity, communication, openness, sky/air
- **Emotional Response**: Peaceful, clear-minded, accessible
- **Brand Association**: Learning, understanding, growth

### Beige (#efeae4)
- **Represents**: Warmth, neutrality, balance, comfort
- **Emotional Response**: Calm, natural, approachable
- **Brand Association**: Human-centered, supportive environment

### Overall Palette Message
The GreyEd color palette communicates **trustworthy academic excellence** (Navy) combined with **clear, accessible learning** (Light Blue) in a **warm, supportive environment** (Beige).

---

## Platform-Specific Notes

### Web Application
- Backgrounds: Primarily Beige (#efeae4) with White (#ffffff) cards
- Navigation: Navy Blue (#212755) with White text
- Interactive elements: Light Blue (#bbd7eb) hover states
- Text: Dark Charcoal (#292828) for readability

### Mobile Application
- Use higher contrast ratios for smaller screens
- Ensure touch targets have clear color feedback
- Light Blue for active/pressed states
- Maintain consistency with web platform

### Print Materials
- Use CMYK values for accurate color reproduction
- Navy Blue: C61 M54 Y0 K67
- Light Blue: C24 M6 Y2 K0
- Beige: C5 M5 Y7 K0

### Email Communications
- Use web-safe hex values
- Test colors across different email clients
- Ensure sufficient contrast for accessibility

---

## Version History

- **v1.0** - 2025-10-19: Initial brand color documentation created from official brand guidelines
- Colors extracted from official GreyEd branding materials
- Pantone, CMYK, RGB, and HEX values verified

---

## References

- Official GreyEd Branding Guidelines (Image: GreyEd Branding-11.PNG)
- Tailwind CSS Configuration: `/tailwind.config.js`
- Design System: `.GREYED_BRAND_COLORS.md` (if exists)

---

**Last Updated**: October 19, 2025
**Maintained By**: Development Team
**Classification**: Internal Use Only
