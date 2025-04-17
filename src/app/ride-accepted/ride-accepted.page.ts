import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ride-accepted',
  templateUrl: './ride-accepted.page.html',
  styleUrls: ['./ride-accepted.page.scss'],
})
export class RideAcceptedPage implements OnInit {
  constructor(private route: Router) { }

  ngOnInit() {
  }


  rideRoute() {
    this.route.navigate(['./ride-route']);
  }
}
