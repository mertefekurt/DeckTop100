from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import json

URL = "https://store.steampowered.com/charts/steamdecktopplayed"


def get_class_map(page):
    """Extract Steam's runtime CSS class map from webpack modules."""
    js_code = """
    (() => {
        const chunks = window.webpackChunkstore;
        if (!chunks) return null;
        const modules = chunks.flatMap(c => (c[1] ? Object.entries(c[1]) : []));
        for (const [id, fn] of modules) {
            const e = { exports: {} };
            try {
                fn(e, e.exports, {});
                const exp = e.exports;
                if (exp && exp.ChartTable && exp.Rank && exp.Game) return exp;
            } catch (err) {}
        }
        return null;
    })();
    """
    return page.evaluate(js_code)


def parse_table(html, class_map):
    """Parse Steam Deck chart rows into serializable game dictionaries."""
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", class_=class_map["ChartTable"])
    if not table:
        print("⚠️ Tablo bulunamadı.")
        return []

    games = []
    rows = table.find_all("tr", class_=class_map["TableRow"])
    for row in rows:
        rank_cell = row.find("td", class_=class_map["RankCell"])
        capsule = row.find("td", class_=class_map["CapsuleCell"])
        name_div = row.find("div", class_=class_map["GameName"])
        price_cell = row.find("td", class_=class_map.get("PriceCell"))
        change_cell = row.find("td", class_=class_map.get("ChangeCell"))

        rank = rank_cell.text.strip() if rank_cell else "?"
        name = name_div.text.strip() if name_div else "?"
        price = price_cell.text.strip() if price_cell else "-"
        change = change_cell.text.strip() if change_cell else "-"

        link = None
        img = None
        if capsule:
            a_tag = capsule.find("a", href=True)
            if a_tag:
                link = a_tag["href"]
                img_tag = a_tag.find("img", class_=class_map.get("CapsuleArt"))
                if img_tag and img_tag.get("src"):
                    img = img_tag["src"]

        games.append({
            "rank": rank,
            "name": name,
            "price": price,
            "change": change,
            "url": link,
            "image": img
        })
    return games


def main():
    """Fetch Steam Deck chart data and write it to steamdeck_top.json."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("🔗 Steam Deck Top Played sayfası yükleniyor...")
        page.goto(URL, wait_until="networkidle")

        print("🧩 CSS class map alınıyor...")
        class_map = get_class_map(page)
        if not class_map:
            raise RuntimeError("Class map bulunamadı! (webpackChunkstore yapısı değişmiş olabilir)")

        print("✅ Class map bulundu:")
        print(json.dumps(class_map, indent=2))

        html = page.content()
        browser.close()

    print("📊 Tablo parse ediliyor...")
    data = parse_table(html, class_map)

    print(f"\n🎮 Top {len(data)} oyun:")
    for row in data[:10]:
        print(f"{row['rank']}. {row['name']}  |  {row['price']}  |  {row['change']}")

    with open("steamdeck_top.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("\n💾 Sonuç 'steamdeck_top.json' dosyasına kaydedildi.")

if __name__ == "__main__":
    main()
