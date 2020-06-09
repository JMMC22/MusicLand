import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { PublicationService } from 'src/app/services/publication.service';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-stadistics-list-7Days',
  templateUrl: './stadistics-list-7Days.component.html',
  providers: [UserService, PublicationService]
})
export class StadisticsList7DaysComponent implements OnInit {

  public user: User;
  public status;
  public identity;
  public token;
  public stats;
  public url;
  public songsPublicated;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService,
    private _publicationService: PublicationService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.get7DaysSongs()
  }

  get7DaysSongs(){
    this._publicationService.getSongsLast7Days(this.token).subscribe(response=>{
      
      if (response.songs) {
        this.status = "success"
        this.songsPublicated = response.songs;
        console.log(this.songsPublicated)
      } else {
        this.status = "error"
      }
    }, error => {
      console.log(error)
    })
    
  }


}
