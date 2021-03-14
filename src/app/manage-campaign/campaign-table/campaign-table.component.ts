import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { Campaign } from '../../model/campaign.model';
import { CampaignTabs } from '../../shared/enums/enums';
import { CampaignDataService } from '../../services/campaign-data.service';
import { PriceModalComponent } from './price-modal/price-modal.component';

@Component({
  selector: 'app-campaign-table',
  templateUrl: './campaign-table.component.html',
  styleUrls: ['./campaign-table.component.css']
})
export class CampaignTableComponent implements OnInit {
  public datasource = new MatTableDataSource<Campaign>();

  // to set tab subscription so that it can be unsubscribed on component destroy to prevent memory leaks
  private tabSubscription: Subscription;
  displayedColumns: string[] = ['date', 'campaign', 'view', 'actions'];

  constructor(private campaignDataService: CampaignDataService, public dialog: MatDialog) { }

  ngOnInit() {
    // read campaign data
    this.campaignDataService.getCampaignData().subscribe((data) => {
      // set upcoming campaigns after data fetch completed
      this.setUpcomingCampaigns();
    });

    // subscribe to tab change behavior object to set the campaign table data accordingly
    this.tabSubscription = this.campaignDataService.selectedTab.subscribe((tab) => {
      switch (tab) {
        case CampaignTabs.Upcoming:
          this.setUpcomingCampaigns();
          break;
        case CampaignTabs.Live:
          this.setLiveCampaigns();
          break;
        case CampaignTabs.Past:
          this.setPastCampaigns();
          break;
        default:
          this.setUpcomingCampaigns();
          break;
      }
    })
  }

  // handle schedule date event - change date in campaign object in service and 
  //  set campaign data in table according to currently selected tab
  onDateChange(id: number) {
    this.campaignDataService.currentCampaigns.find(c => c.id === id).campaignDate = this.getFormattedDate(moment(this.campaignDataService.currentCampaigns.find(c => c.id === id).campaignDate));
    switch (this.campaignDataService.selectedTab.value) {
      case CampaignTabs.Upcoming:
        this.setUpcomingCampaigns();
        break;
      case CampaignTabs.Live:
        this.setLiveCampaigns();
        break;
      case CampaignTabs.Past:
        this.setPastCampaigns();
        break;
      default:
        this.setUpcomingCampaigns();
        break;
    }
  }

  // use difference between current date and campaign date to determine type of campaign
  // using get time and setting sortvalue field as the time difference and sorting accordingly

  setUpcomingCampaigns() {
    const currentTime = this.getCurrentTime();
    if (this.campaignDataService.currentCampaigns) {
      let currentCampaigns = this.campaignDataService.currentCampaigns.slice(0);
      currentCampaigns.forEach((campaign) => {
        campaign.sortValue = new Date(campaign.campaignDate).getTime() - currentTime;
        campaign.dateDiffText = '';
      });
      // get future campaigns and sort in ascending order to show latest upcoming campaign first (sort values will be positive)
      currentCampaigns = currentCampaigns.filter(i => i.sortValue > 0).sort(function (a, b) { return a.sortValue - b.sortValue });
      currentCampaigns.forEach((campaign) => {
        campaign.dateDiffText = this.getDateDiffText(campaign.sortValue / (1000 * 3600 * 24));
      });
      this.datasource.data = currentCampaigns;
    }
  }

  setPastCampaigns() {
    const currentTime = this.getCurrentTime();
    if (this.campaignDataService.currentCampaigns) {
      let currentCampaigns = this.campaignDataService.currentCampaigns.slice(0);
      currentCampaigns.forEach((campaign) => {
        campaign.sortValue = new Date(campaign.campaignDate).getTime() - currentTime;
        campaign.dateDiffText = '';
      });
      // get past campaigns and sort in descending order to show latest passed campaign first (sort values will be negative)
      currentCampaigns = currentCampaigns.filter(i => i.sortValue < 0).sort(function (a, b) { return b.sortValue - a.sortValue });
      currentCampaigns.forEach((campaign) => {
        campaign.dateDiffText = this.getDateDiffText(campaign.sortValue / (1000 * 3600 * 24));
      });
      this.datasource.data = currentCampaigns;
    }
  }

  setLiveCampaigns() {
    const currentTime = this.getCurrentTime();
    if (this.campaignDataService.currentCampaigns) {
      let currentCampaigns = this.campaignDataService.currentCampaigns.slice(0);
      currentCampaigns.forEach((campaign) => {
        campaign.sortValue = new Date(campaign.campaignDate).getTime() - currentTime;
        campaign.dateDiffText = '';
      });
      // get live campaigns with today's date
      currentCampaigns = currentCampaigns.filter(i => i.sortValue === 0);
      this.datasource.data = currentCampaigns;
    }
  }

  openPriceDialog(id: number) {
    const dialogRef = this.dialog.open(PriceModalComponent, {
      width: '250px',
      data: { ...this.campaignDataService.currentCampaigns.find(c => c.id === id) }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // helper function section - can be moved to a utility class for sharing across components
  getFormattedDate(date: Moment) {
    return moment(date).format('YYYY-MM-DD');
  }

  getCurrentTime(): number {
    const today = new Date();
    const date = today.getFullYear() + '-' + ((today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1)) + '-' + today.getDate();
    return new Date(date).getTime();
  }

  // get date difference text for upcoming and past events
  getDateDiffText(days: number): string {
    if (days > 0) {
      return days + (days > 1 ? ' days to go' : ' day to go');
    } else {
      return Math.abs(days) + (Math.abs(days) > 1 ? ' days ago' : ' day ago');
    }
  }

  //helper function end

  alertText(text: string) {
    window.alert(text);
  }

  ngOnDestroy() {
    // unsubscribe subscriptions to prevent memory leaks
    this.tabSubscription.unsubscribe();
  }
}
