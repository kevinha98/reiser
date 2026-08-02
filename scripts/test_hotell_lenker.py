"""
Comprehensive Playwright E2E test suite for min-ferie hotel links.
Tests all hotel references across all components for presence, clickability,
correct href attributes, and link integrity.

Run with preview server running on http://localhost:4173
"""

import sys
import time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4173"

# ─── Expected hotel data ─────────────────────────────────────────────────────

HOTELS = {
    "Hope Land Hotel Sukhumvit 8": {
        "url": "https://www.agoda.com/hope-land-hotel-sukhumvit-8/hotel/bangkok-th.html",
        "url_contains": "hope-land-hotel-sukhumvit-8",
    },
    "Lamai Coconut Beach Resort": {
        "url": "https://www.agoda.com/lamai-coconut-beach-resort/hotel/koh-samui-th.html",
        "url_contains": "lamai-coconut-beach-resort",
    },
    "Chanalai Flora Resort": {
        "url": "https://www.agoda.com/chanalai-flora-resort/hotel/phuket-th.html",
        "url_contains": "chanalai-flora-resort",
    },
    "Mandarin Hotel": {
        "url": "https://www.agoda.com/mandarin-hotel-managed-by-centre-point/hotel/bangkok-th.html",
        "url_contains": "mandarin-hotel",
    },
}

# ─── Test infrastructure ──────────────────────────────────────────────────────

results = []
PASS = "\033[92mPASS\033[0m"
FAIL = "\033[91mFAIL\033[0m"
SKIP = "\033[93mSKIP\033[0m"

def run(label, fn, page, section=""):
    try:
        fn(page)
        results.append(("pass", section, label))
        print(f"  {PASS}  {label}")
        return True
    except Exception as e:
        results.append(("fail", section, label, str(e)))
        print(f"  {FAIL}  {label}")
        print(f"         {str(e)[:120]}")
        return False


def goto(page, scroll=True):
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    if scroll:
        page.wait_for_timeout(300)


def goto_tab(page, tab_id):
    """Navigate to the app and switch to the given tab (forside/lounger/budsjett/sjekkliste)."""
    goto(page)
    page.locator(f"#tab-{tab_id}").click()
    # AnimatePresence mode="wait" plays an exit animation before mounting the new panel
    page.wait_for_selector(f"#panel-{tab_id}", timeout=5000)
    page.wait_for_timeout(600)


def goto_dato(page, iso):
    """Navigate to the app with a simulated date (?dato=YYYY-MM-DD)."""
    page.goto(f"{BASE}?dato={iso}")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(400)


def goto_dato_tab(page, iso, tab_id):
    """Simulate a date and switch to the given tab."""
    goto_dato(page, iso)
    page.locator(f"#tab-{tab_id}").click()
    page.wait_for_selector(f"#panel-{tab_id}", timeout=5000)
    page.wait_for_timeout(600)


# ─── SECTION 1: Page loads ────────────────────────────────────────────────────

def t_page_loads(page):
    r = page.goto(BASE)
    assert r and r.status == 200
    page.wait_for_load_state("networkidle")

def t_no_js_errors(page):
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    goto(page)
    page.wait_for_timeout(1000)
    assert len(errors) == 0, f"JS errors: {errors}"

def t_title_present(page):
    title = page.title()
    assert title and len(title) > 0


# ─── SECTION 2: DestinasjonKort hotel links ───────────────────────────────────

def _get_dest_hotel_links(page):
    goto(page)
    return page.locator("a[href*='agoda.com']")

def t_dest_bkk_link_exists(page):
    goto(page)
    link = page.locator("a[href*='hope-land-hotel-sukhumvit-8']")
    assert link.count() > 0, "Bangkok hotel link not found in DestinasjonKort"

def t_dest_bkk_link_text(page):
    goto(page)
    link = page.locator("a[href*='hope-land-hotel-sukhumvit-8']").first
    assert "Hope Land" in link.inner_text()

def t_dest_bkk_link_target(page):
    goto(page)
    link = page.locator("a[href*='hope-land-hotel-sukhumvit-8']").first
    assert link.get_attribute("target") == "_blank"

def t_dest_bkk_link_rel(page):
    goto(page)
    link = page.locator("a[href*='hope-land-hotel-sukhumvit-8']").first
    rel = link.get_attribute("rel") or ""
    assert "noopener" in rel

def t_dest_samui_link_exists(page):
    goto(page)
    link = page.locator("a[href*='lamai-coconut-beach-resort']")
    assert link.count() > 0, "Samui hotel link not found"

def t_dest_samui_link_text(page):
    goto(page)
    link = page.locator("a[href*='lamai-coconut-beach-resort']").first
    assert "Lamai" in link.inner_text()

def t_dest_samui_link_target(page):
    goto(page)
    link = page.locator("a[href*='lamai-coconut-beach-resort']").first
    assert link.get_attribute("target") == "_blank"

def t_dest_samui_link_rel(page):
    goto(page)
    link = page.locator("a[href*='lamai-coconut-beach-resort']").first
    assert "noopener" in (link.get_attribute("rel") or "")

def t_dest_phuket_link_exists(page):
    goto(page)
    link = page.locator("a[href*='chanalai-flora-resort']")
    assert link.count() > 0, "Phuket hotel link not found"

def t_dest_phuket_link_text(page):
    goto(page)
    link = page.locator("a[href*='chanalai-flora-resort']").first
    assert "Chanalai" in link.inner_text()

def t_dest_phuket_link_target(page):
    goto(page)
    link = page.locator("a[href*='chanalai-flora-resort']").first
    assert link.get_attribute("target") == "_blank"

def t_dest_phuket_link_rel(page):
    goto(page)
    link = page.locator("a[href*='chanalai-flora-resort']").first
    assert "noopener" in (link.get_attribute("rel") or "")

def t_dest_bkk2_link_exists(page):
    goto(page)
    link = page.locator("a[href*='mandarin-hotel-managed-by-centre-point']")
    assert link.count() > 0, "Bangkok II hotel link not found"

def t_dest_bkk2_link_text(page):
    goto(page)
    link = page.locator("a[href*='mandarin-hotel-managed-by-centre-point']").first
    text = link.inner_text()
    assert "Mandarin" in text or "Hotel" in text or len(text) > 0

