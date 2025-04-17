import { Component, OnInit, Inject } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG, AppConfig } from './app.config';
import { MyEvent } from 'src/services/myevent.services';
import { Constants } from 'src/models/contants.models';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Helper } from 'src/models/helper.models';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  activePage = 1;
  rtlSide = "left";

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private platform: Platform,
    private navCtrl: NavController,
    private route: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalController: ModalController,
    private translate: TranslateService,
    private myEvent: MyEvent,
    public alertController: AlertController
  ) {
    this.initializeApp();
    this.myEvent.getLanguageObservable().subscribe(value => {
      this.navCtrl.navigateRoot(['./']);
      this.globalize(value);
    });
  }

  ngOnInit() {
    // Component initialization logic
    console.log('App component initialized');
  }

  initializeApp() {
    if (this.config.demoMode && this.platform.is('cordova') && !window.localStorage.getItem(Constants.KEY_IS_DEMO_MODE)) {
      window.localStorage.setItem(Constants.KEY_IS_DEMO_MODE, "true");
      this.language();
    } else {
      this.navCtrl.navigateRoot(['./']);
    }
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.show();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#0fc874');
      let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
      this.globalize(defaultLang as string);
      setTimeout(() => this.splashScreen.hide(), 3000);
      this.darkModeSetting();
      this.route.events.subscribe(value => {
      });
    });
  }

  globalize(languagePriority: string) {
    this.translate.setDefaultLang("en");
    let defaultLangCode = this.config.availableLanguages[0].code;
    this.translate.use(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
    this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case 'iw':
      case 'ar':
        this.rtlSide = "rtl";
        break;
      default:
        this.rtlSide = "ltr";
        break;
    }
  }

  language(): void {
    this.navCtrl.navigateRoot(['./language']);
  }

  darkModeSetting() {
    document.body.setAttribute('class', (Helper.getThemeMode(this.config.defaultThemeMode) == Constants.THEME_MODE_DARK ? 'dark-theme' : 'light-theme'));
  }
}
