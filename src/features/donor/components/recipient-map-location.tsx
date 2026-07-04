"use client";

import { useEffect, useRef, useState } from "react";
import { RingLoader } from "react-spinners";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

type Recipient = {
  _id: string;
  userName: string;
  userEmail?: string;
  userImage?: string;
  bloodType?: string;
  age?: number;
  location?: string;
  gender?: string;
  phone?: string;
  bio?: string;
  latitude?: number;
  longitude?: number;
};

interface RecipientMapLocationProps {
  selectedRecipient?: Recipient | null;
}

// Multan, Pakistan coordinates (outside component to avoid re-creation)
const MULTAN_CENTER: [number, number] = [30.1575, 71.5249];
const DEFAULT_ZOOM = 13;

export const RecipientMapLocation = ({
  selectedRecipient,
}: RecipientMapLocationProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize the Leaflet map once when the component mounts
  useEffect(() => {
    let isCancelled = false;

    const initializeMap = async () => {
      const L = await import("leaflet");
      if (isCancelled || !mapContainerRef.current) {
        return;
      }

      leafletRef.current = L;

      // Fix Leaflet default icon issue with Next.js when using direct Leaflet
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });

      mapRef.current = L.map(mapContainerRef.current, {
        center: MULTAN_CENTER,
        zoom: DEFAULT_ZOOM,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      setIsMapReady(true);
    };

    initializeMap();

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, []);

  // Update marker when the selected recipient changes
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;

    if (!L || !map) {
      return;
    }

    if (!selectedRecipient) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      return;
    }

    // Use recipient's actual coordinates if available, otherwise use default
    const coordinates: [number, number] =
      selectedRecipient.latitude && selectedRecipient.longitude
        ? [selectedRecipient.latitude, selectedRecipient.longitude]
        : MULTAN_CENTER;

    const popupContent = `
      <div style="font-size: 14px;">
        <strong style="font-size: 16px;">${selectedRecipient.userName}</strong>
        <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
          ${selectedRecipient.bloodType ? `<span><strong>Blood Type:</strong> ${selectedRecipient.bloodType}</span>` : ""}
          ${selectedRecipient.location ? `<span><strong>Location:</strong> ${selectedRecipient.location}</span>` : ""}
          ${selectedRecipient.latitude && selectedRecipient.longitude ? `<span><strong>Coordinates:</strong> ${selectedRecipient.latitude.toFixed(6)}, ${selectedRecipient.longitude.toFixed(6)}</span>` : ""}
          ${selectedRecipient.age ? `<span><strong>Age:</strong> ${selectedRecipient.age} years</span>` : ""}
          ${selectedRecipient.gender ? `<span><strong>Gender:</strong> ${selectedRecipient.gender}</span>` : ""}
          ${selectedRecipient.phone ? `<span><strong>Phone:</strong> ${selectedRecipient.phone}</span>` : ""}
        </div>
      </div>
    `;

    if (!markerRef.current) {
      markerRef.current = L.marker(coordinates).addTo(map);
    }

    markerRef.current.setLatLng(coordinates);
    markerRef.current.bindPopup(popupContent, { autoClose: true }).openPopup();

    // Focus map on the marker
    map.setView(coordinates, DEFAULT_ZOOM, {
      animate: true,
    });
  }, [selectedRecipient]);

  return (
    <div className="relative w-full h-[600px] lg:h-[70vh] border border-gray-200 rounded-lg bg-gray-50 overflow-hidden z-10">
      <div ref={mapContainerRef} className="h-full w-full" />

      {(!isMapReady || !selectedRecipient) && (
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-white/90 backdrop-blur-sm pointer-events-none">
          {!isMapReady ? (
            <div className="flex flex-col items-center gap-4">
              <RingLoader size={40} color="#EF4444" />
              <p className="text-gray-600">Loading map...</p>
            </div>
          ) : (
            <div className="max-w-md">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Location Selected
              </h3>
              <p className="text-gray-500">
                Click on a recipient&apos;s Location button to view their
                location on the map
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
