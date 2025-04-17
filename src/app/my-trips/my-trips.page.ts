import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, NavController, IonContent, IonInfiniteScroll, AlertController } from '@ionic/angular';
import { RideService } from '../../services/ride.service';
import Swiper from 'swiper';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.page.html',
  styleUrls: ['./my-trips.page.scss'],
})
export class MyTripsPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  swiper!: Swiper;
  segment = 'offering';
  isLoading = true;
  offeredRides: any[] = [];
  requestedRides: any[] = [];
  findingRides: any[] = [];
  useMockData = environment.useMockData;

  // Mock user ID for testing - replace with actual auth
  currentUserId: string = '1';

  constructor(
    private router: Router,
    private rideService: RideService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private translate: TranslateService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadRides();
  }

  ionViewWillEnter() {
    this.loadRides();
  }

  async loadRides(event?: any) {
    if (!event) {
      this.isLoading = true;
    }

    try {
      // Get user offered rides
      const offeredRides = await this.rideService.getRidesByDriver(this.currentUserId).toPromise();
      this.offeredRides = offeredRides || [];

      // Get user's requested rides
      // This would need to be implemented in your ride service
      this.requestedRides = [];
      this.findingRides = [];
    } catch (error) {
      console.error('Error loading rides:', error);
      this.showToast('Error loading rides. Please try again later.');
    } finally {
      this.isLoading = false;
      if (event) {
        event.target.complete();
      }
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  segmentChanged(event: any) {
    this.segment = event.detail.value;
  }

  onSlideChange(event: any) {
    this.segment = `${(<any>document.getElementById("swiper2"))?.swiper.activeIndex || 0}`;
  }

  TripInfo(rideId?: string) {
    this.router.navigate(['./ride-accepted'], {
      state: { rideId }
    });
  }

  pool_taker_request(rideId?: string) {
    this.router.navigate(['./pool-taker-request'], {
      state: { rideId }
    });
  }

  list_of_pooler() {
    this.router.navigate(['./list-of-pooler']);
  }

  // Format date for display
  formatDate(timestamp: string): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get number of requests
  getRequestCount(ride: any): number {
    if (!ride.passengerRequests) return 0;
    return ride.passengerRequests.filter((request: any) => request.status === 'pending').length;
  }

  // Get number of available seats
  getAvailableSeats(ride: any): number {
    return ride.availableSeats || 0;
  }

  // Refresh rides on pull
  async doRefresh(event: any) {
    await this.loadRides(event);
  }

  viewRideDetails(ride: any) {
    this.router.navigate(['/ride-details', ride.id]);
  }

  async cancelRide(ride: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Cancellation',
      message: 'Are you sure you want to cancel this ride?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Cancelling ride...'
            });
            await loading.present();

            try {
              await this.rideService.cancelRide(ride.id, this.currentUserId).toPromise();
              this.showToast('Ride cancelled successfully');
              await this.loadRides();
            } catch (error) {
              console.error('Error cancelling ride:', error);
              this.showToast('Failed to cancel ride. Please try again.');
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  createRide() {
    this.router.navigate(['/add-ride']);
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'danger';
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'medium';
    }
  }
}
