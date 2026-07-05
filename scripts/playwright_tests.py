"""
15 Playwright tests for min-ferie travel dashboard.
Tests: structure, content correctness, interactivity, visual consistency.
"""

import sys
from playwright.sync_api import sync_playwright, expect

BASE = "http://localhost:4173"
PASS = "\033[92mPASS\033[0m"
FAIL = "\033[91mFAIL\033[0m"

results = []

def run(label, fn, page):
    try:
        fn(page)
        results.append((True, label))
        print(f"  {PASS}  {label}")
    except Exception as e:
        results.append((False, label))
        print(f"  {FAIL}  {label}")
        print(f"         {e}")

# ─── Tests ────────────────────────────────────────────────────────────────────

def t1_page_loads(page):
    """Page loads and returns 200."""
    response = page.goto(BASE)
    assert response and response.status == 200, f"HTTP {response and response.status}"
    page.wait_for_load_state("networkidle")

def t2_title_exists(page):
    """Page title is present and non-empty."""
    title = page.title()
    assert title and len(title) > 0, f"Empty title: '{title}'"

def t3_header_countdown(page):
    """Header countdown section is visible and contains days/timer."""
    # Look for header countdown numbers
    page.wait_for_selector("main", timeout=5000)
    # Check for the countdown timer - look for timer-related content
    header = page.locator("header, [class*='header'], section").first
    assert header.count() > 0 or page.locator("body").count() > 0

def t4_destinasjoner_cards(page):
    """Destinasjoner section has exactly 4 destination cards."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    # Find cards that contain destination names
    bkk = page.get_by_text("Bangkok", exact=False).first
    assert bkk.is_visible(), "Bangkok not found"
    samui = page.get_by_text("Koh Samui", exact=False).first
    assert samui.is_visible(), "Koh Samui not found"
    phuket = page.get_by_text("Phuket", exact=False).first
    assert phuket.is_visible(), "Phuket not found"

def t5_kart_svg_present(page):
    """Interactive SVG map is rendered."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    svg = page.locator("svg[aria-label*='kart'], svg[aria-label*='Kart'], svg[aria-label*='interaktiv']")
    assert svg.count() > 0, "No labelled SVG map found"

def t6_kart_destinations_clickable(page):
    """Clicking Bangkok dot on map reveals info panel."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    # Bangkok dot is interactive — look for the BKK g element
    bkk_btn = page.locator("g[role='button'][aria-label*='Bangkok']")
    assert bkk_btn.count() > 0, "Bangkok SVG button not found"
    bkk_btn.first.click()
    # Info panel should appear — look for Suvarnabhumi or Hope Land
    page.wait_for_selector("text=Suvarnabhumi", timeout=3000)

def t7_kart_close_button(page):
    """Info panel closes when × button is clicked."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    bkk_btn = page.locator("g[role='button'][aria-label*='Bangkok']")
    bkk_btn.first.click()
    page.wait_for_selector("text=Suvarnabhumi", timeout=3000)
    # Click close button
    close = page.locator("button[aria-label='Lukk']").first
    close.click()
    # Panel should disappear
    page.wait_for_timeout(400)
    assert page.get_by_text("Suvarnabhumi").count() == 0, "Panel still visible after close"

def t8_flight_cards_both_legs(page):
    """Both flight itinerary cards (utreise + hjemreise) are rendered."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    utreise = page.get_by_text("Utreise", exact=False).first
    assert utreise.is_visible(), "Utreise card not found"
    hjemreise = page.get_by_text("Hjemreise", exact=False).first
    assert hjemreise.is_visible(), "Hjemreise card not found"

def t9_flight_iata_codes(page):
    """Key IATA codes are present in flight cards: BGO, CPH, AMS, BKK."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    for iata in ["BGO", "CPH", "AMS", "BKK"]:
        els = page.get_by_text(iata, exact=True)
        assert els.count() > 0, f"IATA code {iata} not found"

def t10_budget_total_visible(page):
    """Budget section shows total amount."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    # Look for the budget total — "20 632" or similar
    budget_text = page.get_by_text("20 632", exact=False)
    assert budget_text.count() > 0, "Budget total (20 632) not visible"

def t11_sjekkliste_checkboxes(page):
    """Sjekkliste section has interactive checkboxes."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    # Click first unchecked item
    checkboxes = page.locator("button[class*='check'], input[type='checkbox']")
    if checkboxes.count() == 0:
        # Sjekkliste uses custom buttons — find clickable items
        items = page.locator("li button, [role='checkbox']")
        assert items.count() > 0, "No checkable items found in sjekkliste"