def t_dest_bkk2_link_target(page):
    goto(page)
    link = page.locator("a[href*='mandarin-hotel-managed-by-centre-point']").first
    assert link.get_attribute("target") == "_blank"

def t_dest_bkk2_link_rel(page):
    goto(page)
    link = page.locator("a[href*='mandarin-hotel-managed-by-centre-point']").first
    assert "noopener" in (link.get_attribute("rel") or "")

def t_dest_all_hotel_links_count(page):
    goto(page)
    agoda_links = page.locator("a[href*='agoda.com']")
    assert agoda_links.count() >= 4, f"Expected >= 4 Agoda hotel links, got {agoda_links.count()}"

def t_dest_overnatting_label_present(page):
    goto(page)
    labels = page.get_by_text("Overnatting", exact=True)
    assert labels.count() >= 3


# ─── SECTION 3: Tidslinje (itinerary) hotel links ────────────────────────────

def t_tidslinje_bkk1_hotell_link(page):
    goto(page)
    link = page.locator("a[href*='hope-land-hotel-sukhumvit-8']").first
    assert link.is_visible() or link.count() > 0

def t_tidslinje_samui_hotell_link(page):
    goto(page)
    links = page.locator("a[href*='lamai-coconut-beach-resort']")
    assert links.count() > 0

def t_tidslinje_phuket_hotell_link(page):
    goto(page)
    links = page.locator("a[href*='chanalai-flora-resort']")
    assert links.count() > 0

def t_tidslinje_bkk2_hotell_link(page):
    goto(page)
    links = page.locator("a[href*='mandarin-hotel-managed-by-centre-point']")
    assert links.count() > 0

def t_tidslinje_hotell_icon_present(page):
    goto(page)
    # The Hotell links in Tidslinje show "Hotell" text
    hotell_links = page.locator("a", has_text="Hotell")
    assert hotell_links.count() >= 3, f"Expected >= 3 'Hotell' links in Tidslinje, got {hotell_links.count()}"

def t_tidslinje_all_hotell_links_have_target(page):
    goto(page)
    hotell_links = page.locator("a", has_text="Hotell")
    count = hotell_links.count()
    for i in range(count):
        link = hotell_links.nth(i)
        assert link.get_attribute("target") == "_blank", f"Link {i} missing target=_blank"

def t_tidslinje_all_hotell_links_have_rel(page):
    goto(page)
    hotell_links = page.locator("a", has_text="Hotell")
    count = hotell_links.count()
    for i in range(count):
        link = hotell_links.nth(i)
        rel = link.get_attribute("rel") or ""
        assert "noopener" in rel, f"Link {i} missing rel=noopener"

def t_tidslinje_bkk1_hotell_href_correct(page):
    goto(page)
    link = page.locator("a[href*='hope-land-hotel-sukhumvit-8']").first
    href = link.get_attribute("href") or ""
    assert "agoda.com" in href and "hope-land" in href

def t_tidslinje_samui_hotell_href_correct(page):
    goto(page)
    link = page.locator("a[href*='lamai-coconut-beach-resort']").first
    href = link.get_attribute("href") or ""
    assert "agoda.com" in href

def t_tidslinje_phuket_hotell_href_correct(page):
    goto(page)
    link = page.locator("a[href*='chanalai-flora-resort']").first
    href = link.get_attribute("href") or ""
    assert "agoda.com" in href

def t_tidslinje_bkk2_hotell_href_correct(page):
    goto(page)
    link = page.locator("a[href*='mandarin-hotel-managed-by-centre-point']").first
    href = link.get_attribute("href") or ""
    assert "agoda.com" in href and "mandarin" in href

def t_tidslinje_no_empty_hrefs(page):
    goto(page)
    all_links = page.locator("a[href]")
    count = all_links.count()
    for i in range(min(count, 60)):
        href = all_links.nth(i).get_attribute("href") or ""
        assert href.strip() != "", f"Empty href on link {i}"


# ─── SECTION 4: KartSeksjon map popup hotel links ────────────────────────────

def _open_bkk_popup(page):
    goto(page)
    bkk_btn = page.locator("g[role='button'][aria-label*='Bangkok']")
    assert bkk_btn.count() > 0
    bkk_btn.first.click()
    page.wait_for_selector("text=Suvarnabhumi Airport", timeout=3000)

def t_kart_popup_bkk_opens(page):
    _open_bkk_popup(page)
    assert page.get_by_text("Suvarnabhumi Airport").count() > 0

def t_kart_popup_bkk_hotel_link_exists(page):
    _open_bkk_popup(page)
    link = page.locator("a[href*='hope-land-hotel-sukhumvit-8']")
    assert link.count() > 0, "Hope Land link not found in BKK map popup"

def t_kart_popup_bkk_hotel_link_text(page):
    _open_bkk_popup(page)
    link = page.locator("a[href*='hope-land-hotel-sukhumvit-8']").first
    assert "Hope Land" in link.inner_text() or "Hotell" in link.inner_text()

def t_kart_popup_bkk_hotel_link_target(page):
    _open_bkk_popup(page)
    link = page.locator("a[href*='hope-land-hotel-sukhumvit-8']").first
    assert link.get_attribute("target") == "_blank"

def t_kart_popup_bkk_mandarin_link_exists(page):
    _open_bkk_popup(page)
    link = page.locator("a[href*='mandarin-hotel-managed-by-centre-point']")
    assert link.count() > 0, "Mandarin link not found in BKK map popup (second stay)"

def t_kart_popup_bkk_mandarin_link_target(page):
    _open_bkk_popup(page)
    link = page.locator("a[href*='mandarin-hotel-managed-by-centre-point']").first
    assert link.get_attribute("target") == "_blank"

def t_kart_popup_bkk_close(page):
    _open_bkk_popup(page)
    close = page.locator("button[aria-label='Lukk']").first
    close.click()
    page.wait_for_timeout(400)
    assert page.get_by_text("Suvarnabhumi Airport").count() == 0

def _open_samui_popup(page):
    goto(page)
    samui_btn = page.locator("g[role='button'][aria-label*='Samui']")
    assert samui_btn.count() > 0
    samui_btn.first.click()
    page.wait_for_selector("text=Samui Airport", timeout=3000)

def t_kart_popup_samui_opens(page):
    _open_samui_popup(page)
    assert page.get_by_text("Samui Airport").count() > 0

