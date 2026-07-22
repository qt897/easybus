/**
 * App-facing (camelCase) types. Produced from external-types.ts shapes via
 * adapters.ts — nothing outside that file should ever see snake_case.
 */

export interface RouteSummary {
  id: number;
  busNo: string;
  name: string;
  color?: string;
  fare?: number;
  operationTime?: { start: string; end: string };
}

export interface Ticket {
  name: string;
  price: number;
  currency: string;
}

export interface RouteInfo {
  id: number;
  busNo: string;
  name: string;
  color: string;
  type: string;
  distanceM: number;
  numOfSeats: number;
  operators: string[];
  tickets: Ticket[];
  timeOfTripMinutes: { min: number; max: number };
  headwayMinutes: { min: number; max: number };
  operationTime: { start: string; end: string };
  totalTrip: { value: number; unit: string };
  outboundName: string;
  outboundDescription: string[];
  inboundName: string;
  inboundDescription: string[];
}

export interface Stop {
  stopId: number;
  code: string;
  name: string;
  type: string;
  zone: string;
  ward: string;
  address: string;
  street: string;
  supportDisability: string;
  status: string;
  lat: number;
  lng: number;
  routes: string[];
}

export interface Trip {
  tripId: number;
  startTime: string;
  endTime: string;
}

export interface RouteVariant {
  routeVarId: number;
  name: string;
  shortName: string;
  startStop: string;
  endStop: string;
  distanceM: number;
  runningTimeMinutes: number;
  outbound: boolean;
}

export interface RouteDirection {
  variant: RouteVariant;
  stops: Stop[];
  trips: Trip[];
}

export interface RouteDetail {
  route: RouteInfo;
  directionOutbound: RouteDirection;
  directionInbound: RouteDirection;
}

export type DirectionKey = "outbound" | "inbound";
