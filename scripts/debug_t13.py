"""Debug T13 — inspect which buttons match 'Phuket' and what renders after click."""
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4173"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.goto(BASE)
    page.wait_for_load_state("networkidle")

    # Find all buttons containing "Phuket"
    btns = page.get_by_role("button", name="Phuket")
    print(f"Buttons with name='Phuket': {btns.count()}")
    for i in range(btns.count()):
        b = btns.nth(i)
        print(f"  [{i}] visible={b.is_visible()} | text='{b.inner_text()}' | box={b.bounding_box()}")

    # Scroll to Muay Thai section and find tabs there
    page.get_by_text("Muay Thai", exact=True).first.scroll_into_view_if_needed()
    page.wait_for_timeout(500)

    # Screenshot before click
    page.screenshot(path="scripts/debug_before.png", full_page=False)

    # Click first visible Phuket tab button
    phuket_tab = page.get_by_role("button", name="Phuket").first
    phuket_tab.click()
    page.wait_for_timeout(800)

    # Screenshot after click
    page.screenshot(path="scripts/debug_after.png", full_page=False)

    # Check for Tiger Muay Thai
    tiger_count = page.get_by_text("Tiger Muay Thai", exact=False).count()
    print(f"'Tiger Muay Thai' count after click: {tiger_count}")

    # List all visible text in viewport region
    muay_region = page.get_by_text("Muay Thai", exact=True).first
    print(f"Muay Thai heading visible: {muay_region.is_visible()}")

    browser.close()
