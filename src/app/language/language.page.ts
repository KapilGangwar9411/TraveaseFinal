import { Component, OnInit, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../app.config';
import { MyEvent } from 'src/services/myevent.services';
import { Constants } from 'src/models/contants.models';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  defaultLanguageCode;
  languages!: Array<{ code: string; name: string; }>;

  constructor(@Inject(APP_CONFIG) public config: AppConfig, private myEvent: MyEvent) {
    this.defaultLanguageCode = config.availableLanguages[0].code;
    let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
    if (defaultLang) this.defaultLanguageCode = defaultLang;
  }

  ngOnInit() {
    this.defaultLanguageCode = this.config.availableLanguages[0].code;
    this.languages = this.config.availableLanguages;
    let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
    if (defaultLang) this.defaultLanguageCode = defaultLang;
  }

  onLanguageClick(language: { code: string; }) {
    this.defaultLanguageCode = language.code;
  }

  languageConfirm() {
    window.localStorage.setItem(Constants.KEY_DEFAULT_LANGUAGE, this.defaultLanguageCode);
    this.myEvent.setLanguageData(this.defaultLanguageCode);
  }

}