def t_kart_popup_samui_hotel_link_exists(page):
    _open_samui_popup(page)
    link = page.locator("a[href*='lamai-coconut-beach-resort']")
    assert link.count() > 0, "Lamai link not found in Samui map popup"

def t_kart_popup_samui_hotel_link_target(page):
    _open_samui_popup(page)
    link = page.locator("a[href*='lamai-coconut-beach-resort']").first
    assert link.get_attribute("target") == "_blank"

def t_kart_popup_samui_hotel_link_rel(page):
    _open_samui_popup(page)
    link = page.locator("a[href*='lamai-coconut-beach-resort']").first
    assert "noopener" in (link.get_attribute("rel") or "")

def _open_phuket_popup(page):
    goto(page)
    phuket_btn = page.locator("g[role='button'][aria-label*='Phuket']")
    assert phuket_btn.count() > 0
    phuket_btn.first.click()
    page.wait_for_selector("text=Phuket International", timeout=3000)

def t_kart_popup_phuket_opens(page):
    _open_phuket_popup(page)
    assert page.get_by_text("Phuket International").count() > 0

def t_kart_popup_phuket_hotel_link_exists(page):
    _open_phuket_popup(page)
    link = page.locator("a[href*='chanalai-flora-resort']")
    assert link.count() > 0, "Chanalai link not found in Phuket map popup"

def t_kart_popup_phuket_hotel_link_target(page):
    _open_phuket_popup(page)
    link = page.locator("a[href*='chanalai-flora-resort']").first
    assert link.get_attribute("target") == "_blank"

def t_kart_popup_phuket_hotel_link_rel(page):
    _open_phuket_popup(page)
    link = page.locator("a[href*='chanalai-flora-resort']").first
    assert "noopener" in (link.get_attribute("rel") or "")

def t_kart_popup_phuket_link_href_contains_agoda(page):
    _open_phuket_popup(page)
    link = page.locator("a[href*='chanalai-flora-resort']").first
    assert "agoda.com" in (link.get_attribute("href") or "")


# ─── SECTION 5: All hotel links security (noopener/noreferrer) ───────────────

def t_all_external_links_have_rel(page):
    goto(page)
    ext_links = page.locator("a[target='_blank']")
    count = ext_links.count()
    assert count > 0, "No external links found"
    failures = []
    for i in range(count):
        link = ext_links.nth(i)
        rel = link.get_attribute("rel") or ""
        if "noopener" not in rel:
            href = link.get_attribute("href") or "unknown"
            failures.append(f"Link {i} ({href[:60]}) missing noopener")
    assert len(failures) == 0, "\n".join(failures)

def t_all_hotel_agoda_links_unique(page):
    goto(page)
    hrefs = set()
    links = page.locator("a[href*='agoda.com']")
    for i in range(links.count()):
        hrefs.add(links.nth(i).get_attribute("href"))
    # Should have at least 3 unique hotel pages
    hotel_hrefs = [h for h in hrefs if h and "hotel" in h]
    assert len(hotel_hrefs) >= 3, f"Expected >= 3 unique hotel URLs, got: {hotel_hrefs}"

def t_no_broken_anchor_tags(page):
    goto(page)
    links = page.locator("a")
    count = links.count()
    for i in range(min(count, 80)):
        href = links.nth(i).get_attribute("href") or ""
        assert not href.startswith("javascript:void"), f"Link {i} has javascript:void href"

def t_all_hotel_links_visible_on_desktop(page):
    page.set_viewport_size({"width": 1440, "height": 900})
    goto(page)
    hotel_links = [
        "a[href*='hope-land-hotel-sukhumvit-8']",
        "a[href*='lamai-coconut-beach-resort']",
        "a[href*='chanalai-flora-resort']",
        "a[href*='mandarin-hotel-managed-by-centre-point']",
    ]
    for selector in hotel_links:
        link = page.locator(selector).first
        assert link.count() > 0, f"Link not found: {selector}"

def t_hotel_links_on_mobile(page):
    page.set_viewport_size({"width": 390, "height": 844})
    goto(page)
    agoda_links = page.locator("a[href*='agoda.com']")
    assert agoda_links.count() >= 4, f"Expected >= 4 Agoda links on mobile, got {agoda_links.count()}"


# ─── SECTION 6: Link href correctness ────────────────────────────────────────

def _check_all_hotel_hrefs(page):
    goto(page)
    expected = {
        "hope-land-hotel-sukhumvit-8": False,
        "lamai-coconut-beach-resort": False,
        "chanalai-flora-resort": False,
        "mandarin-hotel-managed-by-centre-point": False,
    }
    links = page.locator("a[href*='agoda.com']")
    for i in range(links.count()):
        href = links.nth(i).get_attribute("href") or ""
        for key in expected:
            if key in href:
                expected[key] = True
    return expected

def t_href_hope_land_present(page):
    found = _check_all_hotel_hrefs(page)
    assert found["hope-land-hotel-sukhumvit-8"], "Hope Land href not found anywhere on page"

def t_href_lamai_present(page):
    found = _check_all_hotel_hrefs(page)
    assert found["lamai-coconut-beach-resort"], "Lamai href not found anywhere on page"

def t_href_chanalai_present(page):
    found = _check_all_hotel_hrefs(page)
    assert found["chanalai-flora-resort"], "Chanalai href not found anywhere on page"

def t_href_mandarin_present(page):
    found = _check_all_hotel_hrefs(page)
    assert found["mandarin-hotel-managed-by-centre-point"], "Mandarin href not found anywhere on page"

def t_no_centrepoint_com_links(page):
    """centrepoint.com was giving 404 — must have been replaced by Agoda."""
    goto(page)
    broken = page.locator("a[href*='centrepoint.com']")
    assert broken.count() == 0, "Found leftover centrepoint.com link (was giving 404)"

def t_no_chanalai_direct_links(page):
    """chanalai.com was giving 403 — must have been replaced."""
    goto(page)
    broken = page.locator("a[href*='chanalai.com']")
    assert broken.count() == 0, "Found leftover chanalai.com link (was giving 403)"

def t_no_lamaicoconutbeachresort_direct_links(page):
    """Direct resort site was giving 401."""
    goto(page)
    broken = page.locator("a[href*='lamaicoconutbeachresort.com']")
    assert broken.count() == 0, "Found direct lamaicoconutbeachresort.com link (was giving 401)"

