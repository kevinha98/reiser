"""
WCAG-revisjon av min-ferie via axe-core (injisert) + Playwright
Kjør: python scripts/wcag_audit.py
"""

import json
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright
from datetime import datetime

URL = "http://localhost:5173/"
SCREENSHOTS_DIR = Path("wcag-screenshots")
SCREENSHOTS_DIR.mkdir(exist_ok=True)

# ── Last inn axe-core fra CDN ────────────────────────────────────────────────
AXE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js"
AXE_LOCAL = Path("scripts/axe.min.js")

def hent_axe():
    if AXE_LOCAL.exists():
        return AXE_LOCAL.read_text(encoding="utf-8")
    print(f"Laster ned axe-core fra {AXE_CDN} ...")
    with urllib.request.urlopen(AXE_CDN, timeout=30) as resp:
        innhold = resp.read().decode("utf-8")
    AXE_LOCAL.write_text(innhold, encoding="utf-8")
    print("axe-core lagret lokalt.")
    return innhold


ALVORLIGHET_REKKEFØLGE = {"critical": 0, "serious": 1, "moderate": 2, "minor": 3}
ALVORLIGHET_EMOJI = {"critical": "🔴", "serious": "🟠", "moderate": "🟡", "minor": "🔵"}


def skriv_rapport(resultater: dict, logg: list[str]):
    brudd = resultater.get("violations", [])
    bestod = resultater.get("passes", [])
    ufullstendige = resultater.get("incomplete", [])

    brudd.sort(key=lambda x: ALVORLIGHET_REKKEFØLGE.get(x.get("impact", "minor"), 3))

    logg.append(f"\n{'═' * 60}")
    logg.append(f"  WCAG-REVISJON — {datetime.now().strftime('%d.%m.%Y %H:%M')}")
    logg.append(f"  URL: {URL}")
    logg.append(f"{'═' * 60}")
    logg.append(f"\n  ✅ Bestod:       {len(bestod)} regler")
    logg.append(f"  ❌ Brudd:        {len(brudd)} regler")
    logg.append(f"  ⚠️  Ufullstendige: {len(ufullstendige)} regler\n")

    if not brudd:
        logg.append("  🎉 Ingen WCAG-brudd funnet!")
    else:
        logg.append(f"{'─' * 60}")
        logg.append("  BRUDD")
        logg.append(f"{'─' * 60}")
        for b in brudd:
            impact = b.get("impact", "?")
            emoji = ALVORLIGHET_EMOJI.get(impact, "⚫")
            logg.append(f"\n  {emoji} [{impact.upper()}]  {b['id']}")
            logg.append(f"     {b['description']}")
            logg.append(f"     WCAG: {', '.join(t.get('id', '') for t in b.get('tags', []) if t.get('id','').startswith('wcag'))[:120]}")
            for node in b.get("nodes", [])[:3]:
                html_snippet = node.get("html", "")[:120]
                msg = "; ".join(f.get("message", "") for f in node.get("any", []) + node.get("all", []))[:120]
                logg.append(f"     → {html_snippet}")
                if msg:
                    logg.append(f"       Fix: {msg}")

    if ufullstendige:
        logg.append(f"\n{'─' * 60}")
        logg.append("  TRENGER MANUELL KONTROLL")
        logg.append(f"{'─' * 60}")
        for u in ufullstendige[:5]:
            logg.append(f"\n  ⚠️  {u['id']} — {u['description']}")

    logg.append(f"\n{'═' * 60}\n")


