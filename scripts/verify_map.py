"""Screenshot the map section and verify city dots appear."""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:5174', wait_until='networkidle')
    page.evaluate('document.querySelector("svg").scrollIntoView()')
    page.wait_for_timeout(4500)
    page.screenshot(path='wcag-screenshots/map-fixed.png', full_page=False)

    dots = page.evaluate("""
        () => {
            const circles = document.querySelectorAll('svg circle');
            return Array.from(circles).filter(c => parseFloat(c.getAttribute('r') || '0') >= 5).length;
        }
    """)
    print(f'City pin dots (r>=5): {dots}')

    # Also check opacity of motion.g elements -- they should not be 0
    opacities = page.evaluate("""
        () => {
            const gs = document.querySelectorAll('svg g');
            return Array.from(gs).map(g => g.style.opacity || 'unset').slice(0, 10);
        }
    """)
    print(f'SVG g opacities: {opacities}')
    b.close()