def t_all_agoda_links_use_https(page):
    goto(page)
    links = page.locator("a[href*='agoda.com']")
    for i in range(links.count()):
        href = links.nth(i).get_attribute("href") or ""
        assert href.startswith("https://"), f"Agoda link not https: {href}"

def t_all_agoda_links_point_to_thailand(page):
    goto(page)
    links = page.locator("a[href*='agoda.com'][href*='-th.html']")
    assert links.count() >= 4, f"Expected >= 4 Thailand Agoda links (-th.html), got {links.count()}"


# ─── SECTION 7: Other external links ─────────────────────────────────────────

def t_benihana_link_exists(page):
    goto(page)
    link = page.locator("a[href*='anantara.com']")
    assert link.count() > 0, "Benihana/Anantara link not found"

def t_benihana_link_target(page):
    goto(page)
    link = page.locator("a[href*='anantara.com']").first
    assert link.get_attribute("target") == "_blank"

def t_klook_muaythai_link_exists(page):
    goto(page)
    link = page.locator("a[href*='klook.com']")
    assert link.count() > 0, "Klook Muay Thai booking link not found"

def t_tiger_muaythai_link_exists(page):
    goto(page)
    link = page.locator("a[href*='tigermuaythai.com']")
    assert link.count() > 0, "Tiger Muay Thai link not found"

def t_lomprayah_link_exists(page):
    goto(page)
    link = page.locator("a[href*='lomprayah.com']")
    assert link.count() > 0, "Lomprayah Koh Tao ferry link not found"

def t_all_booking_links_have_target_blank(page):
    goto(page)
    booking_selectors = [
        "a[href*='klook.com']",
        "a[href*='tigermuaythai.com']",
        "a[href*='lomprayah.com']",
        "a[href*='anantara.com']",
    ]
    for sel in booking_selectors:
        link = page.locator(sel).first
        if link.count() > 0:
            assert link.get_attribute("target") == "_blank", f"{sel} missing target=_blank"


# ─── SECTION 8: Regression — existing tests still pass ───────────────────────

def t_page_loads_200(page):
    r = page.goto(BASE)
    assert r and r.status == 200
    page.wait_for_load_state("networkidle")

def t_header_countdown_visible(page):
    goto(page)
    assert page.locator("header, [class*='header']").count() > 0 or page.locator("main").count() > 0

def t_destinasjoner_bkk_visible(page):
    goto(page)
    assert page.get_by_text("Bangkok", exact=False).first.is_visible()

def t_destinasjoner_samui_visible(page):
    goto(page)
    assert page.get_by_text("Koh Samui", exact=False).first.is_visible()

def t_destinasjoner_phuket_visible(page):
    goto(page)
    assert page.get_by_text("Phuket", exact=False).first.is_visible()

def t_svg_kart_rendered(page):
    goto(page)
    svg = page.locator("svg[aria-label*='kart'], svg[aria-label*='Kart'], svg[aria-label*='interaktiv']")
    assert svg.count() > 0

def t_budget_total_visible(page):
    goto_tab(page, "budsjett")
    assert page.get_by_text("20 632", exact=False).count() > 0

def t_sjekkliste_present(page):
    goto_tab(page, "sjekkliste")
    assert page.get_by_text("Sjekkliste", exact=True).count() > 0

def t_reiseplan_present(page):
    goto(page)
    assert page.get_by_text("Reiseplan", exact=True).count() > 0

def t_no_console_errors(page):
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    goto(page)
    page.wait_for_timeout(1500)
    assert len(errors) == 0, f"Console errors: {errors}"

def t_iata_bgo_present(page):
    goto(page)
    assert page.get_by_text("BGO", exact=True).count() > 0

def t_iata_bkk_present(page):
    goto(page)
    assert page.get_by_text("BKK", exact=True).count() > 0

def t_tidslinje_avreise_visible(page):
    goto(page)
    assert page.get_by_text("Avreise fra Bergen", exact=False).count() > 0

def t_tidslinje_hjemreise_visible(page):
    goto(page)
    assert page.get_by_text("Hjemreise til Bergen", exact=False).count() > 0

def t_kart_interactive_bkk_click(page):
    goto(page)
    bkk = page.locator("g[role='button'][aria-label*='Bangkok']")
    assert bkk.count() > 0
    bkk.first.click()
    page.wait_for_selector("text=Suvarnabhumi Airport", timeout=3000)

def t_kart_close_button_works(page):
    goto(page)
    bkk = page.locator("g[role='button'][aria-label*='Bangkok']")
    bkk.first.click()
    page.wait_for_selector("text=Suvarnabhumi Airport", timeout=3000)
    page.locator("button[aria-label='Lukk']").first.click()
    page.wait_for_timeout(400)
    assert page.get_by_text("Suvarnabhumi Airport").count() == 0

def t_saily_esim_in_checklist(page):
    goto_tab(page, "sjekkliste")
    assert page.get_by_text("Saily", exact=False).count() > 0, "Saily eSIM not found in checklist"

def t_gopro_not_in_checklist(page):
    goto_tab(page, "sjekkliste")
    assert page.get_by_text("GoPro", exact=False).count() == 0, "GoPro should have been removed"

def t_benihana_event_visible(page):
    goto(page)
    assert page.get_by_text("Benihana", exact=False).count() > 0

def t_koh_tao_dagstur_visible(page):
    goto(page)
    assert page.get_by_text("Koh Tao", exact=False).count() > 0


# ─── SECTION 9: Link count sanity ────────────────────────────────────────────

def t_minimum_external_links(page):
    goto(page)
    ext = page.locator("a[target='_blank']")
    assert ext.count() >= 8, f"Expected >= 8 external links, got {ext.count()}"

def t_minimum_agoda_hotel_links(page):
    goto(page)
    agoda = page.locator("a[href*='agoda.com'][href*='-th.html']")
    assert agoda.count() >= 4, f"Expected >= 4 Agoda hotel links"

def t_hotel_link_count_bkk(page):
    goto(page)
    # Bangkok hotel appears in multiple places: DestinasjonKort + Tidslinje + KartSeksjon popup
    links = page.locator("a[href*='hope-land-hotel-sukhumvit-8']")
    assert links.count() >= 2, f"Expected >= 2 Hope Land links, got {links.count()}"

