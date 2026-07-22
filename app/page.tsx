import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MapContainer } from "@/components/map/map";
import { RouteMapProvider } from "@/features/routes/route-context";

export default function Home() {
  return (
    <RouteMapProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <Header />
        <div className="relative flex min-h-0 flex-1">
          <Sidebar />
          <MapContainer />
        </div>
      </div>
    </RouteMapProvider>
  );
}
