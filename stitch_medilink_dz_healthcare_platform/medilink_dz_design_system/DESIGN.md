---
name: MediLink DZ Design System
colors:
  surface: '#f6fbf3'
  surface-dim: '#d7dbd4'
  surface-bright: '#f6fbf3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f5ee'
  surface-container: '#ebefe8'
  surface-container-high: '#e5e9e2'
  surface-container-highest: '#dfe4dd'
  on-surface: '#181d19'
  on-surface-variant: '#3f4941'
  inverse-surface: '#2d322d'
  inverse-on-surface: '#edf2eb'
  outline: '#6f7a70'
  outline-variant: '#becabe'
  surface-tint: '#006d3d'
  primary: '#006a3b'
  on-primary: '#ffffff'
  primary-container: '#268451'
  on-primary-container: '#f6fff4'
  inverse-primary: '#7ed99e'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#0051d5'
  on-tertiary: '#ffffff'
  tertiary-container: '#316bf3'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9af6b8'
  primary-fixed-dim: '#7ed99e'
  on-primary-fixed: '#00210f'
  on-primary-fixed-variant: '#00522d'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#f6fbf3'
  on-background: '#181d19'
  surface-variant: '#dfe4dd'
typography:
  h1:
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1-mobile:
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.5'
  label-md:
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  caption:
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
---

## Brand & Style
The design system is centered on trust, efficiency, and accessibility for the Algerian healthcare landscape. It blends **Minimalism** with subtle **Glassmorphism** to create a high-end, digital-first medical experience. The aesthetic is inspired by leading global health platforms, prioritizing clarity and a "calm" interface that reduces patient anxiety while maintaining professional rigor for practitioners. 

Key attributes include:
- **Clinical Precision:** Sharp execution of layouts with generous white space.
- **Approachability:** Softened by large radius curves and friendly typography.
- **Transparency:** Use of frosted overlays to signify depth and modern technical sophistication.

## Colors
The palette is rooted in "Sea Green," a color associated with health, growth, and stability. 
- **Primary (#2E8B57):** Used for main actions, active states, and brand-defining elements.
- **Secondary & Accent:** Sky Blue and Royal Blue are used to differentiate clinical services from navigational actions, providing a cool, sterile but welcoming contrast.
- **Neutrals:** A very light blue-tinted grey (`#F8FAFC`) is used for backgrounds to prevent screen glare, maintaining a "clean room" feel.
- **Accessibility:** All primary text-on-surface combinations must meet WCAG AA standards for legibility.

## Typography
This design system utilizes **Be Vietnam Pro** (as the closest high-quality available alternative to Poppins with similar geometric humanist qualities) to ensure a modern, friendly, and highly legible experience across all devices. 

- **Headings:** Bold weights are used for clear hierarchy, helping users scan medical data quickly.
- **Body:** A Medium weight (500) is preferred over Regular to improve readability on high-resolution mobile displays and against light-tinted backgrounds.
- **Scale:** Larger headings scale down for mobile to maintain a single-column focus without excessive wrapping.

## Layout & Spacing
The layout follows a **Fluid Grid** philosophy with a 12-column structure on desktop and a 4-column structure on mobile. 

- **Rhythm:** An 8px base unit drives all padding and margin decisions. 
- **Whitespace:** Emphasize "large whitespace" by using 48px to 64px vertical spacing between major sections (e.g., Search bar to Doctor list).
- **Mobile:** Margins are reduced to 16px to maximize the screen real estate for list items and medical records.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Ambient Shadows**, avoiding harsh lines.

- **Low Elevation:** Used for cards and secondary containers. 1px stroke (#E2E8F0) + a soft shadow (0px 4px 20px rgba(15, 23, 42, 0.05)).
- **High Elevation (Modals/Overlays):** Utilizes **Glassmorphism**. A background blur of 12px combined with a 70% opacity white surface.
- **Transitions:** All elevation changes (e.g., hovering over a doctor's profile) use a 200ms ease-in-out transition.

## Shapes
The shape language is defined by the **2xl** roundedness standard (Pill-shaped/High Radius).
- **Base Components:** Buttons and inputs use a 1rem (16px) radius.
- **Large Containers:** Cards and Modals use the `rounded-2xl` (24px) or `rounded-3xl` (32px) standard to evoke a soft, friendly, and non-intimidating feel.
- **Avatars:** Strictly circular for medical professionals.

## Components
- **Buttons:** Primary buttons feature a subtle gradient or solid Sea Green with a 16px radius. Text is always centered and Medium weight.
- **Input Fields:** Large, 56px height inputs with a light grey background (#F1F5F9). On focus, the border transitions to Primary Green with a soft outer glow.
- **Cards:** White surfaces with a 24px radius. Content is padded by 24px internally. Doctor cards should feature a clear "Primary" action button (e.g., Book Appointment).
- **Chips/Badges:** High-contrast background with Primary or Status colors, but with low-opacity (15%) background tints to keep the text readable and the UI light.
- **Glass Overlays:** Used for mobile navigation bars and top headers to maintain context of the content scrolling beneath them.
- **Lists:** Clean separation using 1px dividers or subtle vertical spacing without borders to keep the "Minimal" aesthetic.