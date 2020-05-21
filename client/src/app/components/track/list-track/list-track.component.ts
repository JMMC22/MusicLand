import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/models/track';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'app-list-track',
  templateUrl: './list-track.component.html',
  providers: [TrackService]
})
export class ListTrackComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public url;
  public status;
  public tracks: Track[];
  public page;
  public total;
  public pages;
  public next_page;
  public prev_page;
  public query;
  public messsage;

  constructor(private _userService: UserService, private _route: ActivatedRoute, private _router: Router, private _trackService: TrackService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.actualPage();

  }

  actualPage() {
    this._route.params.subscribe(params => {

      let page = +params['page'];


      if (!+params['page']) {
        page = 1;
      }
      this.page = page;

      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }
      //Devolver usuarios
      this.getTracks(page);
    });
  }

  getTracks(page) {
    this._trackService.getTracks(this.token, page).subscribe(response => {
      if (!response.tracks) {
        this.status = 'error';
      } else {
        this.total = response.total;
        this.tracks = response.tracks;
        this.pages = response.pages;
        if (page > this.pages) {
          this._router.navigate(['/tracks/1']);
        }
      }
    }, error => {
      console.log(error);
      this.status = 'error';
    })
  }

  refresh() {
    this.getTracks(1);
  }
  update(track) {
    this._trackService.update(this.token, track).subscribe(response => {
      if (response.track) {
        this.status = "success";
        this.refresh();
      } else {
        this.status = "error"
      }
    }, error => {
      console.log(error)
    })
  }
  pause() {
    let audioPlayer = <HTMLVideoElement> document.getElementById("reproductor");
    audioPlayer.pause();
  }

}
