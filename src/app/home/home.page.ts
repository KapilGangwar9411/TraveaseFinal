import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { IonDatetime, Platform, LoadingController, ToastController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { format, parseISO } from 'date-fns'
import Swiper from 'swiper'
import { MapboxService } from 'src/services/mapbox.service';
import { RideService } from 'src/services/ride.service';
import { AuthService } from 'src/services/auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as MapboxUtils from 'src/utils/mapbox-utils';
import * as mapboxgl from 'mapbox-gl';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  modes = ['date-time'];
  select_seat: string = "1";
  select_vehicle: string = "1";
  swiper!: Swiper;
  segment: string = "0"
  showPicker = false;
  dateValue = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z';
  formattedString = '';
  @ViewChild('map') mapElement!: ElementRef;
  map: mapboxgl.Map | null = null;
  style = 'mapbox://styles/mapbox/streets-v12';
  currentCenter: [number, number] = [77.2090, 28.6139]; // Default New Delhi
  zoom = 15;
  userLocationMarker: any = null;
  isTrackingLocation = false;
  watchPositionId: any = null;
  sourceLocation: string = '';
  destinationLocation: string = '';
  sourceCoordinates: [number, number] | null = null;
  destinationCoordinates: [number, number] | null = null;
  @ViewChild(IonDatetime) datetime!: IonDatetime;
  isLoading = false;
  currentUserId: string = '1'; // Mock user ID for testing - replace with actual auth
  pricePerSeat: string = '';
  constructor(
    private route: Router,
    private mapboxService: MapboxService,
    private rideService: RideService,
    private authService: AuthService,
    private platform: Platform,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    this.setToday();

    // Check for location data passed from select-location page
    this.checkForLocationFromNavigation();

    // Get current user ID
    this.getCurrentUserId();

    // Listen for route changes to handle back navigation from location selection
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Check for state data on navigation
      const navigation = this.route.getCurrentNavigation();
      if (navigation?.extras?.state && navigation.extras.state['selectedPlace']) {
        this.handleLocationSelection(navigation.extras.state);
      }
    });
  }
  setToday() {
    this.formattedString = format(parseISO(format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z'), 'd MMM, HH:mm');
  }

  ngOnInit() {
    console.log('Home page initialized');
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.initializeMap();
      }, 300);
    });
  }

  async showLoading(message: string = 'Loading...') {
    const loading = await this.loadingCtrl.create({
      message,
      duration: 5000
    });
    await loading.present();
    return loading;
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  async initializeMap() {
    try {
      if (!this.mapElement) {
        console.error('Map element not found');
        return;
      }

      const loading = await this.showLoading('Loading map...');

      MapboxUtils.setMapboxToken(this.mapboxService.getAccessToken());

      try {
        await this.getUserLocation();
      } catch (error) {
        console.error('Error getting current location', error);
        await this.showToast('Could not get your location. Using default location.');
      }

      this.map = MapboxUtils.createMap(this.mapElement.nativeElement, {
        style: this.style,
        center: this.currentCenter,
        zoom: this.zoom
      });

      this.map.addControl(MapboxUtils.createNavigationControl());

      if (this.map) {
        this.addUserLocationMarker();

        this.map.on('load', () => {
          console.log('Map loaded successfully');
          loading.dismiss();
          this.startLocationTracking();
        });
      } else {
        loading.dismiss();
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      this.showToast('Error initializing map. Please try again.');
    }
  }

  async getUserLocation(): Promise<[number, number] | null> {
    try {
      const position = await this.geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      if (!position || !('coords' in position)) {
        return null;
      }

      return [position.coords.longitude, position.coords.latitude];
    } catch (error) {
      console.error('Error getting current position:', error);
      this.showToast('Could not get your current location.');
      return null;
    }
  }

  addUserLocationMarker() {
    if (!this.map) return;

    if (this.userLocationMarker) {
      this.userLocationMarker.remove();
    }

    this.userLocationMarker = MapboxUtils.createUserLocationMarker(this.currentCenter, this.map);
  }

  async startLocationTracking() {
    if (this.isTrackingLocation) return;

    this.isTrackingLocation = true;

    this.watchPositionId = this.geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 5000
    }).subscribe(
      (position) => {
        if (!position || !('coords' in position)) return;

        this.currentCenter = [position.coords.longitude, position.coords.latitude];

        if (this.userLocationMarker && this.map) {
          this.userLocationMarker.setLngLat(this.currentCenter);
        }
      },
      (error) => {
        console.error('Error watching position:', error);
        this.showToast('Error tracking your location.');
      }
    );
  }

  stopLocationTracking() {
    if (!this.isTrackingLocation) return;

    if (this.watchPositionId) {
      this.watchPositionId.unsubscribe();
      this.watchPositionId = null;
    }

    this.isTrackingLocation = false;
  }

  async centerOnUserLocation() {
    this.isLoading = true;
    const userLocation = await this.getUserLocation();

    if (userLocation) {
      this.currentCenter = userLocation;
      if (this.map) {
        this.map.flyTo({
          center: this.currentCenter,
          zoom: 15,
          essential: true
        });
      }
    }
    this.isLoading = false;
  }

  onSegmentChange(event: any) {
    const selectedIndex = event.detail.value;
    const swiper = (document.getElementById("swiper1") as any)?.swiper;
    if (swiper) {
      swiper.slideTo(selectedIndex);
    }
  }

  onSlideChange(event: any) {
    const swiper = (document.getElementById("swiper1") as any)?.swiper;
    this.segment = `${swiper?.activeIndex || 0}`;
  }
  /**
   * Navigate to select location page
   * @param isSourceField Whether the source or destination field is being edited
   */
  select_location(isSourceField: boolean = true) {
    console.log(`Navigating to select location for ${isSourceField ? 'source' : 'destination'}`);

    // Get current location coordinates for proximity if available
    const proximityCoords = this.currentCenter ?
      `${this.currentCenter[0]},${this.currentCenter[1]}` : null;

    this.route.navigate(['/select-location'], {
      state: {
        isSourceField: isSourceField,
        proximity: proximityCoords,
        // Include current location data in case user wants to edit
        currentSource: this.sourceLocation,
        currentDestination: this.destinationLocation
      }
    });
  }
  listOfPooler() {
    this.route.navigate(['./list-of-pooler']);
  }
  poolTakers() {
    // Validate required fields
    if (!this.sourceLocation || !this.destinationLocation || !this.sourceCoordinates || !this.destinationCoordinates) {
      this.showToast('Please select pickup and drop locations');
      return;
    }

    if (!this.pricePerSeat) {
      this.showToast('Please enter price per seat');
      return;
    }

    // Create a ride
    this.createRideOffer();
  }
  dateChanged(value: any) {
    this.dateValue = value;
    this.formattedString = format(parseISO(value), 'd MMM, HH:mm');
  }

  close() {
    this.datetime.cancel(true);
  }
  select() {
    this.datetime.confirm(true);
  }

  async searchLocation(query: string, isSource: boolean) {
    if (!query || query.trim().length < 3 || !this.map) return;

    try {
      console.log(`Searching for ${isSource ? 'source' : 'destination'}: ${query}`);
      const response = await this.mapboxService.geocode(query).toPromise();

      if (response && response.features && response.features.length > 0) {
        const feature = response.features[0];
        const coordinates = feature.geometry.coordinates as [number, number];
        const placeName = feature.place_name;

        console.log(`Found ${isSource ? 'source' : 'destination'}: ${placeName}`, coordinates);

        if (isSource) {
          this.sourceLocation = placeName;
          this.sourceCoordinates = coordinates;
        } else {
          this.destinationLocation = placeName;
          this.destinationCoordinates = coordinates;
        }

        if (this.map) {
          const marker = MapboxUtils.createMarker({ color: isSource ? '#00FF00' : '#0000FF' });
          marker.setLngLat(coordinates).addTo(this.map);

          MapboxUtils.flyTo(this.map, coordinates, 14);
        }

        if (this.sourceCoordinates && this.destinationCoordinates) {
          this.getRouteDirections();
        }
      }
    } catch (error) {
      console.error('Error searching location', error);
    }
  }

  async getRouteDirections() {
    if (!this.sourceCoordinates || !this.destinationCoordinates || !this.map) {
      return;
    }

    try {
      console.log('Getting directions between:', this.sourceCoordinates, this.destinationCoordinates);
      const response = await this.mapboxService.getDirections(
        this.sourceCoordinates,
        this.destinationCoordinates
      ).toPromise();

      if (response && response.routes && response.routes.length > 0) {
        const route = response.routes[0];
        const routeGeometry = route.geometry;

        MapboxUtils.removeLayerAndSource(this.map, 'route');

        MapboxUtils.addGeoJSONSource(this.map, 'route', {
          type: 'Feature',
          properties: {},
          geometry: routeGeometry
        });

        MapboxUtils.addLineLayer(this.map, 'route', 'route');

        const bounds = MapboxUtils.createBounds();
        routeGeometry.coordinates.forEach((coord: [number, number]) => {
          bounds.extend(coord);
        });

        MapboxUtils.fitBounds(this.map, bounds);
      }
    } catch (error) {
      console.error('Error getting directions', error);
    }
  }

  clearMap() {
    if (!this.map) return;

    try {
      // Remove route
      MapboxUtils.removeLayerAndSource(this.map, 'route');

      // Clear location values
      this.sourceLocation = '';
      this.destinationLocation = '';
      this.sourceCoordinates = null;
      this.destinationCoordinates = null;

      // Remove all markers except user location marker
      const markers = document.querySelectorAll('.mapboxgl-marker:not(.user-location-marker)');
      markers.forEach(marker => {
        marker.remove();
      });

      // Ensure user location marker is still displayed
      this.addUserLocationMarker();

      // Fly to user location
      MapboxUtils.flyTo(this.map, this.currentCenter, 15);

      // Show confirmation toast
      this.showToast('Map cleared');
    } catch (error) {
      console.error('Error clearing map:', error);
      this.showToast('Error clearing map');
    }
  }

  /**
   * Check for location data passed from navigation
   */
  private checkForLocationFromNavigation() {
    const navigation = this.route.getCurrentNavigation();

    if (navigation?.extras?.state && navigation.extras.state['selectedPlace']) {
      const place = navigation.extras.state['selectedPlace'];
      console.log('Selected place received:', place);

      // Check if isSourceField is specifically set, otherwise determine based on existing data
      let isSource = true;
      if ('isSourceField' in navigation.extras.state) {
        isSource = navigation.extras.state['isSourceField'] === true;
      } else if ('isSourceField' in place) {
        isSource = place.isSourceField === true;
      } else {
        isSource = !this.sourceLocation || this.sourceLocation.trim() === '';
      }

      // Make sure we have both a place name and coordinates
      if (!place || !place.coordinates) {
        console.error('Invalid place data received:', place);
        this.showToast('Error: Invalid location data received');
        return;
      }

      // Extract the place name and coordinates
      const placeName = place.place_name || 'Selected Location';
      const coordinates = place.coordinates as [number, number];

      console.log(`Setting ${isSource ? 'source' : 'destination'} location:`, {
        placeName,
        coordinates
      });

      // Set values and add marker with a slight delay to ensure UI update
      setTimeout(() => {
        if (isSource) {
          this.sourceLocation = placeName;
          this.sourceCoordinates = coordinates;
          if (this.map) {
            this.addLocationMarker(coordinates, true);
          }
        } else {
          this.destinationLocation = placeName;
          this.destinationCoordinates = coordinates;
          if (this.map) {
            this.addLocationMarker(coordinates, false);
          }
        }

        // If both source and destination are set, get directions
        if (this.sourceCoordinates && this.destinationCoordinates) {
          setTimeout(() => {
            this.getRouteDirections();
          }, 300);
        }

        // Force change detection by setting a value
        this.isLoading = false;
      }, 100);
    }
  }

  /**
   * Add a marker for a location on the map
   */
  addLocationMarker(coordinates: [number, number], isSource: boolean) {
    if (!this.map || !coordinates) return;

    try {
      // Create marker with appropriate color
      const marker = MapboxUtils.createMarker({
        color: isSource ? '#00FF00' : '#0000FF'
      });

      // Add to map at the specified coordinates
      marker.setLngLat(coordinates).addTo(this.map);

      // Pan the map to show the marker
      MapboxUtils.flyTo(this.map, coordinates, 14);

      console.log(`Added marker for ${isSource ? 'source' : 'destination'} at:`, coordinates);
    } catch (error) {
      console.error('Error adding location marker:', error);
    }
  }

  /**
   * Get the current user ID from auth service
   */
  private async getCurrentUserId() {
    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        this.currentUserId = user.id;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  }

  /**
   * Create a ride offer in the backend
   */
  private async createRideOffer() {
    try {
      const loading = await this.showLoading('Creating your ride offer...');

      // Ensure coordinates are valid
      if (!this.sourceCoordinates || !this.destinationCoordinates) {
        loading.dismiss();
        this.showToast('Invalid location coordinates');
        return;
      }

      // Prepare ride data
      const departureDate = parseISO(this.dateValue);

      // Get directions to calculate estimated duration and distance
      let estimatedDuration = null;
      let estimatedDistance = null;
      let routePolyline = null;

      try {
        const directionsResponse = await this.mapboxService.getDirections(
          this.sourceCoordinates as [number, number],
          this.destinationCoordinates as [number, number]
        ).toPromise();

        if (directionsResponse && directionsResponse.routes && directionsResponse.routes.length > 0) {
          const route = directionsResponse.routes[0];
          estimatedDuration = route.duration;
          estimatedDistance = route.distance;
          routePolyline = route.geometry;
        }
      } catch (error) {
        console.error('Error getting directions details:', error);
      }

      // Determine total seats based on vehicle type
      let totalSeats = 4; // Default for most cars
      if (this.select_vehicle === '1') totalSeats = 4; // Hatchback
      if (this.select_vehicle === '2') totalSeats = 4; // Sedan
      if (this.select_vehicle === '3') totalSeats = 6; // SUV
      if (this.select_vehicle === '4') totalSeats = 7; // MUV
      if (this.select_vehicle === '5') totalSeats = 2; // Coupe
      if (this.select_vehicle === '6') totalSeats = 2; // Convertible
      if (this.select_vehicle === '7') totalSeats = 5; // Toyota Matrix

      const rideData = {
        driverId: this.currentUserId,
        sourceLocation: this.sourceLocation,
        sourceCoordinates: this.sourceCoordinates,
        destinationLocation: this.destinationLocation,
        destinationCoordinates: this.destinationCoordinates,
        departureTime: departureDate.toISOString(),
        vehicleType: this.getVehicleTypeName(this.select_vehicle),
        pricePerSeat: this.pricePerSeat,
        price: parseFloat(this.pricePerSeat), // Add explicit price field
        totalSeats: totalSeats,
        availableSeats: totalSeats,
        routePolyline: routePolyline,
        estimatedDuration: estimatedDuration,
        estimatedDistance: estimatedDistance,
        // Add these properties to match expected structure
        origin: { name: this.sourceLocation },
        destination: { name: this.destinationLocation },
        status: 'active'
      };

      // Call API to create ride
      const response = await this.rideService.createRideOffer(rideData).toPromise();

      loading.dismiss();

      if (response && response.id) {
        this.showToast('Ride offer created successfully!');
        this.route.navigate(['/my-trips']);
      } else {
        this.showToast('Failed to create ride offer');
      }
    } catch (error) {
      console.error('Error creating ride offer:', error);
      this.showToast('Failed to create ride offer');
    }
  }

  /**
   * Get the vehicle type name from the select option value
   */
  private getVehicleTypeName(vehicleType: string): string {
    switch (vehicleType) {
      case '1': return 'Hatchback';
      case '2': return 'Sedan';
      case '3': return 'SUV';
      case '4': return 'MUV';
      case '5': return 'Coupe';
      case '6': return 'Convertible';
      case '7': return 'Toyota Matrix';
      default: return 'Other';
    }
  }

  /**
   * Handle location selection from navigation state
   */
  private handleLocationSelection(state: any) {
    if (!state || !state.selectedPlace) return;

    const place = state.selectedPlace;
    console.log('Handling selected place:', place);

    // Check which field (source or destination) is being set
    const isSource = state.isSourceField === true;

    // Make sure we have both a place name and coordinates
    if (!place || !place.coordinates) {
      console.error('Invalid place data received:', place);
      this.showToast('Error: Invalid location data received');
      return;
    }

    // Extract the place name and coordinates
    const placeName = place.place_name || 'Selected Location';
    const coordinates = place.coordinates as [number, number];

    console.log(`Setting ${isSource ? 'source' : 'destination'} location:`, {
      placeName,
      coordinates
    });

    // Set values and trigger change detection
    if (isSource) {
      this.sourceLocation = placeName;
      this.sourceCoordinates = coordinates;
      if (this.map) {
        this.addLocationMarker(coordinates, true);
      }
    } else {
      this.destinationLocation = placeName;
      this.destinationCoordinates = coordinates;
      if (this.map) {
        this.addLocationMarker(coordinates, false);
      }
    }

    // If both source and destination are set, get directions
    if (this.sourceCoordinates && this.destinationCoordinates) {
      setTimeout(() => {
        this.getRouteDirections();
      }, 300);
    }

    // Force change detection to update the UI
    this.cdr.detectChanges();
  }
}
