from playwright.sync_api import sync_playwright

axe_js = open('scripts/axe.min.js', encoding='utf-8').read()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:5173/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1500)
    page.evaluate(axe_js)
    result = page.evaluate("""
        () => new Promise(resolve => {
            axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa']}},
            (err, res) => resolve(res));
        })
    """)
    browser.close()

for item in result.get('incomplete', []):
    print(f"\n=== {item['id']} ===")
    for node in item.get('nodes', [])[:10]:
        print('  HTML:', node.get('html', '').encode('ascii', 'replace').decode()[:120])
        msgs = [f.get('message','') for f in node.get('any',[])]
        print('  Msg:', '; '.join(msgs)[:150])
