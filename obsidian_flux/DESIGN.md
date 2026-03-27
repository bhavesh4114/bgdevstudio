# Design System Strategy: The Kinetic Void

## 1. Overview & Creative North Star
**Creative North Star: "The Kinetic Void"**

This design system is built to evoke the feeling of high-precision instruments operating within a vast, digital infinite. We are moving away from the "flat" web. By leveraging a deep black foundation (`#000000`), we create a vacuum where light, motion, and depth become the primary communicators of brand value. 

The aesthetic is **Editorial Tech**. It breaks the traditional "bootstrap" grid by utilizing intentional asymmetry—placing oversized typography against tight, functional UI components. We prioritize breathing room over containment. Elements should feel as though they are floating in a pressurized environment, held together by gravitational pull (tonal shifts) rather than physical cages (borders).

---

## 2. Colors & Surface Architecture
The palette is rooted in absolute darkness, using electric accents to guide the eye through the "void."

### The "No-Line" Rule
**Standard 1px solid borders are strictly prohibited for sectioning.** 
Layout boundaries must be defined through background color shifts. To separate a hero section from a feature grid, transition from `surface` (#0e0e0e) to `surface_container_low` (#131313). This creates a sophisticated, seamless flow that feels architectural rather than templated.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to define depth:
*   **Base Level:** `surface_container_lowest` (#000000) for the deepest background.
*   **Secondary Level:** `surface_container_low` (#131313) for large content sections.
*   **Component Level:** `surface_container_high` (#1f1f1f) for cards or interactive elements.
*   **Interaction Level:** `surface_bright` (#2c2c2c) for active states.

### The "Glass & Gradient" Rule
To achieve a premium, custom feel, use **Glassmorphism** for floating overlays (Modals, Navigation Bars, Tooltips). 
*   **Formula:** `surface_container_low` at 60% opacity + `backdrop-blur: 20px`.
*   **Signature Textures:** Main CTAs must use a linear gradient from `primary` (#97a9ff) to `secondary` (#c180ff) at a 135-degree angle. This injects "soul" into the professional darkness.

---

## 3. Typography: The Editorial Voice
We utilize a dual-typeface system to balance high-tech precision with human-centric readability.

*   **Display & Headlines (Manrope):** This is our "Statement" font. Use `display-lg` and `headline-lg` with tight letter-spacing (-0.02em) to create a bold, authoritative presence.
*   **Body & Labels (Inter):** Inter provides the functional clarity required for technical agency work. Use `body-md` for standard descriptions and `label-md` for metadata.
*   **Hierarchy Tip:** Never center-align large blocks of text. Use left-aligned "Editorial Stacks"—where a `label-sm` in `secondary` color sits above a `headline-lg` in `on_surface` to create a clear entry point for the reader.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering**, not shadows.

*   **The Layering Principle:** Instead of using shadows to lift a card, place a `surface_container_highest` (#262626) card on top of a `surface_container_low` (#131313) background. The contrast in value provides a natural, soft lift.
*   **Ambient Shadows:** If an element must float (e.g., a primary dropdown), use a shadow tinted with the `primary_dim` (#3e65ff) color at 5% opacity. This mimics the glow of the screen's light rather than a physical shadow.
*   **The "Ghost Border" Fallback:** For accessibility in forms, use a "Ghost Border." Apply `outline_variant` (#484848) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `secondary`), `9999px` (full) roundedness. No border. On hover, increase the `surface_tint` glow.
*   **Secondary:** `surface_container_high` background with a `primary` Ghost Border. 
*   **Tertiary:** Text-only using `primary_fixed`, with a subtle underline appearing on hover.

### Cards
Cards are "Glass Containers." 
*   **Style:** No borders. Use `surface_container_low` with a subtle 4% `on_surface` overlay.
*   **Interaction:** On hover, the background should shift to `surface_container_high` with a smooth 300ms transition.

### Input Fields
*   **Architecture:** Use `surface_container_lowest` for the field background to create a "punched-out" effect against the `surface` background.
*   **Active State:** The Ghost Border transitions to 100% opacity `primary` color with a 2px outer glow.

### Lists & Navigation
*   **Rule:** Forbid the use of divider lines. 
*   **Spacing:** Use `spacing-8` (2rem) to separate list items. Use a subtle `surface_container` shift on hover to indicate selection.

### Feature Chips
Small, high-contrast pills. Background: `secondary_container`. Text: `on_secondary_container`. Roundedness: `md` (0.375rem).

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. A text block on the left balanced by a large, glassmorphic image on the right.
*   **Do** use `primary_container` for subtle background glows behind key sections to break up the black.
*   **Do** ensure all interactive elements have a minimum 300ms ease-in-out transition.

### Don't:
*   **Don't** use 100% white (#FFFFFF) for long-form body text; use `on_surface_variant` (#ababab) to reduce eye strain against the black.
*   **Don't** ever use a standard "drop shadow" (black/grey with high opacity).
*   **Don't** use sharp corners. Use the `md` or `lg` roundedness scale to keep the tech feeling "approachable" rather than "aggressive."
*   **Don't** use lines to separate content. If the layout feels messy, increase your `spacing` scale values instead of adding a border.