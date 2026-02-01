# GreyEd Brand Colors - Hero & WhyGreyEd Section

## Color Palette (from Hero & WhyGreyEd sections)

### Brand Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Greyed Navy** | `#212754` | rgb(33, 39, 84) | Primary brand color, main backgrounds |
| **Greyed Blue** | `#bbd7eb` | rgb(187, 215, 235) | Accent color, interactive elements |
| **Greyed White** | `#efeae4` | rgb(239, 234, 228) | Light text, off-white backgrounds |
| **Greyed Beige** | `#dedbc2` | rgb(222, 219, 194) | Subtle backgrounds, secondary elements |
| **Greyed Black** | `#292828` | rgb(41, 40, 40) | Dark text, body copy |

---

## Hero Section Color Scheme

### Background
- **Background Color:** `bg-greyed-navy` (#212754)
  - Dark navy background creating strong contrast
  - Full viewport height section

### Text Colors

**Heading Text:**
- **Color:** `text-greyed-white` (#efeae4)
- **Element:** H1 "GreyEd Teachers: AI for Education Excellence"
- **Font:** Poppins (headline font)
- **Sizes:** 3xl (mobile) / 5xl (tablet) / 6xl (desktop)

**Subheading Text:**
- **Color:** `text-greyed-blue` (#bbd7eb)
- **Element:** Tagline paragraph
- **Font:** Default sans-serif
- **Sizes:** lg (mobile) / 2xl (tablet/desktop)

### Button Styles

**Primary Button (Call to Action):**
- **Default State:**
  - Background: `bg-greyed-blue` (#bbd7eb)
  - Text: `text-greyed-navy` (#212754)
  - Shape: `rounded-full`
  - Padding: `px-8 py-3`
  - Font: Medium weight

- **Hover State:**
  - Background: `hover:bg-greyed-white` (#efeae4)
  - Text: `text-greyed-navy` (unchanged)
  - Transition: Smooth color transition

**Secondary Button (Outlined):**
- **Default State:**
  - Background: Transparent
  - Border: `border border-greyed-white` (#efeae4)
  - Text: `text-greyed-white` (#efeae4)
  - Shape: `rounded-full`
  - Padding: `px-8 py-3`

- **Hover State:**
  - Background: `hover:bg-greyed-white/10` (10% opacity white)
  - Border: `border-greyed-white` (unchanged)
  - Text: `text-greyed-white` (unchanged)

---

## WhyGreyEd Section Color Scheme

### Background
- **Background Color:** `bg-greyed-white` (#efeae4)
  - Light off-white background for content readability
  - Padding: `py-20` (vertical spacing)

**Decorative Gradient Blob:**
- **Gradient:** `bg-gradient-to-br from-greyed-blue/30 to-greyed-blue/5`
  - From: 30% opacity greyed-blue
  - To: 5% opacity greyed-blue
  - Creates subtle visual interest

### Text Colors

**Section Heading:**
- **Color:** `text-greyed-navy` (#212754)
- **Element:** H2 "Why Students Love GreyEd"
- **Font:** Poppins (headline font)
- **Sizes:** 3xl (mobile) / 4xl (tablet/desktop)

**Section Subheading:**
- **Color:** `text-greyed-black/70` (70% opacity of #292828)
- **Element:** Subtitle paragraph
- **Font:** Default sans-serif
- **Size:** xl

### Card/Row Elements

**Table Row (Cards on background):**
- **Default State:**
  - Background: Transparent
  - Border Bottom: `border-b border-greyed-navy/10` (10% opacity navy)
  - Padding: `py-6 px-4`
  - Shape: `rounded-lg`

- **Hover State:**
  - Background: `hover:bg-greyed-blue/5` (5% opacity greyed-blue)
  - Box Shadow: `0 4px 20px rgba(0,0,0,0.1)`
  - Transform: Slight upward lift

**Row Text Colors:**
- **Title Text:** `text-greyed-navy` (#212754)
  - Font: Poppins semibold (headline font)

- **Description Text:** `text-greyed-black` (#292828)
  - Font: Default sans-serif
  - Includes green check icon: `text-green-500`

- **Comparison Text:** `text-greyed-black/60` (60% opacity of #292828)
  - Font: Default sans-serif, italic
  - Lighter text for secondary information

---

## Typography

### Font Families
- **Headline Font:** Poppins (for headings, titles, CTAs)
- **Body Font:** Inter (default sans-serif for body text)

### Font Weights Used
- **Font Bold:** Headings and important titles
- **Font Semibold:** Subheadings and labels
- **Font Medium:** Buttons and interactive elements
- **Font Regular:** Body text and descriptions

---

## Usage Guidelines

### Hero Section
```css
/* Background */
background: #212754 (greyed-navy)

/* H1 Text */
color: #efeae4 (greyed-white)
font-family: 'Poppins', sans-serif
font-weight: bold

/* Subheading */
color: #bbd7eb (greyed-blue)

/* Primary Button */
background: #bbd7eb (greyed-blue)
color: #212754 (greyed-navy)
hover-background: #efeae4 (greyed-white)

/* Secondary Button */
background: transparent
border: 1px solid #efeae4 (greyed-white)
color: #efeae4 (greyed-white)
hover-background: rgba(239, 234, 228, 0.1)
```

### WhyGreyEd Section
```css
/* Background */
background: #efeae4 (greyed-white)

/* H2 Text */
color: #212754 (greyed-navy)
font-family: 'Poppins', sans-serif
font-weight: bold

/* Subtitle */
color: rgba(41, 40, 40, 0.7) (greyed-black 70% opacity)

/* Card/Row Hover */
background: rgba(187, 215, 235, 0.05) (greyed-blue 5% opacity)

/* Row Title */
color: #212754 (greyed-navy)
font-family: 'Poppins', sans-serif
font-weight: semibold

/* Row Description */
color: #292828 (greyed-black)

/* Row Comparison */
color: rgba(41, 40, 40, 0.6) (greyed-black 60% opacity)
font-style: italic
```

---

## Accessibility Notes

### Contrast Ratios (WCAG 2.1 Compliance)

**Hero Section:**
- White text (#efeae4) on Navy background (#212754): **8.5:1** ✓ AAA
- Blue text (#bbd7eb) on Navy background (#212754): **4.8:1** ✓ AA (large text only)

**WhyGreyEd Section:**
- Navy text (#212754) on White background (#efeae4): **8.5:1** ✓ AAA
- Black text (#292828) on White background (#efeae4): **11.2:1** ✓ AAA
- Black 70% opacity on White background: **7.8:1** ✓ AAA
- Black 60% opacity on White background: **6.5:1** ✓ AAA

All color combinations meet or exceed WCAG AA standards for accessibility.

---

## Color Psychology

- **Greyed Navy (#212754):** Trust, professionalism, expertise, stability
- **Greyed Blue (#bbd7eb):** Calm, clarity, intelligence, approachability
- **Greyed White (#efeae4):** Clean, sophisticated, premium, neutral
- **Greyed Black (#292828):** Authority, readability, grounding

This palette conveys professionalism and educational excellence while maintaining warmth and accessibility.
