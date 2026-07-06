# 🎨 Design Guidelines

**Project:** CineWrap Movie Streaming Web  
**UI/UX Version:** v1.0 - Current design system in the repo  
**Owner / Contact:** [Phan Khánh Duy]  
**Source Design Link:** [Insert Figma / Adobe XD / Canva link here]

---

## 1. 🎯 Overview

### Visual style

- Modern, cinematic, and visually deep.
- Dark, premium, and strongly contrasted with light accents.
- Feels more like a premium streaming experience than a generic entertainment website.

### Target experience

- Optimize for fast browsing, fast searching, and fast selection.
- Mobile-first, while still preserving a cinematic feel on desktop.
- Optimized for one-handed use on mobile, with clear navigation and low friction.
- Focus on immersion: large hero areas, prominent posters, layered gradients, and smooth interaction.

### Core principles

- Every screen must stay consistent with CineWrap's dark cinematic language.
- Do not break the core color system defined in Tailwind v4.
- Do not add new fonts, accent colors, corner radii, or effects unless they are part of the design system.
- Avoid generic web-app layouts; prefer content blocks with rhythm, depth, and layering.

---

## 2. 🎨 Color System

### 🔹 Primary & Secondary Colors

- `#ffc107`: **Primary** - Brand accent, primary CTA, active state, and important interaction points.
- `#00a3ff`: **Secondary** - Secondary accent, icons, secondary links, glow gradients, and behavior highlights.

### 🔹 Semantic Colors

- `#22c55e`: **Success** - Success states, confirmations, and completed actions.
- `#f59e0b`: **Warning** - Warnings, pending states, and attention markers.
- `#e50914`: **Danger / Error** - Errors, delete actions, cancel actions, and risky content.
- `#38bdf8`: **Info** - Extra information, tooltips, hints, and secondary chips.

### 🔹 Background & Typography Colors

- `#0f172a`: **Main Background** - Main site background.
- `#1e293b`: **Secondary Background** - Section background, panel, dropdown, and overlay.
- `#334155`: **Surface / Card** - Card background, content blocks, and intermediate surfaces.
- `#ffffff`: **Text Primary** - Titles, main content, and bold CTA text.
- `#9ca3af`: **Text Secondary** - Descriptions, captions, metadata, and helper text.
- `#7e7668`: **Neutral / Warm Neutral** - Use very sparingly for secondary emphasis or neutral states.

### 🔹 Color usage rules

- The main background must always remain a deep navy tone, never switch to white as the default background.
- Primary CTA should use yellow; use blue only when a secondary or technical accent is needed.
- Overlays, blur, and glow effects should use the yellow-blue system to preserve brand identity.
- Do not introduce purple, pink, or unsupported neon tones unless they are approved first.

---

## 3. ✍️ Typography

### Font family

- **Primary font:** `Plus Jakarta Sans`
- **Fallback:** `sans-serif`
- **Note:** Do not use serif as the global default unless a specific editorial section intentionally requires it.

### Typography scale

| Token            | Size    | Weight  | Line-height | Usage                                     |
| :--------------- | :------ | :------ | :---------- | :---------------------------------------- |
| `Display / Hero` | 40-56px | 700-800 | 1.05-1.15   | Hero banners, key visuals, opening titles |
| `Heading 1`      | 28-32px | 700     | 1.15-1.2    | Page titles, major section titles         |
| `Heading 2`      | 22-24px | 600-700 | 1.2-1.3     | Section titles, card headings             |
| `Heading 3`      | 18-20px | 600     | 1.3         | Subtitles and block labels                |
| `Body Large`     | 16px    | 400-500 | 1.5-1.6     | Main body text                            |
| `Body Small`     | 14px    | 400-500 | 1.4-1.5     | Supporting text, captions, metadata       |
| `Button Text`    | 14-16px | 600-700 | 1           | CTA labels and action buttons             |
| `Label / Meta`   | 12-13px | 500-600 | 1           | Badges, metadata, category labels         |

### Typography rules

- Titles should be short, strong, and cinematic; avoid long sentences.
- Descriptions must remain readable on dark backgrounds, ideally within 2-3 lines in hero cards.
- Button text must be clear, concise, and action-oriented.
- Avoid all-caps for long content; reserve uppercase for labels or navigation emphasis.

---

## 4. 📐 Layout & Spacing

### Spacing scale

Use a `4px` and `8px` based spacing system.

- `4px` / `8px`: icon gaps, small padding, spacing between chips and badges.
- `12px` / `16px`: standard item padding, small cards, row content.
- `20px` / `24px`: spacing between blocks inside a section.
- `32px` / `40px` / `48px`: spacing between sections, hero area, and footer.

### Container & layout

