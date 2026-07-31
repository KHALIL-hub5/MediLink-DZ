---
name: MediLink DZ
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4941'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
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
  tertiary: '#b90538'
  on-tertiary: '#ffffff'
  tertiary-container: '#dc2c4f'
  on-tertiary-container: '#fffbff'
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
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is engineered for the Algerian healthcare landscape, prioritizing clarity, efficiency, and cultural inclusivity. The brand personality is **Professional, Trustworthy, and Empathetic**. It balances a sterile, medical-grade precision with a warm, accessible interface to reduce patient anxiety.

The visual style is a hybrid of **Modern Minimalism** and **Glassmorphism**. It utilizes expansive whitespace and a structured grid to manage complex medical data, while employing translucent layers and soft background blurs in dashboard environments to create a sense of technological sophistication and depth.

## Colors
The palette is rooted in medical reliability and digital clarity. 
- **Primary (Medical Green):** Used for main actions, health indicators, and success states. It reflects growth and healing.
- **Secondary (Trust Blue):** Used for information architecture, links, and secondary interactive elements.
- **Tertiary (Emergency Red):** Reserved strictly for urgent alerts, critical errors, and emergency triggers.
- **Neutral:** A slate-based scale used for text hierarchies and borders to maintain a cool, clean temperament.
- **Surface:** Pure white for standard content cards, with semi-transparent variations (80% opacity with 16px blur) for dashboard overlays.

## Typography
This design system uses **Be Vietnam Pro** (as a high-quality alternative to Poppins) to ensure excellent legibility in both French/English and professional medical contexts. 

- **Weight Usage:** Bold (700) is reserved for display headers. SemiBold (600) is used for section titles to establish clear hierarchy. Regular (400) is used for all long-form body text to ensure high readability.
- **Multilingual Support:** The system is designed to handle both LTR and RTL scripts. For Arabic content, line-heights should be increased by 20% to prevent character clipping of ascenders and descenders.
- **Scaling:** Headlines scale down significantly on mobile devices to preserve screen real estate for critical health data.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a base-8 rhythm.
- **Desktop:** 12-column grid with 24px gutters. Dashboard layouts utilize a fixed 280px sidebar on the "start" side (Left for LTR, Right for RTL).
- **Mobile:** 4-column grid with 16px margins. 
- **Logical Properties:** All spacing uses logical properties (`padding-inline-start`, `margin-block`) to automatically adapt when switching between French/English (LTR) and Arabic (RTL). 
- **Alignment:** Text is always start-aligned. Icons in input fields and list items must mirror their position across the vertical axis when the language direction changes.

## Elevation & Depth
Depth is created through a combination of **Ambient Shadows** and **Glassmorphism**:
- **Level 0 (Base):** Background (#F8FAFC), flat.
- **Level 1 (Standard Cards):** White background with a very soft, diffused shadow: `0 4px 20px rgba(0, 0, 0, 0.05)`.
- **Level 2 (Active/Floating):** White background with a more pronounced shadow: `0 12px 32px rgba(0, 0, 0, 0.08)`.
- **Dashboard Overlays:** Used for glassmorphic sidebars or status panels. Background: `rgba(255, 255, 255, 0.7)`, Backdrop-filter: `blur(16px)`, Border: `1px solid rgba(255, 255, 255, 0.3)`.

## Shapes
The design system uses a **Rounded (Level 2)** shape language to project friendliness and safety.
- **Standard Radius (16px):** Used for cards, modals, and large containers.
- **Small Radius (8px):** Used for inputs and buttons.
- **Pill (Full):** Used for status badges, tags, and "Emergency" buttons to make them immediately distinguishable from standard UI elements.

## Components
- **Buttons:** 
  - *Primary:* Solid #2E8B57, white text, 8px radius.
  - *Secondary:* Outline #0EA5E9, 8px radius.
  - *Emergency:* Large, Pill-shaped, Solid #F43F5E, high-elevation shadow.
- **Cards:** Standard cards use the Level 1 shadow. Dashboard cards for metrics (e.g., heart rate, upcoming appointments) use the Glassmorphic treatment with subtle primary-colored glows.
- **Inputs:** Background #FFFFFF, 1px border #E2E8F0. On focus, border changes to Primary Green with a 3px soft outer glow. Icons are placed at the `inline-start`.
- **Navigation:** 
  - *Mobile:* Fixed bottom navigation with 4-5 key destinations. Icons are 24px Rounded Material style.
  - *Desktop:* Collapsible sidebar with high-contrast active states.
- **Tables:** Professional density. Header row has a subtle #F1F5F9 background. Rows have a hover state of #F8FAFC.
- **Badges:** 
  - *Success:* Green tint background, dark green text.
  - *Warning:* Amber tint background, dark amber text.
  - *Info:* Blue tint background, dark blue text.
- **Modals:** Centered on screen with a dark overlay (40% opacity). Always feature a clear "Close" or "Cancel" action in the `inline-end` top corner.