import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular'
import Swiper from 'swiper'

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  swiper!: Swiper;
  segment: string = "0"
  
  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  logout() {
    this.navCtrl.navigateRoot(['./sign-in']);
  }

  onSegmentChange(event: any) {
    const selectedIndex = event.detail.value;
    (<any>document.getElementById("swiper4")).swiper.slideTo(selectedIndex);
  }

  onSlideChange(event: any) {
    this.segment = `${(<any>document.getElementById("swiper4")).swiper.activeIndex}`;
  }
}