def t_hotel_link_count_mandarin(page):
    goto(page)
    links = page.locator("a[href*='mandarin-hotel-managed-by-centre-point']")
    assert links.count() >= 2, f"Expected >= 2 Mandarin links, got {links.count()}"


# ─── SECTION 10: Title + Lounger + WCAG ──────────────────────────────────────

def t_title_thailand_2026(page):
    goto(page)
    h1 = page.locator("h1")
    assert h1.count() > 0
    assert "Thailand 2026" in h1.first.inner_text(), f"H1 is '{h1.first.inner_text()}'"

def t_no_min_ferie(page):
    goto(page)
    assert page.get_by_text("Min Ferie", exact=False).count() == 0, "'Min Ferie' should be gone"

def t_document_title_updated(page):
    goto(page)
    title = page.title()
    assert "Thailand 2026" in title and "Min Ferie" not in title, f"Tab title: '{title}'"

def t_lounger_section_present(page):
    goto_tab(page, "lounger")
    assert page.get_by_text("Lounger på flyplassene", exact=False).count() > 0

def t_lounger_loungekey(page):
    goto_tab(page, "lounger")
    assert page.get_by_text("LoungeKey", exact=False).count() > 0

def t_lounger_mastercard(page):
    goto_tab(page, "lounger")
    assert page.get_by_text("Mastercard", exact=False).count() > 0

def t_lounger_lounge_links(page):
    goto_tab(page, "lounger")
    links = page.locator("a[href*='prioritypass.com']")
    assert links.count() >= 4, f"Expected >= 4 lounge links, got {links.count()}"

def t_lounger_cph_eventyr(page):
    goto_tab(page, "lounger")
    assert page.get_by_text("Eventyr", exact=False).count() > 0

def t_lounger_bkk_miracle(page):
    goto_tab(page, "lounger")
    assert page.get_by_text("Miracle", exact=False).count() > 0

def t_lounger_links_secure(page):
    goto_tab(page, "lounger")
    links = page.locator("a[href*='prioritypass.com']")
    count = links.count()
    assert count > 0
    for i in range(count):
        link = links.nth(i)
        assert link.get_attribute("target") == "_blank", f"Lounge link {i} missing target=_blank"
        assert "noopener" in (link.get_attribute("rel") or ""), f"Lounge link {i} missing noopener"


# ─── SECTION 11: Tabs + lounge-anbefalinger ──────────────────────────────────

def t_tabs_present(page):
    goto(page)
    tabs = page.locator("[role='tab']")
    assert tabs.count() == 4, f"Expected 4 tabs, got {tabs.count()}"

def t_tab_forside_default(page):
    goto(page)
    forside = page.locator("#tab-forside")
    assert forside.get_attribute("aria-selected") == "true", "Forside should be the default tab"

def t_tab_forside_shows_destinasjoner(page):
    goto(page)
    # Default tab shows destinations
    assert page.get_by_text("Bangkok", exact=False).count() > 0

def t_tab_lounger_switch(page):
    goto_tab(page, "lounger")
    lounger = page.locator("#tab-lounger")
    assert lounger.get_attribute("aria-selected") == "true"
    assert page.get_by_text("Lounger på flyplassene", exact=False).count() > 0

def t_tab_budsjett_switch(page):
    goto_tab(page, "budsjett")
    budsjett = page.locator("#tab-budsjett")
    assert budsjett.get_attribute("aria-selected") == "true"

def t_tab_sjekkliste_switch(page):
    goto_tab(page, "sjekkliste")
    sjekk = page.locator("#tab-sjekkliste")
    assert sjekk.get_attribute("aria-selected") == "true"

def t_tab_lounger_hidden_on_forside(page):
    goto(page)
    # Lounger content should NOT be visible on the default forside tab
    assert page.get_by_text("Lounger på flyplassene", exact=False).count() == 0

def t_bgo_not_in_lounger(page):
    goto_tab(page, "lounger")
    # BGO lounge card was removed; the lounger tab should not list Bergen airport
    assert page.get_by_text("Bergen Flesland", exact=False).count() == 0

def t_lounger_recommended_badge(page):
    goto_tab(page, "lounger")
    # "Vårt valg" badge marks the recommended lounge per airport (3 airports)
    assert page.get_by_text("Vårt valg", exact=False).count() >= 3, \
        f"Expected >= 3 'Vårt valg' badges, got {page.get_by_text('Vårt valg', exact=False).count()}"

def t_lounger_ams_crown(page):
    goto_tab(page, "lounger")
    assert page.get_by_text("KLM Crown Lounge 52", exact=False).count() > 0

def t_lounger_bkk_coral(page):
    goto_tab(page, "lounger")
    assert page.get_by_text("Coral Finest", exact=False).count() > 0

def t_lounger_rasjonale_present(page):
    goto_tab(page, "lounger")
    # Each recommendation includes a Norwegian rationale
    assert page.get_by_text("CPHs beste lounge", exact=False).count() > 0
    assert page.get_by_text("World Business Class", exact=False).count() > 0


# ─── SECTION 12: Reisefase / oppslagstavle ───────────────────────────────────

def t_nakort_for_avreise(page):
    goto(page)
    # Nå-kortet øverst på forsiden viser nedtelling før reisen
    assert page.get_by_text("til avreise", exact=False).count() > 0

def t_kontant_oppgave_superrich(page):
    goto_tab(page, "sjekkliste")
    assert page.get_by_text("Unngå Forex", exact=False).count() > 0, "Kontant-anbefaling mangler"
    lenke = page.locator("a[href*='superrichthailand.com']")
    assert lenke.count() > 0, "SuperRich-lenke mangler"
    assert lenke.first.get_attribute("target") == "_blank"
    assert "noopener" in (lenke.first.get_attribute("rel") or "")

def t_simulator_skjult_default(page):
    goto(page)
    assert page.get_by_text("Simuler dato", exact=False).count() == 0, "Simulator skal være skjult uten ?sim"

def t_simulator_synlig_med_sim(page):
    page.goto(f"{BASE}?sim=1")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(300)
    assert page.get_by_text("Simuler dato", exact=False).count() > 0, "Simulator skal vises med ?sim=1"

