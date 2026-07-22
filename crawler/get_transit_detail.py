import argparse
import json
import os
import re
import urllib.request
from datetime import datetime

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")


class TransitDetailCrawler:
    API_BASE = "https://apicms.ebms.vn/businfo"

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

    def __init__(self, route_id: int, path_data: str = None):
        self.route_id = route_id
        self.path_data = path_data

    def _get(self, path: str):
        request = urllib.request.Request(f"{self.API_BASE}{path}", headers=self.HEADERS)
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))

    def fetch_route(self):
        return self._get(f"/getroutebyid/{self.route_id}")

    def fetch_vars(self):
        return self._get(f"/getvarsbyroute/{self.route_id}")

    def fetch_timetables(self):
        return self._get(f"/gettimetablebyroute/{self.route_id}")

    def fetch_stops(self, route_var_id):
        return self._get(f"/getstopsbyvar/{self.route_id}/{route_var_id}")

    def fetch_trips(self, timetable_id):
        return self._get(f"/gettripsbytimetable/{self.route_id}/{timetable_id}")

    @staticmethod
    def _safe_int(value):
        try:
            return int(value)
        except (TypeError, ValueError):
            return value

    @staticmethod
    def _clean_text(text):
        if not text:
            return None
        return text.replace("¿", "").strip()

    @staticmethod
    def _clean_html_list(html):
        if not html:
            return []
        text = html.replace("&nbsp;", " ").replace("&nbsp", " ")
        parts = [p.strip(" - ") for p in text.split("<br/>")]
        return [p for p in parts if p]

    @staticmethod
    def _parse_range(text):
        if not text:
            return None
        numbers = re.findall(r"\d+", text)
        if len(numbers) >= 2:
            return {"min": int(numbers[0]), "max": int(numbers[1])}
        if len(numbers) == 1:
            return {"min": int(numbers[0]), "max": int(numbers[0])}
        return None

    @staticmethod
    def _parse_time_range(text):
        if not text or "-" not in text:
            return None
        start, end = text.split("-", 1)
        return {"start": start.strip(), "end": end.strip()}

    STATUS_MAP = {
        "Đang khai thác": "active",
        "Ngừng khai thác": "inactive",
        "Tạm ngừng khai thác": "suspended",
    }

    @classmethod
    def _map_status(cls, text):
        if not text:
            return None
        return cls.STATUS_MAP.get(text, text)

    @classmethod
    def _clean_path_list(cls, text):
        text = cls._clean_text(text)
        if not text:
            return []
        return [p.strip() for p in text.split(" - ") if p.strip()]

    @staticmethod
    def _parse_ticket(text):
        if ":" not in text:
            return {"name": text.strip(), "price": None, "currency": None}
        name, rest = text.split(":", 1)
        match = re.search(r"([\d.,]+)\s*(\D*)$", rest.strip())
        if not match:
            return {"name": name.strip(), "price": None, "currency": None}
        price = int(match.group(1).replace(",", "").replace(".", ""))
        currency = match.group(2).strip() or None
        return {"name": name.strip(), "price": price, "currency": currency}

    @staticmethod
    def _parse_total_trip(text):
        if not text:
            return None
        match = re.match(r"\s*(\d+)\s*(?:\[(\w+)\])?", text)
        if not match:
            return None
        value, unit = match.groups()
        return {"value": int(value), "unit": unit}

    def transform_route(self, raw):
        return {
            "id": raw["RouteId"],
            "bus_no": raw["RouteNo"],
            "name": raw["RouteName"],
            "color": raw.get("Color"),
            "type": raw.get("Type"),
            "distance_m": raw.get("Distance"),
            "num_of_seats": self._safe_int(raw.get("NumOfSeats")),
            "operators": self._clean_html_list(raw.get("Orgs")),
            "tickets": [self._parse_ticket(t) for t in self._clean_html_list(raw.get("Tickets"))],
            "time_of_trip_minutes": self._parse_range(raw.get("TimeOfTrip")),
            "headway_minutes": self._parse_range(raw.get("Headway")),
            "operation_time": self._parse_time_range(raw.get("OperationTime")),
            "total_trip": self._parse_total_trip(raw.get("TotalTrip")),
            "outbound_name": self._clean_text(raw.get("OutBoundName")),
            "outbound_description": self._clean_path_list(raw.get("OutBoundDescription")),
            "inbound_name": self._clean_text(raw.get("InBoundName")),
            "inbound_description": self._clean_path_list(raw.get("InBoundDescription")),
        }

    def transform_variant(self, raw):
        return {
            "route_var_id": raw["RouteVarId"],
            "name": raw.get("RouteVarName"),
            "short_name": raw.get("RouteVarShortName"),
            "start_stop": raw.get("StartStop"),
            "end_stop": raw.get("EndStop"),
            "distance_m": raw.get("Distance"),
            "running_time_minutes": raw.get("RunningTime"),
            "outbound": raw.get("Outbound"),
        }

    def transform_timetable(self, raw):
        return {
            "timetable_id": raw["TimeTableId"],
            "route_var_id": raw["RouteVarId"],
            "start_date": raw.get("StartDate") or None,
            "end_date": raw.get("EndDate") or None,
            "is_current": raw.get("IsCurrent"),
            "running_time_minutes": self._parse_range(raw.get("RunningTime")),
            "headway_minutes": self._parse_range(raw.get("Headway")),
            "total_trip": self._safe_int(raw.get("TotalTrip")),
            "operation_time": self._parse_time_range(raw.get("OperationTime")),
            "apply_dates": [d.strip() for d in raw.get("ApplyDates", "").split(",") if d.strip()],
        }

    def transform_stop(self, raw):
        return {
            "stop_id": raw["StopId"],
            "code": raw.get("Code"),
            "name": raw.get("Name"),
            "type": raw.get("StopType"),
            "zone": raw.get("Zone"),
            "ward": raw.get("Ward"),
            "address": raw.get("AddressNo"),
            "street": raw.get("Street"),
            "support_disability": raw.get("SupportDisability"),
            "status": self._map_status(raw.get("Status")),
            "lat": raw.get("Lat"),
            "lng": raw.get("Lng"),
            "routes": [r.strip() for r in raw.get("Routes", "").split(",") if r.strip()],
        }

    def transform_trip(self, raw):
        return {
            "trip_id": raw["TripId"],
            "start_time": raw.get("StartTime"),
            "end_time": raw.get("EndTime"),
        }

    def build_direction(self, variant_raw, timetables_raw):
        route_var_id = variant_raw["RouteVarId"]
        stops_raw = self.fetch_stops(route_var_id)
        timetable_raw = next(
            (t for t in timetables_raw if t["RouteVarId"] == route_var_id), None
        )
        trips_raw = self.fetch_trips(timetable_raw["TimeTableId"]) if timetable_raw else []

        return {
            "variant": self.transform_variant(variant_raw),
            "timetable": self.transform_timetable(timetable_raw) if timetable_raw else None,
            "stops": [self.transform_stop(s) for s in stops_raw],
            "trips": [self.transform_trip(t) for t in trips_raw],
        }

    def transform(self, route_raw, vars_raw, timetables_raw):
        outbound_var = next((v for v in vars_raw if v.get("Outbound")), None)
        inbound_var = next((v for v in vars_raw if not v.get("Outbound")), None)

        route = self.transform_route(route_raw)

        data = {"route": route}
        if outbound_var:
            data["direction_outbound"] = self.build_direction(outbound_var, timetables_raw)
        if inbound_var:
            data["direction_inbound"] = self.build_direction(inbound_var, timetables_raw)

        return {
            "meta_data": {
                "source": self.API_BASE,
                "route_id": self.route_id,
                "crawled_at": datetime.now().isoformat(timespec="seconds"),
            },
            "data": data,
        }

    def save(self, payload: dict, path_data: str) -> None:
        os.makedirs(os.path.dirname(path_data), exist_ok=True)
        with open(path_data, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

    def run(self) -> dict:
        route_raw = self.fetch_route()
        vars_raw = self.fetch_vars()
        timetables_raw = self.fetch_timetables()

        payload = self.transform(route_raw, vars_raw, timetables_raw)

        path_data = self.path_data or os.path.join(DATA_DIR, f"{payload['data']['route']['bus_no']}.json")
        self.save(payload, path_data)
        print(f"Saved route {self.route_id} detail to {path_data}")
        return payload


def main():
    parser = argparse.ArgumentParser(description="Crawl and save the detail of a bus route from the API.")
    parser.add_argument(
        "--route_id",
        type=int,
        required=True,
        help="Route ID to crawl (e.g. 3)",
    )
    parser.add_argument(
        "--path_data",
        type=str,
        default=None,
        help="Path to the output JSON file (default: <project_root>/data/{bus_no}.json)",
    )
    args = parser.parse_args()

    crawler = TransitDetailCrawler(route_id=args.route_id, path_data=args.path_data)
    crawler.run()


if __name__ == "__main__":
    main()