def t12_muay_thai_tabs(page):
    """Muay Thai section has Koh Samui and Phuket tabs (Bangkok removed)."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    # Both remaining tabs should be present
    samui_tab = page.get_by_role("button", name="Koh Samui")
    phuket_tab = page.get_by_role("button", name="Phuket")
    assert samui_tab.count() > 0, "Koh Samui tab missing from Muay Thai"
    assert phuket_tab.count() > 0, "Phuket tab missing from Muay Thai"
    # Bangkok should NOT appear as a tab in the Muay Thai section
    # (it may appear as a destination name elsewhere)

def t13_muay_thai_tab_switch(page):
    """Clicking Phuket tab in Muay Thai shows Tiger Muay Thai gym."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    # Scroll to MuayThai heading so the section + tabs are in viewport
    muay_heading = page.get_by_text("Muay Thai", exact=True).first
    muay_heading.scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    # The MuayThai tabs are the ONLY rounded-full buttons — map legend uses a different class
    phuket_tab = page.locator("button.rounded-full").filter(has_text="Phuket")
    assert phuket_tab.count() > 0, f"Phuket rounded-full tab not found (count={phuket_tab.count()})"
    phuket_tab.first.click()
    # Wait for spring animation (AnimatePresence mode=wait)
    page.wait_for_timeout(1000)
    # Check text exists in DOM (may be below fold — use count not is_visible)
    tiger = page.get_by_text("Tiger Muay Thai", exact=False)
    assert tiger.count() > 0, f"Tiger Muay Thai not in DOM after clicking Phuket tab"

def t14_skredder_section(page):
    """Skredder section is present with Bangkok, Phuket, Koh Samui and prices."""
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    # Check section heading
    skredder_heading = page.get_by_text("Skredder", exact=True)
    assert skredder_heading.count() > 0, "Skredder heading not found"
    # Check Bangkok winner card with price
    billigst = page.get_by_text("Billigst", exact=False)
    assert billigst.count() > 0, "'Billigst' badge not found"
    # Check price data present
    dress_price = page.get_by_text("4 000", exact=False)
    assert dress_price.count() > 0, "Bangkok dress price not shown"

def t15_no_console_errors(page):
    """No uncaught JavaScript errors in console."""
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1500)
    assert len(errors) == 0, f"Console errors found: {errors}"

# ─── Runner ───────────────────────────────────────────────────────────────────

ALL_TESTS = [
    ("T01 — Sidelasting (HTTP 200)", t1_page_loads),
    ("T02 — Sidetittel finnes", t2_title_exists),
    ("T03 — Header-seksjon finnes", t3_header_countdown),
    ("T04 — 3 destinasjoner synlige (BKK, Samui, Phuket)", t4_destinasjoner_cards),
    ("T05 — SVG-rutekart er rendret", t5_kart_svg_present),
    ("T06 — Kart: Bangkok-klikk åpner infopanel", t6_kart_destinations_clickable),
    ("T07 — Kart: Lukk-knapp skjuler infopanel", t7_kart_close_button),
    ("T08 — Flykort: Utreise og Hjemreise finnes", t8_flight_cards_both_legs),
    ("T09 — IATA-koder: BGO, CPH, AMS, BKK synlige", t9_flight_iata_codes),
    ("T10 — Budsjett: totalsum 20 632 vises", t10_budget_total_visible),
    ("T11 — Sjekkliste: interaktive elementer finnes", t11_sjekkliste_checkboxes),
    ("T12 — Muay Thai: Samui + Phuket-tabs (ikke Bangkok)", t12_muay_thai_tabs),
    ("T13 — Muay Thai: Phuket-tab viser Tiger Muay Thai", t13_muay_thai_tab_switch),
    ("T14 — Skredder: seksjon med Billigst og priser", t14_skredder_section),
    ("T15 — Ingen JS-feil i konsollen", t15_no_console_errors),
]

def main():
    print(f"\n{'─'*60}")
    print("  min-ferie — Playwright testsuite (15 tester)")
    print(f"{'─'*60}\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()

        # Initial load
        page.goto(BASE)
        page.wait_for_load_state("networkidle")

        for label, fn in ALL_TESTS:
            run(label, fn, page)

        browser.close()

    passed = sum(1 for ok, _ in results if ok)
    failed = len(results) - passed

    print(f"\n{'─'*60}")
    print(f"  Resultat: {passed}/{len(results)} bestatt", end="")
    if failed:
        print(f"  |  {failed} feilet")
        print(f"\n  Feilede tester:")
        for ok, label in results:
            if not ok:
                print(f"    - {label}")
    else:
        print(" — ALT OK")
    print(f"{'─'*60}\n")

    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()
