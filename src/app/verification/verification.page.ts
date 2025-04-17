import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  otp: string = '';
  phoneNumber: string = '';

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.phoneNumber = this.route.snapshot.queryParams['phoneNumber'];
    console.log('Phone number from route params:', this.phoneNumber);
  }

  async verifyOTP() {
    // Clean up OTP input
    const cleanOTP = this.otp ? this.otp.toString().trim() : '';

    console.log('Attempting to verify OTP:', cleanOTP);
    console.log('Phone number:', this.phoneNumber);

    if (!cleanOTP || cleanOTP.length !== 6 || isNaN(Number(cleanOTP))) {
      this.showToast('Please enter a valid 6-digit OTP');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Verifying OTP...'
    });
    await loading.present();

    try {
      const response = await this.authService.verifyOTP(this.phoneNumber, cleanOTP).toPromise();
      console.log('Verification response:', response);

      await loading.dismiss();
      this.showToast('OTP verified successfully!');
      this.navCtrl.navigateRoot(['./tabs']);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      await loading.dismiss();

      // Extract the error message from the response if available
      let errorMessage = 'Invalid OTP. Please try again.';
      if (error && error.error && typeof error.error === 'object' && 'error' in error.error) {
        errorMessage = error.error.error as string;
      }

      this.showToast(errorMessage);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}
