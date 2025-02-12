from flask import Flask, jsonify
from flask_cors import CORS
import urllib.request
from bs4 import BeautifulSoup
import ssl

app = Flask(__name__)
CORS(app)

# Ars Technica URLs
ARS_TECHNICA_URLS = {
    "AI": "https://arstechnica.com/ai/",
    "IT": "https://arstechnica.com/information-technology/",
    "Cars": "https://arstechnica.com/cars/",
    "Culture": "https://arstechnica.com/culture/",
    "Gaming": "https://arstechnica.com/gaming/",
    "Health": "https://arstechnica.com/health/",
    "Policy": "https://arstechnica.com/tech-policy/",
    "Science": "https://arstechnica.com/science/",
    "Security": "https://arstechnica.com/security/",
    "Business": "https://arstechnica.com/business/",
    "Space": "https://arstechnica.com/science/space/",
    "Gadgets": "https://arstechnica.com/gadgets/"
}

# Set user-agent to bypass bot protection
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def scrape_ars_technica(url):
    """Scrape news articles from an Ars Technica category page."""
    try:
        # Create SSL context that ignores certificate verification
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        # Create request with headers
        req = urllib.request.Request(url, headers=HEADERS)
        
        # Make request with SSL context
        response = urllib.request.urlopen(req, context=context)
        
        if response.status != 200:
            print(f"⚠️ Failed to fetch: {url} (Status: {response.status})")
            return []

        soup = BeautifulSoup(response.read().decode('utf-8'), "html.parser")
        articles = []

        for article in soup.find_all("article"):
            title_tag = article.find("a")
            summary_tag = article.find("p")
            image_tag = article.find("img")

            if title_tag:
                title = title_tag.text.strip()
                link = title_tag.get("href", "#")
                summary = summary_tag.text.strip() if summary_tag else "No Summary"
                image = image_tag.get("src", "https://via.placeholder.com/300") if image_tag else "https://via.placeholder.com/300"

                articles.append({
                    "title": title,
                    "summary": summary,
                    "image": image,
                    "url": link
                })

        return articles[:5]  # Get only the latest 5 articles

    except Exception as e:
        print(f"❌ Error scraping {url}: {e}")
        return []

@app.route("/news/all", methods=["GET"])
def get_all_news():
    """Fetch news from multiple Ars Technica sections."""
    all_news = {}

    for category, url in ARS_TECHNICA_URLS.items():
        articles = scrape_ars_technica(url)
        if articles:
            all_news[category] = articles
        else:
            all_news[category] = [{"error": "No news available"}]

    return jsonify(all_news)

if __name__ == "__main__":
    app.run(debug=True)