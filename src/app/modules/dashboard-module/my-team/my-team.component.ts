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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTeam();
  }

  loadTeam() {
    this.requestParamModel.token = sessionStorage.getItem("authtoken");
    
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
