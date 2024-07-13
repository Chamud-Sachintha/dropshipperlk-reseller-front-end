import { Component, OnInit } from '@angular/core';
import { ProfitLog } from 'src/app/shared/models/ProfitLog/profit-log';
import { Request } from 'src/app/shared/models/Request/request';
import { ProfitLogService } from 'src/app/shared/services/profit-log/profit-log.service';

@Component({
  selector: 'app-profit-log',
  templateUrl: './profit-log.component.html',
  styleUrls: ['./profit-log.component.css']
})
export class ProfitLogComponent implements OnInit {

  requestParamModel = new Request();
  profitLogDataList: ProfitLog[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;

  constructor(private profitLogService: ProfitLogService) {}

  ngOnInit(): void {
    this.loadProfitLogList();
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    this.loadProfitLogList();
  }

  loadProfitLogList() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");

    this.profitLogService.getProfitLogList(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp))

      if (resp.code === 1) {
        dataList.data[0].forEach((eachData: ProfitLog) => {
          this.profitLogDataList.push(eachData);
        })
      }
    })
  }

}
