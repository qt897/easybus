/**
 * Raw shapes as returned by the upstream GitHub-hosted transit data source
 * (snake_case). Only used at the server boundary — see adapters.ts, which
 * converts these into the camelCase types the app actually consumes.
 */

export interface ExternalRouteSummary {
  id: number;
  bus_no: string;
  name: string;
}

export interface ExternalRouteListResponse {
  data: ExternalRouteSummary[];
}

export interface ExternalTicket {
  name: string;
  price: number;
  currency: string;
}

export interface ExternalRouteInfo {
  id: number;
  bus_no: string;
  name: string;
  color: string;
  type: string;
  distance_m: number;
  num_of_seats: number;
  operators: string[];
  tickets: ExternalTicket[];
  time_of_trip_minutes: { min: number; max: number };
  headway_minutes: { min: number; max: number };
  operation_time: { start: string; end: string };
  total_trip: { value: number; unit: string };
  outbound_name: string;
  outbound_description: string[];
  inbound_name: string;
  inbound_description: string[];
}

export interface ExternalRouteStop {
  stop_id: number;
  code: string;
  name: string;
  type: string;
  zone: string;
  ward: string;
  address: string;
  street: string;
  support_disability: string;
  status: string;
  lat: number;
  lng: number;
  routes: string[];
}

export interface ExternalRouteTrip {
  trip_id: number;
  start_time: string;
  end_time: string;
}

export interface ExternalRouteVariant {
  route_var_id: number;
  name: string;
  short_name: string;
  start_stop: string;
  end_stop: string;
  distance_m: number;
  running_time_minutes: number;
  outbound: boolean;
}

export interface ExternalRouteDirection {
  variant: ExternalRouteVariant;
  stops: ExternalRouteStop[];
  trips: ExternalRouteTrip[];
}

export interface ExternalRouteDetail {
  route: ExternalRouteInfo;
  direction_outbound: ExternalRouteDirection | null;
  direction_inbound: ExternalRouteDirection | null;
}
