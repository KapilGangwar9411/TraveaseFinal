import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { MapboxService } from 'src/services/mapbox.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.page.html',
  styleUrls: ['./select-location.page.scss'],
})
export class SelectLocationPage implements OnInit {
  places: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  searchTermChanged: Subject<string> = new Subject<string>();
  proximity: string | null = null;
  isSourceField: boolean = true; // Default to source field
  fieldTitle: string = '';

  constructor(
    private navCtrl: NavController,
    private mapboxService: MapboxService,
    private geolocation: Geolocation,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    // Check navigation state
    this.checkNavigationState();
  }

  ngOnInit() {
    // Setup search debounce
    this.searchTermChanged.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 2)
    ).subscribe(searchTerm => {
      this.searchPlaces(searchTerm);
    });

    // Try to get user location for proximity-based results
    this.getCurrentPosition();
  }

  /**
   * Check navigation state to determine which field is being edited
   */
  private checkNavigationState() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state) {
      const state = navigation.extras.state;

      if ('isSourceField' in state) {
        this.isSourceField = state['isSourceField'] === true;
      }

      // Set the title based on which field is being edited
      this.fieldTitle = this.isSourceField ? 'Select Pickup Location' : 'Select Drop Location';

      // Initialize search with current field value if available
      if (this.isSourceField && state['currentSource']) {
        this.searchTerm = state['currentSource'];
        if (this.searchTerm.length >= 2) {
          setTimeout(() => {
            this.searchPlaces(this.searchTerm);
          }, 300);
        }
      } else if (!this.isSourceField && state['currentDestination']) {
        this.searchTerm = state['currentDestination'];
        if (this.searchTerm.length >= 2) {
          setTimeout(() => {
            this.searchPlaces(this.searchTerm);
          }, 300);
        }
      }
    } else {
      this.fieldTitle = 'Select Location';
    }
  }

  onSearchInput(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm.length < 2) {
      this.places = [];
      return;
    }
    this.searchTermChanged.next(this.searchTerm);
  }

  async searchPlaces(query: string) {
    if (!query || query.trim() === '') {
      this.places = [];
      return;
    }

    this.isLoading = true;
    try {
      const response = await this.mapboxService.placesAutocomplete(
        query,
        this.proximity,
        5  // limit to 5 results
      ).toPromise();

      this.places = response.features || [];

      if (this.places.length === 0 && query.length > 3) {
        // If no results with proximity, try without proximity
        const fallbackResponse = await this.mapboxService.placesAutocomplete(
          query,
          null,  // no proximity bias
          5
        ).toPromise();
        this.places = fallbackResponse.features || [];

        if (this.places.length > 0) {
          console.log('Found results without proximity bias');
        }
      }
    } catch (error) {
      console.error('Error searching places:', error);
      // Show error message to user
      this.presentToast('Could not search for places. Please check your connection.');
      this.places = [];
    } finally {
      this.isLoading = false;
    }
  }

  async getCurrentPosition() {
    try {
      this.isLoading = true;
      const position = await this.geolocation.getCurrentPosition({
        enableHighAccuracy: false, // Set to false for faster response
        timeout: 15000, // Increase timeout to 15 seconds
        maximumAge: 60000 // Allow cached positions up to 1 minute old
      });

      if (position && position.coords) {
        // Format as comma-separated string: longitude,latitude
        this.proximity = `${position.coords.longitude},${position.coords.latitude}`;
        console.log('Location retrieved successfully:', this.proximity);
      }
    } catch (error) {
      console.error('Error getting current position for proximity:', error);

      // Use a default location (could be a major city in the region)
      // For India, using New Delhi coordinates as fallback
      this.proximity = '77.2090,28.6139';

      // Show a toast or alert to the user
      this.showLocationError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private showLocationError(error: any) {
    let message = 'Unable to get your location.';

    if (error.code === 1) {
      message = 'Location permission denied. Search results won\'t be optimized for your location.';
    } else if (error.code === 2) {
      message = 'Location unavailable. Using default location for search.';
    } else if (error.code === 3) {
      message = 'Location request timed out. Using default location for search.';
    }

    console.warn(message);
    this.presentToast(message);
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }

  locationSelected(place?: any) {
    // If a place is provided, pass it back to the calling page
    if (place) {
      console.log('Selected place:', place);

      // Extract and format place data
      let placeData: {
        place_name: string;
        coordinates: [number, number] | null;
        isSourceField: boolean;
      } = {
        place_name: place.place_name || place.text || 'Selected Location',
        coordinates: null,
        isSourceField: this.isSourceField
      };

      // Extract coordinates safely with fallbacks
      try {
        // Try to get coordinates from the place object in expected formats
        if (place.geometry && place.geometry.coordinates &&
            Array.isArray(place.geometry.coordinates) &&
            place.geometry.coordinates.length >= 2) {
          // Standard Mapbox format
          placeData.coordinates = [
            place.geometry.coordinates[0],
            place.geometry.coordinates[1]
          ] as [number, number];
        } else if (place.center && Array.isArray(place.center) && place.center.length >= 2) {
          // Alternative format sometimes returned by Mapbox
          placeData.coordinates = [place.center[0], place.center[1]] as [number, number];
        } else if (place.longitude !== undefined && place.latitude !== undefined) {
          // Object with direct longitude/latitude properties
          placeData.coordinates = [place.longitude, place.latitude] as [number, number];
        } else {
          // Use proximity as fallback (if available)
          if (this.proximity) {
            const [lng, lat] = this.proximity.split(',').map(Number);
            if (!isNaN(lng) && !isNaN(lat)) {
              placeData.coordinates = [lng, lat] as [number, number];
              console.warn('Using proximity as fallback for coordinates');
            }
          }
        }
      } catch (error) {
        console.error('Error extracting coordinates:', error);
      }

      // Show error if no coordinates could be determined
      if (!placeData.coordinates) {
        this.presentToast('Could not determine location coordinates. Please try another location.');
        return;
      }

      console.log('Navigating back with place data:', placeData);

      // Navigate back with the selected place data
      setTimeout(() => {
        // Use a timeout to ensure the navigation happens after current execution
        this.navCtrl.navigateBack('/home', {
          state: {
            selectedPlace: placeData,
            isSourceField: this.isSourceField,
            timestamp: new Date().getTime() // Add timestamp to ensure state is recognized as new
          }
        });
      }, 50);
    } else {
      // For 'Pin on Map' or other navigation without a selected place
      this.navCtrl.pop();
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.places = [];
  }
}
