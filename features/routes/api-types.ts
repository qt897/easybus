export interface RouteSummary {
  id: number;
  bus_no: string;
  name: string;
  color?: string;
  fare?: number;
  operation_time?: { start: string; end: string };
}

export interface RouteListResponse {
  data: RouteSummary[];
}

export interface Ticket {
  name: string;
  price: number;
  currency: string;
}

export interface RouteInfo {
  id: number;
  bus_no: string;
  name: string;
  color: string;
  type: string;
  distance_m: number;
  num_of_seats: number;
  operators: string[];
  tickets: Ticket[];
  time_of_trip_minutes: { min: number; max: number };
  headway_minutes: { min: number; max: number };
  operation_time: { start: string; end: string };
  total_trip: { value: number; unit: string };
  outbound_name: string;
  outbound_description: string[];
  inbound_name: string;
  inbound_description: string[];
}

export interface RouteStop {
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

export interface RouteTrip {
  trip_id: number;
  start_time: string;
  end_time: string;
}

export interface RouteVariant {
  route_var_id: number;
  name: string;
  short_name: string;
  start_stop: string;
  end_stop: string;
  distance_m: number;
  running_time_minutes: number;
  outbound: boolean;
}

export interface RouteDirection {
  variant: RouteVariant;
  stops: RouteStop[];
  trips: RouteTrip[];
}

export interface RouteDetail {
  route: RouteInfo;
  direction_outbound: RouteDirection;
  direction_inbound: RouteDirection;
}

export type DirectionKey = "outbound" | "inbound";