def t_header_dag_under_reisen(page):
    goto_dato(page, "2026-08-18")
    assert page.get_by_text("Dag 8 av 22", exact=False).count() > 0

def t_nakort_akkurat_na(page):
    goto_dato(page, "2026-08-18")
    assert page.get_by_text("Akkurat nå", exact=False).count() > 0

def t_tidslinje_na_merke(page):
    goto_dato(page, "2026-08-18")
    assert page.get_by_text("Nå", exact=True).count() >= 1, "Tidslinjen mangler 'Nå'-markering"

def t_lounger_neste_stopp(page):
    goto_dato_tab(page, "2026-08-18", "lounger")
    assert page.get_by_text("Neste stopp", exact=False).count() >= 1

def t_etter_reisen_budsjett_default(page):
    goto_dato(page, "2026-09-03")
    budsjett = page.locator("#tab-budsjett")
    assert budsjett.get_attribute("aria-selected") == "true", "Budsjett skal være standardfane etter reisen"

def t_etter_reisen_vel_hjemme(page):
    goto_dato(page, "2026-09-03")
    assert page.get_by_text("Vel hjemme", exact=False).count() > 0



# ─── Test registry ────────────────────────────────────────────────────────────

ALL_TESTS = [
    # Section 1: Page loads (3)
    ("S1.1 — Sidelasting HTTP 200", t_page_loads, "Sidelasting"),
    ("S1.2 — Ingen JS-feil", t_no_js_errors, "Sidelasting"),
    ("S1.3 — Sidetittel finnes", t_title_present, "Sidelasting"),

    # Section 2: DestinasjonKort hotel links (17)
    ("S2.01 — Bangkok I hotelllenke finnes", t_dest_bkk_link_exists, "DestinasjonKort"),
    ("S2.02 — Bangkok I lenketekst inneholder Hope Land", t_dest_bkk_link_text, "DestinasjonKort"),
    ("S2.03 — Bangkok I lenke åpner i ny fane", t_dest_bkk_link_target, "DestinasjonKort"),
    ("S2.04 — Bangkok I lenke har rel=noopener", t_dest_bkk_link_rel, "DestinasjonKort"),
    ("S2.05 — Koh Samui hotelllenke finnes", t_dest_samui_link_exists, "DestinasjonKort"),
    ("S2.06 — Koh Samui lenketekst inneholder Lamai", t_dest_samui_link_text, "DestinasjonKort"),
    ("S2.07 — Koh Samui lenke åpner i ny fane", t_dest_samui_link_target, "DestinasjonKort"),
    ("S2.08 — Koh Samui lenke har rel=noopener", t_dest_samui_link_rel, "DestinasjonKort"),
    ("S2.09 — Phuket hotelllenke finnes", t_dest_phuket_link_exists, "DestinasjonKort"),
    ("S2.10 — Phuket lenketekst inneholder Chanalai", t_dest_phuket_link_text, "DestinasjonKort"),
    ("S2.11 — Phuket lenke åpner i ny fane", t_dest_phuket_link_target, "DestinasjonKort"),
    ("S2.12 — Phuket lenke har rel=noopener", t_dest_phuket_link_rel, "DestinasjonKort"),
    ("S2.13 — Bangkok II hotelllenke finnes", t_dest_bkk2_link_exists, "DestinasjonKort"),
    ("S2.14 — Bangkok II lenketekst ikke tom", t_dest_bkk2_link_text, "DestinasjonKort"),
    ("S2.15 — Bangkok II lenke åpner i ny fane", t_dest_bkk2_link_target, "DestinasjonKort"),
    ("S2.16 — Bangkok II lenke har rel=noopener", t_dest_bkk2_link_rel, "DestinasjonKort"),
    ("S2.17 — Minimum 4 Agoda hotelllenker på siden", t_dest_all_hotel_links_count, "DestinasjonKort"),
    ("S2.18 — Overnatting-etiketter synlige (>=3)", t_dest_overnatting_label_present, "DestinasjonKort"),

    # Section 3: Tidslinje hotel links (13)
    ("S3.01 — Tidslinje Bangkok I hotelllenke", t_tidslinje_bkk1_hotell_link, "Tidslinje"),
    ("S3.02 — Tidslinje Samui hotelllenke", t_tidslinje_samui_hotell_link, "Tidslinje"),
    ("S3.03 — Tidslinje Phuket hotelllenke", t_tidslinje_phuket_hotell_link, "Tidslinje"),
    ("S3.04 — Tidslinje Bangkok II hotelllenke", t_tidslinje_bkk2_hotell_link, "Tidslinje"),
    ("S3.05 — Minimum 3 Hotell-lenker i Tidslinje", t_tidslinje_hotell_icon_present, "Tidslinje"),
    ("S3.06 — Alle Hotell-lenker har target=_blank", t_tidslinje_all_hotell_links_have_target, "Tidslinje"),
    ("S3.07 — Alle Hotell-lenker har rel=noopener", t_tidslinje_all_hotell_links_have_rel, "Tidslinje"),
    ("S3.08 — Bangkok I href korrekt (Agoda + hope-land)", t_tidslinje_bkk1_hotell_href_correct, "Tidslinje"),
    ("S3.09 — Samui href korrekt (Agoda)", t_tidslinje_samui_hotell_href_correct, "Tidslinje"),
    ("S3.10 — Phuket href korrekt (Agoda)", t_tidslinje_phuket_hotell_href_correct, "Tidslinje"),
    ("S3.11 — Bangkok II href korrekt (Agoda + mandarin)", t_tidslinje_bkk2_hotell_href_correct, "Tidslinje"),
    ("S3.12 — Ingen tomme href-attributter", t_tidslinje_no_empty_hrefs, "Tidslinje"),

    # Section 4: KartSeksjon popup hotel links (16)
    ("S4.01 — Kart BKK popup åpner", t_kart_popup_bkk_opens, "KartSeksjon"),
    ("S4.02 — Kart BKK popup: Hope Land lenke finnes", t_kart_popup_bkk_hotel_link_exists, "KartSeksjon"),
    ("S4.03 — Kart BKK popup: Hope Land lenketekst", t_kart_popup_bkk_hotel_link_text, "KartSeksjon"),
    ("S4.04 — Kart BKK popup: Hope Land target=_blank", t_kart_popup_bkk_hotel_link_target, "KartSeksjon"),
    ("S4.05 — Kart BKK popup: Mandarin (2. opphold) lenke", t_kart_popup_bkk_mandarin_link_exists, "KartSeksjon"),
    ("S4.06 — Kart BKK popup: Mandarin target=_blank", t_kart_popup_bkk_mandarin_link_target, "KartSeksjon"),
    ("S4.07 — Kart BKK popup: Lukk-knapp fungerer", t_kart_popup_bkk_close, "KartSeksjon"),
    ("S4.08 — Kart Samui popup åpner", t_kart_popup_samui_opens, "KartSeksjon"),
    ("S4.09 — Kart Samui popup: Lamai lenke finnes", t_kart_popup_samui_hotel_link_exists, "KartSeksjon"),
    ("S4.10 — Kart Samui popup: Lamai target=_blank", t_kart_popup_samui_hotel_link_target, "KartSeksjon"),
    ("S4.11 — Kart Samui popup: Lamai rel=noopener", t_kart_popup_samui_hotel_link_rel, "KartSeksjon"),
    ("S4.12 — Kart Phuket popup åpner", t_kart_popup_phuket_opens, "KartSeksjon"),
    ("S4.13 — Kart Phuket popup: Chanalai lenke finnes", t_kart_popup_phuket_hotel_link_exists, "KartSeksjon"),
    ("S4.14 — Kart Phuket popup: Chanalai target=_blank", t_kart_popup_phuket_hotel_link_target, "KartSeksjon"),
    ("S4.15 — Kart Phuket popup: Chanalai rel=noopener", t_kart_popup_phuket_hotel_link_rel, "KartSeksjon"),
    ("S4.16 — Kart Phuket popup: Chanalai href inneholder agoda.com", t_kart_popup_phuket_link_href_contains_agoda, "KartSeksjon"),

    # Section 5: Security (5)
    ("S5.01 — Alle external lenker har rel=noopener", t_all_external_links_have_rel, "Sikkerhet"),
    ("S5.02 — Minimum 3 unike Agoda hotell-URL-er", t_all_hotel_agoda_links_unique, "Sikkerhet"),
    ("S5.03 — Ingen javascript:void href", t_no_broken_anchor_tags, "Sikkerhet"),
    ("S5.04 — Alle hotelllenker synlige på desktop", t_all_hotel_links_visible_on_desktop, "Sikkerhet"),
    ("S5.05 — Hotelllenker tilgjengelig på mobil (390px)", t_hotel_links_on_mobile, "Sikkerhet"),

    # Section 6: Link href correctness (9)
    ("S6.01 — Hope Land href finnes et sted på siden", t_href_hope_land_present, "Href-validering"),
    ("S6.02 — Lamai href finnes et sted på siden", t_href_lamai_present, "Href-validering"),
    ("S6.03 — Chanalai href finnes et sted på siden", t_href_chanalai_present, "Href-validering"),
    ("S6.04 — Mandarin href finnes et sted på siden", t_href_mandarin_present, "Href-validering"),
    ("S6.05 — Ingen centrepoint.com lenker (var 404)", t_no_centrepoint_com_links, "Href-validering"),
    ("S6.06 — Ingen chanalai.com lenker (var 403)", t_no_chanalai_direct_links, "Href-validering"),
    ("S6.07 — Ingen lamaicoconutbeachresort.com lenker (var 401)", t_no_lamaicoconutbeachresort_direct_links, "Href-validering"),
    ("S6.08 — Alle Agoda-lenker bruker HTTPS", t_all_agoda_links_use_https, "Href-validering"),
    ("S6.09 — Alle Agoda hotelllenker peker til Thailand (-th.html)", t_all_agoda_links_point_to_thailand, "Href-validering"),

    # Section 7: Other external links (6)
    ("S7.01 — Benihana/Anantara lenke finnes", t_benihana_link_exists, "Andre lenker"),
    ("S7.02 — Benihana lenke åpner i ny fane", t_benihana_link_target, "Andre lenker"),
    ("S7.03 — Klook Muay Thai lenke finnes", t_klook_muaythai_link_exists, "Andre lenker"),
    ("S7.04 — Tiger Muay Thai lenke finnes", t_tiger_muaythai_link_exists, "Andre lenker"),
    ("S7.05 — Lomprayah (Koh Tao) lenke finnes", t_lomprayah_link_exists, "Andre lenker"),
    ("S7.06 — Alle booking-lenker har target=_blank", t_all_booking_links_have_target_blank, "Andre lenker"),

    # Section 8: Regression (21)
    ("S8.01 — HTTP 200", t_page_loads_200, "Regresjon"),
    ("S8.02 — Header synlig", t_header_countdown_visible, "Regresjon"),
    ("S8.03 — Bangkok i Destinasjoner", t_destinasjoner_bkk_visible, "Regresjon"),
    ("S8.04 — Koh Samui i Destinasjoner", t_destinasjoner_samui_visible, "Regresjon"),
    ("S8.05 — Phuket i Destinasjoner", t_destinasjoner_phuket_visible, "Regresjon"),
    ("S8.06 — SVG-rutekart rendret", t_svg_kart_rendered, "Regresjon"),
    ("S8.07 — Budsjett totalsum 20 632", t_budget_total_visible, "Regresjon"),
    ("S8.08 — Sjekkliste-seksjon finnes", t_sjekkliste_present, "Regresjon"),
    ("S8.09 — Reiseplan-seksjon finnes", t_reiseplan_present, "Regresjon"),
    ("S8.10 — Ingen JS-feil i konsoll", t_no_console_errors, "Regresjon"),
    ("S8.11 — IATA BGO synlig", t_iata_bgo_present, "Regresjon"),
    ("S8.12 — IATA BKK synlig", t_iata_bkk_present, "Regresjon"),
    ("S8.13 — Avreise fra Bergen synlig", t_tidslinje_avreise_visible, "Regresjon"),
    ("S8.14 — Hjemreise til Bergen synlig", t_tidslinje_hjemreise_visible, "Regresjon"),
    ("S8.15 — Kart BKK-klikk åpner popup", t_kart_interactive_bkk_click, "Regresjon"),
    ("S8.16 — Kart lukk-knapp fungerer", t_kart_close_button_works, "Regresjon"),
    ("S8.17 — Saily eSIM i sjekklisten", t_saily_esim_in_checklist, "Regresjon"),
    ("S8.18 — GoPro fjernet fra sjekklisten", t_gopro_not_in_checklist, "Regresjon"),
    ("S8.19 — Benihana-arrangement synlig", t_benihana_event_visible, "Regresjon"),
    ("S8.20 — Koh Tao dagstur synlig", t_koh_tao_dagstur_visible, "Regresjon"),

    # Section 9: Link count sanity (4)
    ("S9.01 — Minimum 8 external lenker totalt", t_minimum_external_links, "Lenketelling"),
    ("S9.02 — Minimum 4 Agoda hotellsider", t_minimum_agoda_hotel_links, "Lenketelling"),
    ("S9.03 — Bangkok I: >= 2 Hope Land lenker", t_hotel_link_count_bkk, "Lenketelling"),
    ("S9.04 — Bangkok II: >= 2 Mandarin lenker", t_hotel_link_count_mandarin, "Lenketelling"),

    # Section 10: Tittel + Lounger + WCAG (10)
    ("S10.01 — Tittel er Thailand 2026", t_title_thailand_2026, "Tittel & Lounger"),
    ("S10.02 — 'Min Ferie' er fjernet", t_no_min_ferie, "Tittel & Lounger"),
    ("S10.03 — Sidetittel (tab) oppdatert", t_document_title_updated, "Tittel & Lounger"),
    ("S10.04 — Lounge-seksjon finnes", t_lounger_section_present, "Tittel & Lounger"),
    ("S10.05 — LoungeKey nevnt", t_lounger_loungekey, "Tittel & Lounger"),
    ("S10.06 — Mastercard nevnt", t_lounger_mastercard, "Tittel & Lounger"),
    ("S10.07 — Priority Pass lounge-lenker finnes", t_lounger_lounge_links, "Tittel & Lounger"),
    ("S10.08 — CPH Eventyr Lounge synlig", t_lounger_cph_eventyr, "Tittel & Lounger"),
    ("S10.09 — BKK Miracle Lounge synlig", t_lounger_bkk_miracle, "Tittel & Lounger"),
    ("S10.10 — Lounge-lenker har target=_blank + noopener", t_lounger_links_secure, "Tittel & Lounger"),

    # Section 11: Tabs + lounge-anbefalinger (12)
    ("S11.01 — 4 faner finnes", t_tabs_present, "Tabs & anbefalinger"),
    ("S11.02 — Forside er standardfane", t_tab_forside_default, "Tabs & anbefalinger"),
    ("S11.03 — Forside viser destinasjoner", t_tab_forside_shows_destinasjoner, "Tabs & anbefalinger"),
    ("S11.04 — Bytt til Lounger-fane", t_tab_lounger_switch, "Tabs & anbefalinger"),
    ("S11.05 — Bytt til Budsjett-fane", t_tab_budsjett_switch, "Tabs & anbefalinger"),
    ("S11.06 — Bytt til Sjekkliste-fane", t_tab_sjekkliste_switch, "Tabs & anbefalinger"),
    ("S11.07 — Lounger skjult på forside", t_tab_lounger_hidden_on_forside, "Tabs & anbefalinger"),
    ("S11.08 — BGO fjernet fra Lounger", t_bgo_not_in_lounger, "Tabs & anbefalinger"),
    ("S11.09 — 'Vårt valg'-merke på anbefalte lounger", t_lounger_recommended_badge, "Tabs & anbefalinger"),
    ("S11.10 — AMS KLM Crown Lounge 52 anbefalt", t_lounger_ams_crown, "Tabs & anbefalinger"),
    ("S11.11 — BKK Coral Finest anbefalt", t_lounger_bkk_coral, "Tabs & anbefalinger"),
    ("S11.12 — Anbefalings-rasjonale synlig", t_lounger_rasjonale_present, "Tabs & anbefalinger"),

    # Section 12: Reisefase / oppslagstavle (10)
    ("S12.01 — Nå-kort viser nedtelling før avreise", t_nakort_for_avreise, "Reisefase"),
    ("S12.02 — Kontant-oppgave m/ SuperRich-lenke", t_kontant_oppgave_superrich, "Reisefase"),
    ("S12.03 — Dato-simulator skjult som standard", t_simulator_skjult_default, "Reisefase"),
    ("S12.04 — Dato-simulator synlig med ?sim=1", t_simulator_synlig_med_sim, "Reisefase"),
    ("S12.05 — Header viser 'Dag X av 22' under reisen", t_header_dag_under_reisen, "Reisefase"),
    ("S12.06 — Nå-kort viser 'Akkurat nå' under reisen", t_nakort_akkurat_na, "Reisefase"),
    ("S12.07 — Tidslinje markerer 'Nå'", t_tidslinje_na_merke, "Reisefase"),
    ("S12.08 — Lounger fremhever 'Neste stopp'", t_lounger_neste_stopp, "Reisefase"),
    ("S12.09 — Budsjett er standardfane etter reisen", t_etter_reisen_budsjett_default, "Reisefase"),
    ("S12.10 — Header viser 'Vel hjemme' etter reisen", t_etter_reisen_vel_hjemme, "Reisefase"),
]


# ─── Runner ───────────────────────────────────────────────────────────────────

def main():
    total = len(ALL_TESTS)
    print(f"\n{'─'*65}")
    print(f"  min-ferie — Hotelllenker E2E testsuite ({total} tester)")
    print(f"{'─'*65}\n")

    current_section = ""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()

        for label, fn, section in ALL_TESTS:
            if section != current_section:
                current_section = section
                print(f"\n  ── {section} ──")
            run(label, fn, page, section)

        browser.close()

    passed = sum(1 for r in results if r[0] == "pass")
    failed = len(results) - passed

    print(f"\n{'─'*65}")
    print(f"  Resultat: {passed}/{total} bestatt", end="")
    if failed:
        print(f"  |  {failed} feilet\n")
        print(f"  Feilede tester:")
        for r in results:
            if r[0] == "fail":
                print(f"    - [{r[1]}] {r[2]}")
                if len(r) > 3:
                    print(f"      {r[3][:100]}")
    else:
        print(" — ALT OK")
    print(f"{'─'*65}\n")

    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
