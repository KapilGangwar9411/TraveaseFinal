/**
 * Utility functions for working with Mapbox GL
 * This helps avoid TypeScript errors with default imports
 */

// Import Mapbox as a namespace to avoid import errors
import * as mapboxgl from 'mapbox-gl';

// Set Mapbox token
export function setMapboxToken(token: string): void {
  (mapboxgl as any).accessToken = token;
}

// Create a new map instance
export function createMap(container: HTMLElement, options: any): mapboxgl.Map {
  return new mapboxgl.Map({
    container,
    ...options
  });
}

// Create a new marker
export function createMarker(options: any): any {
  return new (mapboxgl as any).Marker(options);
}

/**
 * Create a user location marker with a custom element
 * @param coordinates [longitude, latitude]
 * @param map The Mapbox map instance
 * @returns The created marker
 */
export function createUserLocationMarker(coordinates: [number, number], map: mapboxgl.Map): any {
  // Create a custom HTML element for the marker
  const el = document.createElement('div');
  el.className = 'user-location-marker';

  // Create the inner pulse effect
  const pulse = document.createElement('div');
  pulse.className = 'pulse';
  el.appendChild(pulse);

  // Create the center dot
  const dot = document.createElement('div');
  dot.className = 'dot';
  el.appendChild(dot);

  // Add the marker to the map
  const marker = new (mapboxgl as any).Marker({
    element: el,
    anchor: 'center'
  })
    .setLngLat(coordinates)
    .addTo(map);

  return marker;
}

// Create a new navigation control
export function createNavigationControl(): any {
  return new (mapboxgl as any).NavigationControl();
}

// Create a new geolocate control
export function createGeolocateControl(): any {
  return new (mapboxgl as any).GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  });
}

// Create a new bounds instance
export function createBounds(): any {
  return new (mapboxgl as any).LngLatBounds();
}

// Check if a source exists on the map
export function sourceExists(map: mapboxgl.Map, id: string): boolean {
  return !!map.getSource(id);
}

// Remove a layer and source from the map
export function removeLayerAndSource(map: mapboxgl.Map, id: string): void {
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }

  if (map.getSource(id)) {
    map.removeSource(id);
  }
}

// Add a GeoJSON source to the map
export function addGeoJSONSource(map: mapboxgl.Map, id: string, data: any): void {
  map.addSource(id, {
    type: 'geojson',
    data
  });
}

// Add a line layer to the map
export function addLineLayer(
  map: mapboxgl.Map,
  id: string,
  source: string,
  color: string = '#3880ff',
  width: number = 5,
  opacity: number = 0.8
): void {
  map.addLayer({
    id,
    type: 'line',
    source,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': color,
      'line-width': width,
      'line-opacity': opacity
    }
  });
}

// Fit map to bounds
export function fitBounds(map: mapboxgl.Map, bounds: any, options: any = {}): void {
  map.fitBounds(bounds, {
    padding: 80,
    ...options
  });
}

// Fly to a location
export function flyTo(map: mapboxgl.Map, center: [number, number], zoom: number): void {
  map.flyTo({
    center,
    zoom
  });
}