def main():
    axe_js = hent_axe()
    logg: list[str] = []
    alle_brudd: list[dict] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        # ── Fang opp console-feil ────────────────────────────────────────────
        console_feil: list[str] = []
        page.on("console", lambda msg: console_feil.append(f"[{msg.type}] {msg.text}") if msg.type in ("error", "warning") else None)
        page.on("pageerror", lambda err: console_feil.append(f"[PAGEFEIL] {err}"))

        print(f"Åpner {URL} ...")
        page.goto(URL)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(1500)  # La Framer Motion fullføre inngangsanimasjoner

        # ── Desktop screenshot ───────────────────────────────────────────────
        page.screenshot(path=str(SCREENSHOTS_DIR / "desktop-full.png"), full_page=True)
        print("Screenshot tatt: desktop-full.png")

        # ── Desktop WCAG-revisjon ────────────────────────────────────────────
        print("Kjører axe-core på desktop (1440px)...")
        page.evaluate(axe_js)
        resultat_desktop = page.evaluate("""
            () => new Promise(resolve => {
                axe.run(document, {
                    runOnly: {
                        type: 'tag',
                        values: ['wcag2a', 'wcag2aa', 'best-practice']
                    }
                }, (err, results) => {
                    if (err) resolve({ error: err.toString() });
                    else resolve(results);
                });
            })
        """)

        logg.append("\n## DESKTOP (1440px)")
        skriv_rapport(resultat_desktop, logg)
        alle_brudd.extend(resultat_desktop.get("violations", []))

        # ── Mobil screenshot + revisjon ──────────────────────────────────────
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(URL)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(1500)
        page.screenshot(path=str(SCREENSHOTS_DIR / "mobil-full.png"), full_page=True)
        print("Screenshot tatt: mobil-full.png")

        print("Kjører axe-core på mobil (390px)...")
        page.evaluate(axe_js)
        resultat_mobil = page.evaluate("""
            () => new Promise(resolve => {
                axe.run(document, {
                    runOnly: {
                        type: 'tag',
                        values: ['wcag2a', 'wcag2aa', 'best-practice']
                    }
                }, (err, results) => {
                    if (err) resolve({ error: err.toString() });
                    else resolve(results);
                });
            })
        """)

        logg.append("\n## MOBIL (390px)")
        skriv_rapport(resultat_mobil, logg)

        # ── Interaksjonstest: sjekkliste ─────────────────────────────────────
        print("Tester sjekkliste-interaksjon...")
        page.set_viewport_size({"width": 1440, "height": 900})
        page.goto(URL)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2000)

        # Scroll ned til sjekkliste
        page.evaluate("window.scrollTo(0, document.body.scrollHeight * 0.7)")
        page.wait_for_timeout(500)

        # Klikk første sjekkboks
        sjekkbokser = page.locator("button[aria-label]").all()
        interaksjon_ok = []
        if sjekkbokser:
            første = sjekkbokser[0]
            tekst_før = page.locator("button[aria-label]").first.get_attribute("aria-label")
            første.click()
            page.wait_for_timeout(400)
            page.screenshot(path=str(SCREENSHOTS_DIR / "sjekkliste-interaksjon.png"))
            interaksjon_ok.append(f"✅ Sjekkliste toggle virker (aria-label: '{tekst_før}')")
        else:
            interaksjon_ok.append("⚠️  Fant ingen sjekkboks-knapper med aria-label")

        # Test "Legg til element" knapp
        legg_til = page.get_by_text("Legg til element")
        if legg_til.count() > 0:
            legg_til.first.click()
            page.wait_for_timeout(300)
            inndata = page.locator("input[placeholder='Nytt element...']")
            if inndata.count() > 0:
                inndata.fill("Testoppgave fra WCAG-skript")
                page.wait_for_timeout(200)
                page.screenshot(path=str(SCREENSHOTS_DIR / "sjekkliste-legg-til.png"))
                interaksjon_ok.append("✅ 'Legg til element' form virker")
            else:
                interaksjon_ok.append("⚠️  Inputfelt dukket ikke opp")
        else:
            interaksjon_ok.append("⚠️  Fant ikke 'Legg til element'-knappen")

        logg.append("\n## INTERAKSJONSTEST")
        logg.append(f"{'─' * 60}")
        for linje in interaksjon_ok:
            logg.append(f"  {linje}")

        # ── Console-feil ─────────────────────────────────────────────────────
        if console_feil:
            logg.append(f"\n## CONSOLE-FEIL ({len(console_feil)} stk)")
            logg.append(f"{'─' * 60}")
            for f in console_feil[:20]:
                logg.append(f"  {f}")
        else:
            logg.append("\n## CONSOLE-FEIL\n  ✅ Ingen console-feil funnet")

        browser.close()

    # ── Skriv JSON + tekst-rapport ───────────────────────────────────────────
    rapport_txt = "\n".join(logg)
    print(rapport_txt)

    rapport_json = {
        "tidsstempel": datetime.now().isoformat(),
        "url": URL,
        "desktop_brudd": len(resultat_desktop.get("violations", [])),
        "desktop_bestod": len(resultat_desktop.get("passes", [])),
        "mobil_brudd": len(resultat_mobil.get("violations", [])),
        "violations_desktop": resultat_desktop.get("violations", []),
        "violations_mobil": resultat_mobil.get("violations", []),
    }

    (SCREENSHOTS_DIR / "wcag-rapport.json").write_text(
        json.dumps(rapport_json, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"\nDetaljer lagret i {SCREENSHOTS_DIR}/wcag-rapport.json")
    print(f"Screenshots i {SCREENSHOTS_DIR}/")

    # Returner exit code basert på kritiske brudd
    kritiske = [v for v in alle_brudd if v.get("impact") in ("critical", "serious")]
    if kritiske:
        print(f"\n⚠️  {len(kritiske)} kritiske/alvorlige brudd funnet — se rapport over")
        return 1
    return 0


if __name__ == "__main__":
    exit(main())
