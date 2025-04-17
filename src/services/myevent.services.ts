import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'; // For rxjs 6
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MyEvent {
    private selectedLanguage = new Subject<string>();

    constructor(private http: HttpClient) { }

    public getLanguageObservable(): Observable<string> {
        return this.selectedLanguage.asObservable();
    }

    public setLanguageData(data: string) {
        this.selectedLanguage.next(data);
    }
    public getCountries(): Observable<Array<any>> {
        return this.http.get<Array<any>>('./assets/json/countries.json').pipe(
            tap(data => {
                let indiaIndex = -1;
                // if (data) {
                //   for (let i = 0; i < data.length; i++) {
                //     if (data[i].name == "India") {
                //       indiaIndex = i;
                //       break;
                //     }
                //   }
                // }
                if (indiaIndex != -1) data.unshift(data.splice(indiaIndex, 1)[0]);
            })
        );
    }
}