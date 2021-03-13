import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  private tabSubscription: Subscription;
  displayedColumns: string[] = ['date', 'campaign', 'view', 'actions'];

  campaignData: Campaign[] = null;
  constructor(private campaignDataService: CampaignDataService, public dialog: MatDialog) { }
  ngOnInit() {
    this.campaignDataService.getCampaignData().subscribe((data) => {
      this.getUpcomingCampaigns();
    });

    this.tabSubscription = this.campaignDataService.selectedTab.subscribe((tab) => {
      switch (tab) {
        case CampaignTabs.Upcoming:
          this.getUpcomingCampaigns();
          break;
        case CampaignTabs.Live:
          this.getLiveCampaigns();
          break;
        case CampaignTabs.Past:
          this.getPastCampaigns();
          break;
        default:
          this.getUpcomingCampaigns();
          break;
      }
    })
  }

  onDateChange(id: number) {
    this.campaignDataService.currentCampaigns.find(c => c.id === id).campaignDate = this.getFormattedDate(moment(this.campaignDataService.currentCampaigns.find(c => c.id === id).campaignDate));
    console.log(this.campaignDataService.currentCampaigns);
    switch (this.campaignDataService.selectedTab.value) {
      case CampaignTabs.Upcoming:
        this.getUpcomingCampaigns();
        break;
      case CampaignTabs.Live:
        this.getLiveCampaigns();
        break;
      case CampaignTabs.Past:
        this.getPastCampaigns();
        break;
      default:
        this.getUpcomingCampaigns();
        break;
    }
  }

  getFormattedDate(date: Moment) {
    return moment(date).format('YYYY-MM-DD');
  }

  getUpcomingCampaigns() {
    const today = new Date();
    const date = today.getFullYear() + '-' + ((today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1)) + '-' + today.getDate();
    const currentTime = new Date(date).getTime();
    let currentCampaigns = this.campaignDataService.currentCampaigns.slice(0);
    currentCampaigns.forEach((campaign) => {
      campaign.sortValue = new Date(campaign.campaignDate).getTime() - currentTime;
      campaign.dateDiffText = '';
    });
    currentCampaigns = currentCampaigns.filter(i => i.sortValue > 0).sort(function (a, b) { return a.sortValue - b.sortValue });
    currentCampaigns.forEach((campaign) => {
      campaign.dateDiffText = campaign.sortValue / (1000 * 3600 * 24) + ' days to go';
    });
    this.datasource.data = currentCampaigns;
  }

  getPastCampaigns() {
    const today = new Date();
    const date = today.getFullYear() + '-' + ((today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1)) + '-' + today.getDate();
    const currentTime = new Date(date).getTime();
    let currentCampaigns = this.campaignDataService.currentCampaigns.slice(0);
    currentCampaigns.forEach((campaign) => {
      campaign.sortValue = new Date(campaign.campaignDate).getTime() - currentTime;
      campaign.dateDiffText = '';
    });
    currentCampaigns = currentCampaigns.filter(i => i.sortValue < 0).sort(function (a, b) { return b.sortValue - a.sortValue });
    currentCampaigns.forEach((campaign) => {
      campaign.dateDiffText = Math.abs(campaign.sortValue / (1000 * 3600 * 24)) + ' days ago';
    });
    this.datasource.data = currentCampaigns;
  }

  getLiveCampaigns() {
    const today = new Date();
    const date = today.getFullYear() + '-' + ((today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1)) + '-' + today.getDate();
    const currentTime = new Date(date).getTime();
    let currentCampaigns = this.campaignDataService.currentCampaigns.slice(0);
    currentCampaigns.forEach((campaign) => {
      campaign.sortValue = new Date(campaign.campaignDate).getTime() - currentTime;
    });
    currentCampaigns = currentCampaigns.filter(i => i.sortValue === 0);
    this.datasource.data = currentCampaigns;
  }

  openPriceDialog(id: number) {
    const dialogRef = this.dialog.open(PriceModalComponent, {
      width: '250px',
      data: { ...this.campaignDataService.currentCampaigns.find(c => c.id === id) }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy() {
    this.tabSubscription.unsubscribe();
  }
}