- Mobile: 16px padding, prioritize one column.
- Tablet: 24px padding, allow two-column or light masonry layouts.
- Desktop: main content should sit within a 1200-1440px frame depending on the section.
- Hero and footer can stretch full width, but text content must still sit inside a constrained container.

### Grid & responsive behavior

- Mobile (`< 768px`): one column, vertical scroll first, compact menu.
- Tablet (`768px - 1024px`): 2-3 columns depending on content density.
- Desktop (`> 1024px`): 4-6 columns for movie rails, 12-column logic for complex layouts.

### Layout rules

- Every section should follow a clear rhythm: title -> description -> content.
- Cards should keep equal height within the same row whenever possible.
- Do not overload a single screen with too much information; use clear hierarchy.
- Preserve a sense of spaciousness without feeling empty by using gradients and layered backgrounds.

---

## 5. 🧩 Key UI Components

### 🔹 Buttons

- **Primary button:** `#ffc107` background, dark bold text, large rounded corners, subtle shadow.
- **Secondary button:** `#00a3ff` background, or transparent with a cyan border.
- **Hover:** slightly brighter or a bit deeper in tone, but never too aggressive.
- **Active:** a very small scale-down to keep the interaction grounded.
- **Disabled:** reduced opacity and a `not-allowed` cursor.

### 🔹 Inputs & forms

- Dark background with a thin muted white/gray border.
- Focus must be emphasized with a bright border or a soft glow in the primary/secondary color.
- Placeholder text should be softer than the main text but still readable.
- Error states must be clear, direct, and paired with short support messaging.

### 🔹 Movie cards / posters

- Poster is the focal point; text only supports it.
- Use moderate corner radius, light shadow, and a gradient overlay to keep text readable.
- Include quality, age rating, rating, or continue-watching status when relevant.
- On desktop hover, cards may lift slightly, brighten, or reveal actions.

### 🔹 Header / navigation

- Header should be fixed, with a transparent or slightly blurred dark state depending on scroll.
- Desktop navigation sits in the center, logo on the left, actions on the right.
- Dropdowns must use backdrop blur, soft borders, and short transitions.
- Mobile navigation should use a drawer/accordion pattern that is easy to tap and not too deep.

### 🔹 Hero section

- The hero must be the first strong visual impression, with powerful imagery and readable text.
- Use gradient overlays to keep content legible over image or video backgrounds.
- Use one primary CTA, and one secondary CTA only if needed.

### 🔹 Footer

- Footer is where brand info, support, legal, and secondary navigation are grouped.
- Make the background slightly darker than the body to create separation.
- A subtle logo/typo watermark is fine as long as it does not compete with content.

---

## 6. ✨ Motion, Effects & Interaction

### Motion principles

- Motion should support navigation and emotion, not just visual decoration.
- Prefer short, smooth, and predictable transitions.
- Use fades, slides, small scale shifts, and light blur; avoid overly layered effects.

### Interaction timing

- Hover: 150-300ms.
- Menu, dropdown, and drawer enter/exit: 200-300ms.
- Larger hero or standout animations can run longer, but only when intentional.

### What is currently used in the system

- Framer Motion for buttons, dropdowns, mobile menus, and overlays.
- Ambient light effects, gradient blur, background zoom, and light parallax.
- Typewriter text for hero messaging and emotional pacing.

### Avoid

- Avoid continuous animations that cause eye fatigue when they do not serve the content.
- Avoid layout jitter when opening menus or scrolling.
- Avoid stacking too many heavy shadows.

---

## 7. 📱 Responsive & Mobile-First Rules

### Mobile

- Optimize touch targets: minimum height of 44px.
- Prioritize core content first and hide secondary details when needed.
- Menus should be easy to reach with the thumb, with enough spacing between items.

### Tablet

- Allow metadata and posters to sit side by side where appropriate.
- Keep the grid stable and avoid excessive column shifts.

### Desktop

- The experience can feel more cinematic: larger imagery, refined hover states, and layered backgrounds.
- Do not make content too dense; each section needs breathing room.

---

## 8. ⚡ Performance & Frontend Optimization

_(Required for every CineWrap screen to keep the experience smooth, lightweight, and consistent across mobile and desktop.)_

### 🔹 1. Loading states

- Do not prioritize circular spinners for large lists, movie grids, or major content sections.
- Prefer Skeleton Screens that match the shape of the actual data: poster, title, metadata, and actions.
- Skeletons should use soft neutral grays, with a smooth shimmer animation that is not too bright or distracting.
- For sections with many cards, such as new releases, top movies, or recommendations, the skeleton must reflect the real layout density.
- Lazy loading should be applied to images below the first viewport and to delayed content while scrolling.
- For heavy routes or large blocks, prefer route-level or component-level code splitting to reduce the initial JS payload.

### 🔹 2. Assets optimization

