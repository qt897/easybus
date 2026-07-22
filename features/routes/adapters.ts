import type {
  ExternalRouteDetail,
  ExternalRouteDirection,
  ExternalRouteInfo,
  ExternalRouteStop,
  ExternalRouteTrip,
  ExternalRouteVariant,
  ExternalTicket,
} from "./external-types";
import type {
  RouteDetail,
  RouteDirection,
  RouteInfo,
  RouteVariant,
  Stop,
  Ticket,
  Trip,
} from "./types";

function adaptTicket(raw: ExternalTicket): Ticket {
  return { name: raw.name, price: raw.price, currency: raw.currency };
}

export function adaptRouteInfo(raw: ExternalRouteInfo): RouteInfo {
  return {
    id: raw.id,
    busNo: raw.bus_no,
    name: raw.name,
    color: raw.color,
    type: raw.type,
    distanceM: raw.distance_m,
    numOfSeats: raw.num_of_seats,
    operators: raw.operators,
    tickets: raw.tickets.map(adaptTicket),
    timeOfTripMinutes: raw.time_of_trip_minutes,
    headwayMinutes: raw.headway_minutes,
    operationTime: raw.operation_time,
    totalTrip: raw.total_trip,
    outboundName: raw.outbound_name,
    outboundDescription: raw.outbound_description,
    inboundName: raw.inbound_name,
    inboundDescription: raw.inbound_description,
  };
}

export function adaptStop(raw: ExternalRouteStop): Stop {
  return {
    stopId: raw.stop_id,
    code: raw.code,
    name: raw.name,
    type: raw.type,
    zone: raw.zone,
    ward: raw.ward,
    address: raw.address,
    street: raw.street,
    supportDisability: raw.support_disability,
    status: raw.status,
    lat: raw.lat,
    lng: raw.lng,
    routes: raw.routes,
  };
}

function adaptTrip(raw: ExternalRouteTrip): Trip {
  return { tripId: raw.trip_id, startTime: raw.start_time, endTime: raw.end_time };
}

function adaptVariant(raw: ExternalRouteVariant): RouteVariant {
  return {
    routeVarId: raw.route_var_id,
    name: raw.name,
    shortName: raw.short_name,
    startStop: raw.start_stop,
    endStop: raw.end_stop,
    distanceM: raw.distance_m,
    runningTimeMinutes: raw.running_time_minutes,
    outbound: raw.outbound,
  };
}

function adaptDirection(raw: ExternalRouteDirection): RouteDirection {
  return {
    variant: adaptVariant(raw.variant),
    stops: raw.stops.map(adaptStop),
    trips: raw.trips.map(adaptTrip),
  };
}

export function adaptRouteDetail(raw: ExternalRouteDetail): RouteDetail {
  return {
    route: adaptRouteInfo(raw.route),
    directionOutbound: adaptDirection(raw.direction_outbound),
    directionInbound: adaptDirection(raw.direction_inbound),
  };
}
