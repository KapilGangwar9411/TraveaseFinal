import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'

@Component({
  selector: 'app-rate-ride-taker',
  templateUrl: './rate-ride-taker.page.html',
  styleUrls: ['./rate-ride-taker.page.scss'],
})
export class RateRideTakerPage implements OnInit {
  ratingIcon1 = false;
  ratingIcon2 = false;
  ratingIcon3 = false;
  ratingIcon4 = false;
  ratingIcon5 = false;
  ratingIcon6 = false;
  ratingIcon7 = false;
  ratingIcon8 = false;
  ratingIcon9 = false;
  ratingIcon10 = false;
  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  toggleRatingIcon1() {
    this.ratingIcon1 = !this.ratingIcon1;
  }
  toggleRatingIcon2() {
    this.ratingIcon2 = !this.ratingIcon2;
  }
  toggleRatingIcon3() {
    this.ratingIcon3 = !this.ratingIcon3;
  }
  toggleRatingIcon4() {
    this.ratingIcon4 = !this.ratingIcon4;
  }
  toggleRatingIcon5() {
    this.ratingIcon5 = !this.ratingIcon5;
  }
  toggleRatingIcon6() {
    this.ratingIcon6 = !this.ratingIcon6;
  }
  toggleRatingIcon7() {
    this.ratingIcon7 = !this.ratingIcon7;
  }
  toggleRatingIcon8() {
    this.ratingIcon8 = !this.ratingIcon8;
  }
  toggleRatingIcon9() {
    this.ratingIcon9 = !this.ratingIcon9;
  }
  toggleRatingIcon10() {
    this.ratingIcon10 = !this.ratingIcon10;
  }

  tabs() {
    this.navCtrl.navigateRoot(['./tabs']);
  }
}