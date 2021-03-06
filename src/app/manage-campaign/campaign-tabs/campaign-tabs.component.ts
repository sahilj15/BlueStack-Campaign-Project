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
  // view child to get instance of tab group and static true to get access in oninit
  @ViewChild('currentTab', { static: true }) currentTab: MatTabGroup;

  constructor(private campaignDataService: CampaignDataService) { }

  ngOnInit(): void {
    this.currentTab.selectedIndex = 0;
  }

  //handle campaign type tab change event and accordingly trigger rendering of table data using behavior object
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
