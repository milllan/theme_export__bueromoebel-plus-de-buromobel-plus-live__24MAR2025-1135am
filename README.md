Summary of Optimizations for bueromoebel-plus.de:


# Shopify Theme Speed Optimization & Core Web Vitals Report

This document outlines the key changes made to the Shopify theme code to improve website loading speed, Core Web Vitals (LCP, CLS, TBT/FID), and overall user experience.

---

## Summary of Optimizations

The following optimizations were implemented by modifying the theme's Liquid, CSS, and JavaScript code:

### 1. Image Optimization

Optimizing image loading is crucial for perceived speed and LCP.

*   **Native Lazy Loading:** Implemented native browser lazy loading (`` `loading="lazy"` ``) for images below the fold (product cards, testimonials, footer, etc.).
    *   **Benefit:** Reduces initial page weight, speeds up critical content loading, and improves LCP by deferring off-screen image downloads.
*   **Prioritized Critical Images (LCP):** Identified likely LCP images (first slideshow image, collection banners, early sections) and ensured they load eagerly (`` `loading="eager"` ``, `` `fetchpriority="high"` ``) with `preload` hints.
    *   **Benefit:** Significantly improves LCP by loading the main visual content faster.
*   **Efficient Slideshow Loading:** Optimized the main slideshow (`` `slideshow.liquid` ``) to load the *first* slide's image immediately (`eager`, `high` priority, `preload`) and lazy-load subsequent slides.
    *   **Benefit:** Crucial for homepage LCP.
*   **Asynchronous Decoding:** Added `` `decoding="async"` `` to many images.
    *   **Benefit:** Reduces main thread blocking during image decoding, improving responsiveness (TBT).
*   **Explicit Dimensions/Aspect Ratios:** Ensured images use appropriate `` `sizes` `` attributes and CSS aspect ratios.
    *   **Benefit:** Helps prevent Cumulative Layout Shift (CLS) by reserving space for images.
*   **Smart LazySizes Loading:** Replaced the general `lazysizes.js` script with native lazy loading where possible. Added logic to load `lazysizes.js` *only* via IntersectionObserver if an image with the `` `lazyload` `` class (potentially added by an app) is detected near the viewport.
    *   **Benefit:** Reduces initial JS payload and execution time by leveraging native browser features.

### 2. JavaScript Optimization

Reducing JavaScript execution time is key for improving TBT and interactivity.

*   **Deferred Non-Critical JavaScript:** Ensured theme JS (`` `theme.min.js` ``, `` `vendor.min.js` ``) uses `` `defer` ``. Used non-blocking techniques (`` `requestIdleCallback` ``, `` `DOMContentLoaded` `` + `` `requestAnimationFrame` ``) for low-priority tasks (e.g., calculating header height).
    *   **Benefit:** Improves FCP, TTI, and reduces TBT by allowing faster HTML parsing and rendering.
*   **Conditional Loading of App Scripts:** Restricted "Bold Options" scripts to load only on relevant pages (product, collection, cart, search).
    *   **Benefit:** Prevents unnecessary app script loading on pages like the homepage, speeding them up significantly.
*   **Delayed Third-Party Scripts:**
    *   Implemented Intersection Observer for the "ProvenExpert" widget script in the footer, delaying load until scrolled near.
    *   Added `` `prefetch` `` hint for the Klaviyo script.
    *   **Benefit:** Reduces the impact of third-party scripts (often performance heavyweights) on initial load and TBT.
*   **Faster Navigation (Prerendering & Prefetching):**
    *   Implemented the **Speculation Rules API** (for compatible Chrome browsers) to prerender likely next pages on hover/interaction.
    *   Added **Quicklink** library (loaded on user interaction/scroll) to prefetch links in the viewport during idle time.
    *   **Benefit:** Makes subsequent page navigations feel near-instantaneous for a better UX.

### 3. CSS Optimization

Efficient CSS improves rendering speed and reduces layout shifts.

*   **Render Performance (`content-visibility` / `contain`):** Applied CSS `` `content-visibility: auto` ``, `` `contain: content` ``, and `` `contain-intrinsic-size` `` to major off-screen sections (later slideshow slides, carousels, footer, etc.).
    *   **Benefit:** Speeds up initial rendering and reduces TBT by allowing the browser to skip layout/paint work for off-screen content. Helps prevent CLS.
*   **Optimized Off-Screen/Hidden Elements:** Used `` `content-visibility: hidden` `` for initially hidden elements (mobile navigation drawer, mega menus).
    *   **Benefit:** Saves browser resources by not rendering initially hidden UI.
*   **Delayed CSS Loading:** Delayed loading of `` `bold-options.css` `` until needed.
    *   **Benefit:** Prevents non-critical CSS from blocking the render of main page content.
*   **Font Loading:** Added system font fallbacks to the main text font stack in CSS.
    *   **Benefit:** Improves perceived load speed and reduces CLS by displaying text immediately using available system fonts while web fonts load.
*   **Potential LCP/CLS Fixes:** Added targeted CSS (e.g., `` `opacity: 1!important` ``) to elements like collection banner headings to prevent theme fade-in effects from delaying LCP or causing CLS.

### 4. Resource Loading Hints

Guiding the browser on resource priority helps optimize the loading waterfall.

*   **Preconnect:** Added/maintained `` `preconnect` `` hints for essential third-party origins (Shopify CDN, Klaviyo).
    *   **Benefit:** Speeds up establishing connections to these domains.
*   **Preload/Prefetch:** Used `` `preload` `` for critical LCP images/fonts and `` `prefetch` `` for likely future resources.
    *   **Benefit:** Instructs the browser on resource priority.

### 5. Monitoring

*   **Added DebugBear RUM:** Integrated Real User Monitoring script.
    *   **Benefit:** Enables ongoing measurement of real user performance data (including Core Web Vitals) to track improvements and identify regressions.

---

## Third-Party App Performance Considerations (Klaviyo)

While the theme code has been optimized, third-party apps remain a significant factor in overall site performance.

*   **Issue:** The **Klaviyo popup** was identified loading a large image (approx. 2MB), significantly slowing down initial page load and negatively impacting the **LCP score**.
*   **Constraint:** Direct optimization of code or assets injected by third-party apps (like Klaviyo) is generally not possible through theme modifications, as changes can be overwritten by app updates.
*   **Recommendations for Client:**
    *   **ACTION NEEDED:** Replace the large image within the Klaviyo popup settings with a **web-optimized version** (ideally <200KB, using formats like WebP or optimized JPG/PNG).
    *   **ACTION NEEDED:** Adjust Klaviyo popup display rules to **avoid immediate loading**. Use options like time delay, scroll percentage trigger, or exit intent.
    *   Review popup targeting rules – is it needed immediately on every page for every visitor?
*   **Expected Outcome:** Addressing the Klaviyo popup image and display rules is crucial and expected to yield substantial improvements in loading speed and LCP, complementing the theme optimizations.

---

*This report summarizes the key technical changes. Please refer to performance measurement tools (PageSpeed Insights, GTmetrix) for before-and-after metrics.*
