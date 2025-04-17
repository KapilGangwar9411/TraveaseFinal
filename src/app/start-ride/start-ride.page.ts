import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-ride',
  templateUrl: './start-ride.page.html',
  styleUrls: ['./start-ride.page.scss'],
})
export class StartRidePage implements OnInit {
  constructor(private route: Router) { }

  ngOnInit() {
  }

  rideRoute() {
    this.route.navigate(['./ride-route']);
  }
 
}
