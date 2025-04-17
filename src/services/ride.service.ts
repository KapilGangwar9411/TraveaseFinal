import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

interface PassengerRequest {
  id: string;
  userId: string;
  name: string;
  seats: number;
  status: string;
  createdAt: string;
  [key: string]: any;
}

interface MockRide {
  id: string;
  driverId: string;
  sourceLocation: string;
  destinationLocation: string;
  departureTime: string;
  vehicleType: string;
  pricePerSeat: number;
  totalSeats: number;
  availableSeats: number;
  status: string;
  passengerRequests: PassengerRequest[];
  origin: { name: string; [key: string]: any };
  destination: { name: string; [key: string]: any };
  price?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private apiUrl = environment.apiUrl + '/rides';

  // Mock data for testing when backend is unavailable
  private mockRides: MockRide[] = [
    {
      id: 'mock-ride-1',
      driverId: '1',
      sourceLocation: 'Central Park, New York',
      destinationLocation: 'Times Square, New York',
      departureTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      vehicleType: 'Sedan',
      pricePerSeat: 25,
      price: 25,
      totalSeats: 4,
      availableSeats: 3,
      status: 'active',
      passengerRequests: [],
      origin: { name: 'Central Park, New York' },
      destination: { name: 'Times Square, New York' }
    },
    {
      id: 'mock-ride-2',
      driverId: '1',
      sourceLocation: 'Brooklyn Bridge, New York',
      destinationLocation: 'Empire State Building, New York',
      departureTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      vehicleType: 'SUV',
      pricePerSeat: 30,
      price: 30,
      totalSeats: 6,
      availableSeats: 4,
      status: 'active',
      passengerRequests: [],
      origin: { name: 'Brooklyn Bridge, New York' },
      destination: { name: 'Empire State Building, New York' }
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Create a new ride offer
   * @param rideData The ride data
   */
  createRideOffer(rideData: any): Observable<any> {
    if (environment.useMockData) {
      const mockResponse = {
        ...rideData,
        id: `mock-ride-${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      return of(mockResponse);
    }
    return this.http.post(`${this.apiUrl}/offer`, rideData)
      .pipe(catchError(error => {
        console.error('Error creating ride offer:', error);
        return of(null);
      }));
  }

  /**
   * Get rides offered by the current user
   * @param userId The user ID
   */
  getRidesByDriver(userId: string): Observable<any> {
    if (environment.useMockData) {
      // Filter mock rides by driver ID
      const driverRides = this.mockRides.filter(ride => ride.driverId === userId);
      return of(driverRides);
    }
    return this.http.get(`${this.apiUrl}/driver/${userId}`)
      .pipe(catchError(error => {
        console.error('Error getting rides by driver:', error);
        // Fall back to mock data on error
        const driverRides = this.mockRides.filter(ride => ride.driverId === userId);
        return of(driverRides);
      }));
  }

  /**
   * Get available rides with optional filters
   * @param filters Optional filters
   */
  getAvailableRides(filters?: any): Observable<any> {
    if (environment.useMockData) {
      return of(this.mockRides.filter(ride => ride.status === 'active'));
    }
    return this.http.get(`${this.apiUrl}/available`, { params: filters || {} })
      .pipe(catchError(error => {
        console.error('Error getting available rides:', error);
        return of(this.mockRides.filter(ride => ride.status === 'active'));
      }));
  }

  /**
   * Get a ride by ID
   * @param rideId The ride ID
   */
  getRideById(rideId: string): Observable<any> {
    if (environment.useMockData) {
      const ride = this.mockRides.find(r => r.id === rideId);
      return of(ride || null);
    }
    return this.http.get(`${this.apiUrl}/${rideId}`)
      .pipe(catchError(error => {
        console.error('Error getting ride by ID:', error);
        const ride = this.mockRides.find(r => r.id === rideId);
        return of(ride || null);
      }));
  }

  /**
   * Update a ride
   * @param rideId The ride ID
   * @param updateData The data to update
   */
  updateRide(rideId: string, updateData: any): Observable<any> {
    if (environment.useMockData) {
      const rideIndex = this.mockRides.findIndex(r => r.id === rideId);
      if (rideIndex >= 0) {
        this.mockRides[rideIndex] = {
          ...this.mockRides[rideIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        return of(this.mockRides[rideIndex]);
      }
      return of(null);
    }
    return this.http.put(`${this.apiUrl}/${rideId}`, updateData)
      .pipe(catchError(error => {
        console.error('Error updating ride:', error);
        return of(null);
      }));
  }

  /**
   * Cancel a ride
   * @param rideId The ride ID
   * @param requesterId The requester ID (for authorization)
   */
  cancelRide(rideId: string, requesterId: string): Observable<any> {
    if (environment.useMockData) {
      const rideIndex = this.mockRides.findIndex(r => r.id === rideId);
      if (rideIndex >= 0 && this.mockRides[rideIndex].driverId === requesterId) {
        this.mockRides[rideIndex].status = 'cancelled';
        return of(this.mockRides[rideIndex]);
      }
      return of(null);
    }
    return this.http.patch(`${this.apiUrl}/${rideId}/cancel`, { requesterId })
      .pipe(catchError(error => {
        console.error('Error cancelling ride:', error);
        return of(null);
      }));
  }

  /**
   * Add a passenger request to a ride
   * @param rideId The ride ID
   * @param requestData The request data
   */
  addPassengerRequest(rideId: string, requestData: any): Observable<any> {
    if (environment.useMockData) {
      const rideIndex = this.mockRides.findIndex(r => r.id === rideId);
      if (rideIndex >= 0) {
        const request: PassengerRequest = {
          ...requestData,
          id: `request-${Date.now()}`,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        this.mockRides[rideIndex].passengerRequests.push(request);
        return of(this.mockRides[rideIndex]);
      }
      return of(null);
    }
    return this.http.post(`${this.apiUrl}/${rideId}/request`, requestData)
      .pipe(catchError(error => {
        console.error('Error adding passenger request:', error);
        return of(null);
      }));
  }

  /**
   * Respond to a passenger request
   * @param rideId The ride ID
   * @param requestId The request ID
   * @param accept Whether to accept or reject the request
   * @param requesterId The requester ID (for authorization)
   */
  respondToPassengerRequest(
    rideId: string,
    requestId: string,
    accept: boolean,
    requesterId: string
  ): Observable<any> {
    if (environment.useMockData) {
      const rideIndex = this.mockRides.findIndex(r => r.id === rideId);
      if (rideIndex >= 0 && this.mockRides[rideIndex].driverId === requesterId) {
        const ride = this.mockRides[rideIndex];
        const requestIndex = ride.passengerRequests.findIndex(r => r.id === requestId);

        if (requestIndex >= 0) {
          ride.passengerRequests[requestIndex].status = accept ? 'accepted' : 'rejected';
          return of(ride);
        }
      }
      return of(null);
    }
    return this.http.patch(
      `${this.apiUrl}/${rideId}/request/${requestId}/respond`,
      { accept, requesterId }
    ).pipe(catchError(error => {
      console.error('Error responding to passenger request:', error);
      return of(null);
    }));
  }
}
