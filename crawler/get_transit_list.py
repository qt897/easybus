import argparse
import json
import os
import urllib.request
from datetime import datetime

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_PATH_DATA = os.path.join(PROJECT_ROOT, "data", "all_routes.json")


class TransitListCrawler:
    API_URL = "https://apicms.ebms.vn/businfo/getallroute"

    HEADERS = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,vi;q=0.8",
        "origin": "https://buyttphcm.com.vn",
        "referer": "https://buyttphcm.com.vn/",
        "user-agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
        ),
    }

    def __init__(self, path_data: str = DEFAULT_PATH_DATA):
        self.path_data = path_data

    def fetch(self) -> list:
        request = urllib.request.Request(self.API_URL, headers=self.HEADERS)
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))

    def transform(self, raw_routes: list) -> dict:
        routes = [
            {
                "id": route.get("RouteId"),
                "bus_no": route.get("RouteNo"),
                "name": route.get("RouteName"),
            }
            for route in raw_routes
        ]

        return {
            "meta_data": {
                "source": self.API_URL,
                "crawled_at": datetime.now().isoformat(timespec="seconds"),
                "total": len(routes),
            },
            "data": routes,
        }

    def save(self, payload: dict) -> None:
        os.makedirs(os.path.dirname(self.path_data), exist_ok=True)
        with open(self.path_data, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

    def run(self) -> dict:
        raw_routes = self.fetch()
        payload = self.transform(raw_routes)
        self.save(payload)
        print(f"Saved {payload['meta_data']['total']} routes to {self.path_data}")
        return payload


def main():
    parser = argparse.ArgumentParser(description="Crawl and save the list of bus routes from the API.")
    parser.add_argument(
        "--path_data",
        type=str,
        default=DEFAULT_PATH_DATA,
        help="Path to the output JSON file (default: <project_root>/data/all_routes.json)",
    )
    args = parser.parse_args()

    crawler = TransitListCrawler(path_data=args.path_data)
    crawler.run()


if __name__ == "__main__":
    main()
