import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoolTakerInfoPage } from '../pool-taker-info/pool-taker-info.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pool-taker-request',
  templateUrl: './pool-taker-request.page.html',
  styleUrls: ['./pool-taker-request.page.scss'],
})
export class PoolTakerRequestPage implements OnInit {

  constructor(private route: Router, private modalController: ModalController) { }

  ngOnInit() {
  }

  // poolTakerInfo() {
  //   this.route.navigate(['./pool-taker-info']);
  // }

  ride_accepted() {
    this.route.navigate(['./ride-accepted']);
  }

  poolTakerInfo() {
    this.modalController.create({ component: PoolTakerInfoPage }).then((modalElement) => modalElement.present());
  }

  itemSection1 = 1;
  rejected1 = 0;
  accepted1 = 0;

  itemSection2 = 1;
  rejected2 = 0;
  accepted2 = 0;

  itemSection3 = 1;
  rejected3 = 0;
  accepted3 = 0;

  decline1() {
    this.itemSection1 = 2;
    this.rejected1 = 1;

  }
  accept1() {
    this.itemSection1 = 2;
    this.accepted1 = 1;
  }

  decline2() {
    this.itemSection2 = 2;
    this.rejected2 = 1;

  }
  accept2() {
    this.itemSection2 = 2;
    this.accepted2 = 1;
  }

  decline3() {
    this.itemSection3 = 2;
    this.rejected3 = 1;

  }
  accept3() {
    this.itemSection3 = 2;
    this.accepted3 = 1;
  }
}
