import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MOMENT_DATE_FORMATS, MomentDateAdapter } from './shared/common/moment-date-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ManageCampaignComponent } from './manage-campaign/manage-campaign.component';
import { CampaignTabsComponent } from './manage-campaign/campaign-tabs/campaign-tabs.component';
import { CampaignTableComponent } from './manage-campaign/campaign-table/campaign-table.component';
import { PriceModalComponent } from './manage-campaign/campaign-table/price-modal/price-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    ManageCampaignComponent,
    CampaignTabsComponent,
    CampaignTableComponent,
    PriceModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
