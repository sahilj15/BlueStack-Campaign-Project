import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Campaign } from '../model/campaign.model';

@Injectable({
    providedIn: 'root'
})
export class CampaignDataService {
    selectedTab = new BehaviorSubject('');
    currentCampaigns: Campaign[] = [];
    constructor(private httpClient: HttpClient) { }

    getCampaignData(): Observable<Campaign[]> {
        return this.httpClient.get<Campaign[]>("assets/campaign-data.json").pipe(
            tap(data => {
                this.currentCampaigns = data;
            }));
    }

}