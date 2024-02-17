import { Component, OnInit } from '@angular/core';
import { DashboardModel } from 'src/app/shared/models/DashboardModel/dashboard-model';
import { Request } from 'src/app/shared/models/Request/request';
import { DashboardService } from 'src/app/shared/services/dashboard/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  requestPaaramModell = new Request();
  dashboardModel = new DashboardModel();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.requestPaaramModell.token = sessionStorage.getItem("authToken");

    this.dashboardService.getDashbboardData(this.requestPaaramModell).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp))

      if (resp.code === 1) {
        this.dashboardModel.pendingOrderCount = dataList.data[0].pendingOrderCount;
        this.dashboardModel.inCourierOrderCount = dataList.data[0].inCourierOrderCount;
        this.dashboardModel.completeOrderCount = dataList.data[0].completeOrderCount;
        this.dashboardModel.totalOrders = dataList.data[0].totalOrders;
        this.dashboardModel.cancleOrders = dataList.data[0].cancleOrders;
        this.dashboardModel.totalEarnigs = dataList.data[0].totalEarnigs;
        this.dashboardModel.pendingPayment = dataList.data[0].pendingPayment;
        this.dashboardModel.paidOrders = dataList.data[0].paidOrders;
        this.dashboardModel.refCode = dataList.data[0].refCode;
      }
    })
  }

}
