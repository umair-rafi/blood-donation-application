"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { RingLoader } from "react-spinners";

type LocationState = {
  loading: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
};

export const LocationControl = () => {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationState, setLocationState] = useState<LocationState>({
    loading: false,
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
  });

  const updateLocation = useMutation(api.members.updateMemberLocation);
  const clearLocation = useMutation(api.members.clearMemberLocation);
  const currentProfile = useQuery(api.members.getCurrentMemberProfile);

  // Check if location is already enabled when component mounts
  useEffect(() => {
    if (currentProfile?.latitude && currentProfile?.longitude) {
      setLocationEnabled(true);
      setLocationState({
        loading: false,
        latitude: currentProfile.latitude,
        longitude: currentProfile.longitude,
        accuracy: null,
        error: null,
      });
    }
  }, [currentProfile]);

  // Get location when enabled
  useEffect(() => {
    if (!locationEnabled) {
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationState({
        loading: false,
        latitude: null,
        longitude: null,
        accuracy: null,
        error: "Geolocation is not supported by your browser",
      });
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationState((prev) => ({ ...prev, loading: true, error: null }));

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setLocationState({
          loading: false,
          latitude,
          longitude,
          accuracy,
          error: null,
        });

        // Update location in database
        updateLocation({ latitude, longitude })
          .then(() => {
            toast.success("Location updated successfully");
          })
          .catch((error) => {
            toast.error("Failed to save location: " + error.message);
          });
      },
      (error) => {
        let errorMessage = "Failed to get location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access in your browser.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location information is unavailable. Please check your device settings.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }

        setLocationState({
          loading: false,
          latitude: null,
          longitude: null,
          accuracy: null,
          error: errorMessage,
        });

        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }, [locationEnabled, updateLocation]);

  const handleToggle = (checked: boolean) => {
    setLocationEnabled(checked);

    if (!checked) {
      setLocationState({
        loading: false,
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
      });
      clearLocation()
        .then(() => {
          toast.info("Location sharing disabled");
        })
        .catch((error) => {
          toast.error("Failed to disable location: " + error.message);
        });
    }
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-500" />
          <CardTitle>Location Sharing</CardTitle>
        </div>
        <CardDescription>
          Enable location to help donors find you quickly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="location-toggle" className="flex items-center gap-2">
            <span>Enable Location</span>
          </Label>
          <Switch
            id="location-toggle"
            checked={locationEnabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {locationEnabled && (
          <div className="space-y-3 pt-2 border-t">
            {locationState.loading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RingLoader size={16} color="#EF4444" />
                  <span>Getting your location...</span>
                </div>
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                  <p>If this takes too long:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Check browser location permissions</li>
                    <li>Ensure GPS/location is enabled on your device</li>
                    <li>Try refreshing the page</li>
                  </ul>
                </div>
              </div>
            )}

            {locationState.error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-700">Location Error</p>
                  <p className="text-red-600">{locationState.error}</p>
                  <div className="mt-2 text-xs">
                    <p className="font-medium">Troubleshooting:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>
                        Click the lock icon in your browser&apos;s address bar
                      </li>
                      <li>Set Location permission to &quot;Allow&quot;</li>
                      <li>Reload the page and try again</li>
                      <li>
                        Make sure location services are enabled on your device
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {!locationState.loading &&
              !locationState.error &&
              locationState.latitude &&
              locationState.longitude && (
                <div className="space-y-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 font-semibold">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Location Active</span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Latitude:</span>
                      <span>{locationState.latitude.toFixed(6)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Longitude:</span>
                      <span>{locationState.longitude.toFixed(6)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Accuracy:</span>
                      <span>
                        {locationState.accuracy
                          ? `±${locationState.accuracy.toFixed(0)} meters`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Your location is being shared with donors
                  </p>
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
