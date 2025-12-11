"use client";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

export default function GoogleMapsLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
    preventGoogleFontsLoading: true,
  });
  if (!isLoaded) {
    return null;
  }

  if (isLoaded) return <>{children}</>;

  return (
    <GoogleMap>
      {loadError ? (
        <div>Failed to load Google Maps.</div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          Loading Google Maps...
        </div>
      )}
    </GoogleMap>
  );
}