- Do not render original oversized images when they are not needed; images must be resized to the display container first.
- Posters, thumbnails, and backdrops should have multiple sizes based on usage rather than reusing one large file everywhere.
- Prefer `.webp`; if the pipeline is stable enough, use `.avif` for even better compression on static imagery.
- Logo, typo, and icon assets should stay as SVG or lightweight assets to preserve sharpness and reduce weight.
- Use video or animated backgrounds only when they clearly add value; do not spread them across every section.

### 🔹 3. Interaction optimization and API efficiency

- Search inputs or filters that call APIs must use debounce, usually in the 300ms to 500ms range depending on typing frequency.
- Infinite scroll, resize, and other high-frequency triggers should be throttled when appropriate.
- When a user triggers important actions such as form submit, save, booking, or payment, the button must become disabled immediately to prevent duplicate submits.
- While the action is in flight, show a small loading indicator inside the button instead of allowing repeated clicks.
- Heavy interactions must provide clear feedback so users know the action has been captured.

### 🔹 4. Empty and error states

- Empty states must never be blank; they should include a light illustration, guidance text, and a suggested next action.
- The illustration should be an SVG or other lightweight asset that matches CineWrap's dark cinematic style.
- For screens such as continue-watching, saved items, or search results, include short, understandable messaging and a next step.
- If a small component fails to render, it must not bring down the whole page.
- Wrap risky areas with Error Boundaries so local failures show a gentle fallback, a reload prompt, and the rest of the page stays usable.

### 🔹 5. Practical frontend rules

- Render the visible content first and delay less important content until it is needed.
- Avoid excessive re-rendering in large lists; only update the parts that actually changed.
- Reduce layout shift by reserving dimensions for images, cards, and media areas.
- Keep animations smooth but not heavy, especially on mid-range mobile devices.
- Every optimization must support the movie-watching experience and must not reduce the cinematic feel of the UI.

---

## 9. ♿ Accessibility & Usability

- All buttons and icons should have clear labels or `aria-label` attributes when needed.
- Text contrast on dark backgrounds must stay readable, especially for captions and placeholders.
- Do not rely only on color to communicate status; use icons, labels, or text as well.
- Focus states must remain visible for keyboard users.
- Important content should not depend entirely on animation.

---

## 10. 📦 Project Assets

- **Logo / typo:** store in `/src/assets/images/`.
- **Poster / backdrop images:** prefer `.webp` or other high-quality, optimized formats.
- **Icons:** prefer inline SVG or a lightweight icon library with a consistent stroke/filled style.
- **Video:** use only when it is truly needed for the hero or cinematic feel.
- **Naming convention:** use clear, consistent names that distinguish logo, typo, poster, backdrop, and banner assets.

---

## 11. 🔐 Role-Based UI Rules

- Do not split login into multiple manual tabs.
- The UI must change based on the role returned from the backend or JWT.
- Viewers should only see browsing, search, save, and continue-watching flows.
- Admins or content managers should be the only ones who see editing areas, category management, movies, episodes, and user management.
- Dangerous actions such as delete, approve, or hide content must have a clear confirmation state.

---

## 12. ✅ UI Design and Implementation Checklist

- Is the screen using the correct dark background and yellow-blue accent system?
- Is typography consistent with Plus Jakarta Sans?
- Is spacing between sections balanced and comfortable?
- Does the primary CTA stand out above the secondary CTA?
- Is the mobile experience easy to use with one hand?
- Do dropdowns, drawers, cards, and footers share the same visual language?
- Is text contrast strong enough on dark backgrounds?
- Is any component introducing colors, fonts, or effects outside the system?

---

## 13. 🚫 What Not To Do

- Do not switch the whole product to a light theme without a new brand strategy.
- Do not mix too many fonts or assign a custom font per component.
- Do not use accent colors outside the palette unless the design system is updated.
- Do not make border radius inconsistent across the main components.
- Do not design the hero, header, and footer in separate visual languages.
- Do not add heavy effects that make the experience slow, noisy, or hard to read.

---

## 14. 📝 Developer Notes

- This is a living design system and should be updated when the UI changes significantly.
- When adding a new component, map it back to the existing palette, typography, spacing, and motion rules before creating custom styling.
- If there is an official Figma file, update the Overview, Color System, and Typography sections first.
- When the brand changes, update the design tokens first instead of patching individual components one by one.

---

## 15. 📌 Quick Summary

- **Feel:** cinematic, dark, premium, and visually deep.
- **Core colors:** deep navy + cinema yellow + technical cyan.
- **Font:** Plus Jakarta Sans.
- **Layout:** spacious, clean, and section-driven.
- **Interaction:** smooth, light, and intentional.
- **Goal:** help the frontend team build a consistent, accurate UI that improves user experience.
