import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  private apiUrl = environment.apiUrl + '/mapbox';
  private mapboxToken = 'pk.eyJ1Ijoia2FwaWxnYW5nd2FyIiwiYSI6ImNtOWw4eTk3ODAyNDYyanIwNW10dWc4a2MifQ.fhXzJwC258Bob-m4v6qHdg';

  constructor(private http: HttpClient) { }

  /**
   * Get Mapbox access token
   */
  getAccessToken(): string {
    return this.mapboxToken;
  }

  /**
   * Geocode a location query
   * @param query Location text to geocode
   */
  geocode(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/geocode`, {
      params: { query }
    });
  }

  /**
   * Places autocomplete for incremental location search
   * @param query Partial text to search for
   * @param proximity Optional comma-separated longitude,latitude to bias results
   * @param limit Max number of results (default: 5)
   * @param country Country code to limit results (default: IN)
   */
  placesAutocomplete(
    query: string,
    proximity?: string | null,
    limit: number = 5,
    country: string = 'IN'
  ): Observable<any> {
    const params: any = { query, limit, country };

    if (proximity) {
      params.proximity = proximity;
    }

    return this.http.get(`${this.apiUrl}/places-autocomplete`, { params });
  }

  /**
   * Reverse geocode coordinates
   * @param longitude Longitude
   * @param latitude Latitude
   */
  reverseGeocode(longitude: number, latitude: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reverse-geocode`, {
      params: {
        longitude: longitude.toString(),
        latitude: latitude.toString()
      }
    });
  }

  /**
   * Get directions between two points
   * @param start Start coordinates [lng, lat]
   * @param end End coordinates [lng, lat]
   * @param profile Routing profile (driving, walking, cycling)
   */
  getDirections(
    start: [number, number],
    end: [number, number],
    waypoints: [number, number][] = [],
    profile: string = 'driving'
  ): Observable<any> {
    return this.http.get(`${this.apiUrl}/directions`, {
      params: {
        startLng: start[0].toString(),
        startLat: start[1].toString(),
        endLng: end[0].toString(),
        endLat: end[1].toString(),
        profile
      }
    });
  }

  /**
   * Get travel time matrix
   * @param sources Array of source coordinates
   * @param destinations Array of destination coordinates
   * @param profile Routing profile
   */
  getMatrix(
    sources: [number, number][],
    destinations: [number, number][],
    profile: string = 'driving'
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/matrix`, {
      sources,
      destinations
    }, {
      params: { profile }
    });
  }

  /**
   * Get isochrone (area reachable within given time)
   * @param longitude Center longitude
   * @param latitude Center latitude
   * @param contours Array of contour times in minutes
   * @param profile Routing profile
   */
  getIsochrone(
    longitude: number,
    latitude: number,
    contours: number[] = [10, 20, 30],
    profile: string = 'driving'
  ): Observable<any> {
    return this.http.get(`${this.apiUrl}/isochrone`, {
      params: {
        longitude: longitude.toString(),
        latitude: latitude.toString(),
        contours: contours.join(','),
        profile
      }
    });
  }
}
