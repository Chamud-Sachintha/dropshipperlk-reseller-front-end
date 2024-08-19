import { Component, OnInit } from '@angular/core';
import { MyTeam } from 'src/app/shared/models/MyTeam/my-team';
import { Request } from 'src/app/shared/models/Request/request';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.css']
})
export class MyTeamComponent implements OnInit {

  requestParamModel = new Request();
  myTeamList: MyTeam[] = [];
  searchText = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;

  filteredOrderRequestList: MyTeam[] = [];
  

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTeam();
    this.filteredOrderRequestList = this.myTeamList; 
  }

  filterOrderRequestList() {
    if (!this.searchText) {
      this.filteredOrderRequestList = this.myTeamList; // Reset to the original data if search text is empty
    } else {
      const searchTextLower = this.searchText.toLowerCase();
      this.filteredOrderRequestList = this.myTeamList.filter(order =>
        Object.values(order).some(value =>
          value ? value.toString().toLowerCase().includes(searchTextLower) : false
        )
      );
    }
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    // this.loadTeam();
  }

  loadTeam() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    
    this.authService.getTeam(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code == 1) {
        dataList.data[0].forEach((eachData: MyTeam) => {
          this.myTeamList.push(eachData)
        })
      }
    })
  }

}
