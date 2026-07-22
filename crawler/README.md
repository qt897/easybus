# easybus

Crawls HCMC bus route data from the `apicms.ebms.vn` API (source: buyttphcm.com.vn).

## Requirements

Python 3.9+, standard library only (no packages, no venv needed).

## File structure

- `get_transit_list.py` — `TransitListCrawler` class: fetches the full route list (`getallroute`), saves to JSON.
- `get_transit_detail.py` — `TransitDetailCrawler` class: fetches detail for one route by `route_id` (route info, outbound/inbound directions, stops, timetable, trips), saves to JSON.
- `main.py` — `TransitPipeline` class: runs the full pipeline (list → detail per route, multi-threaded), logs progress to `process.json`.

Each file has a `class` for the logic plus a `main()` function that calls it, with parameters passed via CLI args.

## Usage

### 1. Fetch the route list

```bash
python3 get_transit_list.py --path_data data/all_routes.json
```

Args:
- `--path_data` (default `data/all_routes.json`)

### 2. Fetch detail for one route

```bash
python3 get_transit_detail.py --route_id 3 --path_data data/route/03.json
```

Args:
- `--route_id` (required)
- `--path_data` (default `data/route/{bus_no}.json`)

### 3. Run the full pipeline (list + detail for all routes, multi-threaded)

```bash
python3 main.py --workers 8
```

Args:
- `--path_list` (default `data/all_routes.json`)
- `--path_process` (default `data/process.json`)
- `--data_dir` (default `data/route`)
- `--workers` (default `8`) — number of threads used to fetch route details concurrently

## Output data structure

### `data/all_routes.json`

```json
{
  "meta_data": { "source": "...", "crawled_at": "...", "total": 178, "updated_at": "..." },
  "data": [{ "id": 3, "bus_no": "03", "name": "Bến Thành - Thạnh Xuân", "detail_path": "data/route/03.json" }]
}
```

`detail_path` is added by `main.py` after the detail step runs for that route (missing/`null` if the route hasn't been crawled yet or the fetch failed).

### `data/route/{bus_no}.json`

```json
{
  "meta_data": { "source": "...", "route_id": 3, "crawled_at": "..." },
  "data": {
    "route": { "id", "bus_no", "name", "color", "type", "distance_m", "num_of_seats", "operators", "tickets", "time_of_trip_minutes", "headway_minutes", "operation_time", "total_trip", "outbound_name", "outbound_description", "inbound_name", "inbound_description" },
    "direction_outbound": {
      "variant": {...},
      "timetable": {...},
      "stops": [{ "stop_id", "code", "name", "type", "zone", "ward", "address", "street", "support_disability", "status", "lat", "lng", "routes" }],
      "trips": [{ "trip_id", "start_time", "end_time" }]
    },
    "direction_inbound": { "..." }
  }
}
```

### `data/process.json`

Tracks the progress of a `main.py` run:

```json
{
  "started_at": "...",
  "updated_at": "...",
  "steps": [
    { "step": 1, "name": "fetch_list", "status": "success", "total_routes": 178 },
    { "step": 2, "name": "fetch_details", "status": "success", "success": 178, "failed": 0 }
  ],
  "routes": {
    "3": { "bus_no": "03", "status": "success", "path": "data/route/03.json", "finished_at": "..." }
  },
  "activity": [{ "time": "...", "message": "..." }]
}
```
