import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { CampaignTabs } from '../../shared/enums/enums';
import { CampaignDataService } from '../../services/campaign-data.service';

@Component({
  selector: 'app-campaign-tabs',
  templateUrl: './campaign-tabs.component.html',
  styleUrls: ['./campaign-tabs.component.css']
})
export class CampaignTabsComponent implements OnInit {
  @ViewChild('currentTab', { static: true }) currentTab: MatTabGroup;
  constructor(private campaignDataService: CampaignDataService) { }

  ngOnInit(): void {
    this.currentTab.selectedIndex = 0;
  }

  onTabSelect(event: any): void {
    switch (event.index) {
      case 0:
        this.campaignDataService.selectedTab.next(CampaignTabs.Upcoming);
        break;
      case 1:
        this.campaignDataService.selectedTab.next(CampaignTabs.Live);
        break;
      case 2:
        this.campaignDataService.selectedTab.next(CampaignTabs.Past);
        break;
      default:
        this.campaignDataService.selectedTab.next(CampaignTabs.Upcoming);
        break;
    }
  }

}
