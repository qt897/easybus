import argparse
import json
import os
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

from get_transit_list import TransitListCrawler
from get_transit_detail import TransitDetailCrawler

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
DEFAULT_PATH_LIST = os.path.join(DATA_DIR, "all_routes.json")
DEFAULT_PATH_PROCESS = os.path.join(DATA_DIR, "process.json")
DEFAULT_ROUTE_DIR = os.path.join(DATA_DIR, "")


class TransitPipeline:
    def __init__(
        self,
        path_list: str = DEFAULT_PATH_LIST,
        path_process: str = DEFAULT_PATH_PROCESS,
        data_dir: str = DEFAULT_ROUTE_DIR,
        workers: int = 8,
    ):
        self.path_list = path_list
        self.path_process = path_process
        self.data_dir = data_dir
        self.workers = workers
        self.lock = threading.Lock()
        self.process = {
            "started_at": datetime.now().isoformat(timespec="seconds"),
            "updated_at": None,
            "steps": [],
            "routes": {},
            "activity": [],
        }

    def _now(self):
        return datetime.now().isoformat(timespec="seconds")

    def _log(self, message: str):
        with self.lock:
            self.process["activity"].append({"time": self._now(), "message": message})
        print(message)

    def _save_process(self):
        with self.lock:
            self.process["updated_at"] = self._now()
            os.makedirs(os.path.dirname(self.path_process), exist_ok=True)
            with open(self.path_process, "w", encoding="utf-8") as f:
                json.dump(self.process, f, ensure_ascii=False, indent=2)

    def step_fetch_list(self) -> list:
        started_at = self._now()
        self._log(f"Step 1: fetching route list -> {self.path_list}")

        crawler = TransitListCrawler(path_data=self.path_list)
        payload = crawler.run()

        self.process["steps"].append({
            "step": 1,
            "name": "fetch_list",
            "status": "success",
            "started_at": started_at,
            "finished_at": self._now(),
            "path": self.path_list,
            "total_routes": payload["meta_data"]["total"],
        })
        self._save_process()
        self._log(f"Step 1 done: {payload['meta_data']['total']} routes")
        return payload["data"]

    def _fetch_one_detail(self, route: dict):
        route_id = route["id"]
        bus_no = route["bus_no"]
        path_data = os.path.join(self.data_dir, f"{bus_no}.json")

        try:
            TransitDetailCrawler(route_id=route_id, path_data=path_data).run()
            route["detail_path"] = path_data
            with self.lock:
                self.process["routes"][str(route_id)] = {
                    "bus_no": bus_no,
                    "status": "success",
                    "path": path_data,
                    "finished_at": self._now(),
                }
            self._log(f"Route {bus_no} (id={route_id}) done -> {path_data}")
            ok = True
        except Exception as exc:
            route["detail_path"] = None
            with self.lock:
                self.process["routes"][str(route_id)] = {
                    "bus_no": bus_no,
                    "status": "failed",
                    "error": str(exc),
                    "finished_at": self._now(),
                }
            self._log(f"Route {bus_no} (id={route_id}) failed: {exc}")
            ok = False

        self._save_process()
        return ok

    def step_fetch_details(self, routes: list):
        started_at = self._now()
        self._log(f"Step 2: fetching detail for {len(routes)} routes with {self.workers} workers")

        success, failed = 0, 0
        with ThreadPoolExecutor(max_workers=self.workers) as executor:
            futures = [executor.submit(self._fetch_one_detail, route) for route in routes]
            for future in as_completed(futures):
                if future.result():
                    success += 1
                else:
                    failed += 1

        self.process["steps"].append({
            "step": 2,
            "name": "fetch_details",
            "status": "success" if failed == 0 else "partial",
            "started_at": started_at,
            "finished_at": self._now(),
            "success": success,
            "failed": failed,
        })
        self._save_process()

    def _update_list_file(self, routes: list):
        with open(self.path_list, "r", encoding="utf-8") as f:
            payload = json.load(f)

        payload["data"] = routes
        payload["meta_data"]["updated_at"] = self._now()

        with open(self.path_list, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        self._log(f"Updated {self.path_list} with detail_path per route")

    def run(self):
        routes = self.step_fetch_list()
        self.step_fetch_details(routes)
        self._update_list_file(routes)
        self._log("Pipeline finished")
        self._save_process()


def main():
    parser = argparse.ArgumentParser(description="Run the full pipeline: fetch route list then fetch detail per route.")
    parser.add_argument(
        "--path_list",
        type=str,
        default=DEFAULT_PATH_LIST,
        help="Path to the route list JSON (default: <project_root>/data/all_routes.json)",
    )
    parser.add_argument(
        "--path_process",
        type=str,
        default=DEFAULT_PATH_PROCESS,
        help="Path to the process/activity log JSON (default: <project_root>/data/process.json)",
    )
    parser.add_argument(
        "--data_dir",
        type=str,
        default=DEFAULT_ROUTE_DIR,
        help="Directory to store per-route detail JSON files (default: <project_root>/data/route)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=8,
        help="Number of worker threads to fetch route details concurrently (default: 8)",
    )
    args = parser.parse_args()

    pipeline = TransitPipeline(
        path_list=args.path_list,
        path_process=args.path_process,
        data_dir=args.data_dir,
        workers=args.workers,
    )
    pipeline.run()


if __name__ == "__main__":
    main()
