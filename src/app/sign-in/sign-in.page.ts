import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  phoneNumber: string = '';

  constructor(
    private route: Router,
    private navCtrl: NavController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async sendOTP() {
    if (!this.phoneNumber) {
      this.showToast('Please enter your phone number');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Sending OTP...'
    });
    await loading.present();

    try {
      await this.authService.sendOTP(this.phoneNumber).toPromise();
      await loading.dismiss();
      this.route.navigate(['./verification'], {
        queryParams: { phoneNumber: this.phoneNumber }
      });
    } catch (error) {
      await loading.dismiss();
      this.showToast('Failed to send OTP. Please try again.');
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
