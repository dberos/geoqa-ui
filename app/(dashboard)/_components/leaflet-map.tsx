import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, Popup, Polygon, Polyline, useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import { parse } from "wellknown";
import type { Geometry, Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import bbox from "@turf/bbox";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Adjust the map view to fit the provided bounds
const FitBounds = ({ bounds }: { bounds: [[number, number], [number, number]] }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) map.fitBounds(bounds, { padding: [40, 40] });
    }, [bounds, map]);
    return null;
};

// Render a geometry feature as a Leaflet component
const renderGeometry = (
    feature: Feature<Geometry, GeoJsonProperties>, 
    index: string | number
): React.ReactNode => {
    const { geometry, properties } = feature;
    if (!geometry) return null;

    switch (geometry.type) {
        case "Point": {
            const [lng, lat] = (geometry.coordinates as [number, number]);
            return (
                <Marker key={index} position={[lat, lng]}>
                    <Popup>{properties?.wkt}</Popup>
                </Marker>
            );
        }
        case "LineString": {
            const latlngs = (geometry.coordinates as [number, number][]).map(([lng, lat]) => [lat, lng] as LatLngTuple);
            return <Polyline key={index} positions={latlngs} />;
        }
        case "Polygon": {
            const latlngs = (geometry.coordinates as [number, number][][]).map(ring =>
                ring.map(([lng, lat]) => [lat, lng] as LatLngTuple)
            );
            return <Polygon key={index} positions={latlngs} />;
        }
        case "MultiPoint": {
            return (geometry.coordinates as [number, number][]).map(([lng, lat], i) => (
                <Marker key={`${index}-mp-${i}`} position={[lat, lng]}>
                    <Popup>{properties?.wkt}</Popup>
                </Marker>
            ));
        }
        case "MultiLineString": {
            return (geometry.coordinates as [number, number][][]).map((line, i) => {
                const latlngs = line.map(([lng, lat]) => [lat, lng] as LatLngTuple);
                return <Polyline key={`${index}-mls-${i}`} positions={latlngs} />;
            });
        }
        case "MultiPolygon": {
            return (geometry.coordinates as [number, number][][][]).map((polygon, i) => {
                const latlngs = polygon.map(ring =>
                    ring.map(([lng, lat]) => [lat, lng] as LatLngTuple)
                );
                return <Polygon key={`${index}-mpoly-${i}`} positions={latlngs} />;
            });
        }
        case "GeometryCollection": {
            return geometry.geometries.map((geom, i) =>
                renderGeometry(
                    {
                        type: "Feature",
                        geometry: geom,
                        properties,
                    } as Feature<Geometry, GeoJsonProperties>,
                    `${index}-gc-${i}`
                )
            );
        }
        default:
            return null;
    }
};

const LeafletMap = ({ wktValues }: { wktValues: string[] | null }) => {
    // Memoize the conversion of WKT strings to GeoJSON Feature objects.
    const features = useMemo(() => (
        wktValues?.map(wkt => {
            const geometry = parse(wkt);
            return geometry
                ? { type: "Feature", geometry, properties: { wkt } } as Feature<Geometry, GeoJsonProperties>
                : null;
        }).filter(Boolean) as Feature<Geometry, GeoJsonProperties>[]
    ), [wktValues]);

    // Always call useMemo, even if features is empty
    const bounds = useMemo(() => {
        if (!features.length) return null;
        const featureCollection: FeatureCollection<Geometry, GeoJsonProperties> = {
            type: "FeatureCollection",
            features,
        };
        // Convert to Leaflet LatLngBounds format: [[minLat, minLng], [maxLat, maxLng]]
        // From bbox [minLng, minLat, maxLng, maxLat]
        const [minLng, minLat, maxLng, maxLat] = bbox(featureCollection);
        return [
            [minLat, minLng],
            [maxLat, maxLng],
        ] as [[number, number], [number, number]];
    }, [features]);

    if (!features.length) return null;

    return (
        <MapContainer
            center={[37.9682, 23.7668]}
            zoom={10}
            scrollWheelZoom
            className="size-full rounded-md z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {bounds && <FitBounds bounds={bounds} />}
            {features.map(renderGeometry)}
        </MapContainer>
    );
};

export default LeafletMap;