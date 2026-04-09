/**
 * Responsive Design Breakpoints and Utilities
 * 
 * Tailwind CSS Breakpoints used in this project:
 * - sm: 640px   (small screens)
 * - md: 768px   (medium screens - tablet)
 * - lg: 1024px  (large screens - desktop)
 * - xl: 1280px  (extra large screens)
 * 
 * Responsive Patterns:
 * 
 * 1. Mobile-First Approach: Start with mobile styles, then add responsive modifiers
 *    Example: px-4 sm:px-6 lg:px-12
 * 
 * 2. Hidden/Visible on Breakpoints:
 *    - hidden lg:block  (hide on mobile, show on lg)
 *    - lg:hidden        (hide on lg and larger)
 * 
 * 3. Grid Layouts:
 *    - grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
 * 
 * 4. Flexbox Direction:
 *    - flex flex-col md:flex-row
 * 
 * Component Responsive Patterns:
 * 
 * - Navigate: Mobile hamburger menu, desktop full nav
 * - Dashboard: Card view on mobile (lg:hidden), table view on desktop (hidden lg:block)
 * - TicketCard: Mobile-optimized card layout for small screens
 * - Ticket Detail Page: Stacked layout on mobile, full layout on desktop
 */

/* No additional CSS needed - using Tailwind utilities throughout */
