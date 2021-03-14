import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Campaign } from '../model/campaign.model';

@Injectable({
    providedIn: 'root'
})
export class CampaignDataService {
    //behavior subject to maintain cross component communication on tab changes
    selectedTab = new BehaviorSubject('');

    // maintain state of campaigns across application
    currentCampaigns: Campaign[] = [];

    constructor(private httpClient: HttpClient) { }

    getCampaignData(): Observable<Campaign[]> {
        // reading from static file, in ideal case, this would call an api and fetch data from DB
        return this.httpClient.get<Campaign[]>("assets/campaign-data.json").pipe(
            tap(data => {
                // set campaigns
                this.currentCampaigns = data;
            }));
    }

}