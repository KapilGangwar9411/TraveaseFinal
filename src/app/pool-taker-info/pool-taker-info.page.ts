import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GestureDetail, ModalController } from '@ionic/angular';
import { Gesture, GestureController } from '@ionic/angular';

@Component({
  selector: 'app-pool-taker-info',
  templateUrl: './pool-taker-info.page.html',
  styleUrls: ['./pool-taker-info.page.scss'],
})
export class PoolTakerInfoPage implements OnInit {
  viewType!: string;
  swipeGesture!: Gesture;
  @ViewChild('contentElement', { static: true, read: ElementRef })
  contentElement!: ElementRef;
  platform: any;
  constructor(private gestureController: GestureController, private ref: ChangeDetectorRef, private route: Router, private modalController: ModalController) { }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.swipeGesture.destroy();
  }


  dismiss() {
    this.modalController.dismiss();
  }

  ionViewDidEnter() {
    this.swipeGesture = this.gestureController.create({
      el: this.contentElement.nativeElement,
      direction: 'y',
      gestureName: 'swipe',
      // onStart: (detail) => this.swipeStart(detail),
      onEnd: (detail) => this.swipeEvent(detail)
    });
    this.swipeGesture.enable();
  }

  swipeEvent(detail: GestureDetail) {
    this.ref.detectChanges();
    console.log(detail)
    var d = document.getElementById('content-inner');
    // d.style.top = '350px'; 
    if (detail.velocityX > 0) {
      this.modalController.dismiss();
    }
    else if (detail.velocityY > 0) {
    }

  }


  join_ride() {
    this.route.navigate(['./pooling-confirmed']);
  }
  conversation() {
    this.route.navigate(['./conversation']);
  }
  ride_accepted() {
    this.route.navigate(['./ride-accepted']);
  }


}
