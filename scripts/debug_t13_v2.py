from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()
    page.goto("http://localhost:4173")
    page.wait_for_load_state("networkidle")

    page.get_by_text("Muay Thai", exact=True).first.scroll_into_view_if_needed()
    page.wait_for_timeout(600)

    btns_roundedfull = page.locator("button.rounded-full").filter(has_text="Phuket")
    print("rounded-full Phuket buttons:", btns_roundedfull.count())

    all_phuket_btns = page.locator("button").filter(has_text="Phuket")
    print("All <button> with Phuket text:", all_phuket_btns.count())
    for i in range(min(all_phuket_btns.count(), 5)):
        b = all_phuket_btns.nth(i)
        cls = b.get_attribute("class") or ""
        print(f"  [{i}] visible={b.is_visible()} class_start={cls[:80]}")

    # try clicking
    if all_phuket_btns.count() > 0:
        all_phuket_btns.first.click()
        page.wait_for_timeout(800)
        tiger = page.get_by_text("Tiger Muay Thai").count()
        print(f"Tiger Muay Thai count after click: {tiger}")
        page.screenshot(path="scripts/debug_t13_fresh.png")

    browser.close()
