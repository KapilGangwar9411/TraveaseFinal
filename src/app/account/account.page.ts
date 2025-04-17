import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from '../app.config';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage {
  constructor(@Inject(APP_CONFIG) public config: AppConfig, private route: Router, private navCtrl: NavController, private modalController: ModalController) { }

  my_profile() {
    this.route.navigate(['./my-profile']);
  }
  wallet() {
    this.route.navigate(['./wallet']);
  }
  my_vehicles() {
    this.route.navigate(['./my-vehicles']);
  }
  manage_address() {
    this.route.navigate(['./manage-address']);
  }
  support() {
    this.route.navigate(['./support']);
  }
  privacy_policy() {
    this.route.navigate(['./privacy-policy']);
  }
  change_language() {
    this.route.navigate(['./language']);
  }
  faqs() {
    this.route.navigate(['./faq']);
  }
  logout() {
    this.navCtrl.navigateRoot(['./sign-in']);
  }
  developed_by() {
    window.open("https://opuslab.works/", '_system', 'location=no');
  }
}
