import { Component, Input, OnInit } from '@angular/core';
import { DashboardModel } from 'src/app/shared/models/DashboardModel/dashboard-model';
import { Request } from 'src/app/shared/models/Request/request';
import { DashboardService } from 'src/app/shared/services/dashboard/dashboard.service';




@Component({
  selector: 'app-header-banner',
  templateUrl: './header-banner.component.html',
  styleUrls: ['./header-banner.component.css']
})
export class HeaderBannerComponent implements  OnInit {

  constructor( private dashboardService: DashboardService) {}

  UserName:string = '';

  requestPaaramModell = new Request();
  dashboardModel = new DashboardModel();

  @Input() headerText: string = '';

  ngOnInit(): void {

    this.getUserID();
  }

  getUserID(){
    this.requestPaaramModell.token = sessionStorage.getItem("authToken");

    this.dashboardService.getUserData(this.requestPaaramModell).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp))

      if (resp.code === 1) {
        this.UserName = resp.data;
        //console.log('da',this.UserName);
      }
    })
  }
}
