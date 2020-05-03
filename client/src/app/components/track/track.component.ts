import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackService } from 'src/app/services/track.service';
import { GLOBAL } from 'src/app/services/global';
import { Track } from 'src/app/models/track';
import { Publication } from 'src/app/models/publication';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public url;
  public status;
  public tracks: Track[];
  public publication;
  public page;
  public total;
  public pages;


  constructor(private _userService: UserService, private _trackService: TrackService, private _route: ActivatedRoute,
    private _router: Router, private _publicationService: PublicationService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.publication = new Publication("", "", "", "", this.identity, "");
    this.page = 1;
  }

  ngOnInit() {
    this.getMyTracks(this.page);
  }

  getMyTracks(page, adding = false) {
    this._trackService.getMyTracks(this.token, page).subscribe(
      response => {
        if (response.tracks) {
          this.total = response.total;
          this.pages = response.pages;

          if (!adding) {
            this.tracks = response.tracks;

          } else {
            var pubA = this.tracks;
            var pubB = response.tracks;

            this.tracks = pubA.concat(pubB);

            $("html,body").animate({ scrollTop: $('body').prop("scrollHeight") }, 500);
          }

        } else {
          this.status = 'error';
        }
      }, error => {
        console.log(error);
      })
  }

  onSubmit(form, trackId) {
    this.publication.file = trackId;
    console.log(this.publication)
    this._publicationService.create(this.token, this.publication).subscribe(
      response => {
        console.log(response)
        if (response.publication) {
          this.status = "success";

        } else {
          this.status = "error"
        }
      }, error => {
        console.log(error);
      }
    )
  }

  public noMore = false;
  viewMore() {
    this.page += 1;

    if (this.page == this.pages) {
      this.noMore = true;
    }

    this.getMyTracks(this.page, true);
  }

  public reproductor;
  getReproductor() {
    let audioPlayer = <HTMLVideoElement>document.getElementById("reproductor");
    console.log(audioPlayer)
    console.log(this.reproductor)

    if (this.reproductor != audioPlayer) {
      this.reproductor.pause();
      this.reproductor = audioPlayer;
    } else {
      this.reproductor = audioPlayer;
    }

  }

}
