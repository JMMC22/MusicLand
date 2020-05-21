import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SongService } from 'src/app/services/song.service';
import { GLOBAL } from 'src/app/services/global';
import { Song } from 'src/app/models/song';
import { Router, ActivatedRoute } from '@angular/router';
import { ArtistService } from 'src/app/services/artist.service';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  providers: [ArtistService]
})
export class SongEditComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public url;
  public status;
  public song;
  public artists;

  constructor(private _userService: UserService, private _songService: SongService, private _router: Router, private _artistService: ArtistService, private _route: ActivatedRoute) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.song = new Song("", "", "", "", "", "");
  }

  ngOnInit() {
    this.getArtists();
    this.loadSong();
  }

  loadSong() {
    this._route.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this._songService.getSong(this.token, id).subscribe(response => {
          this.song = response.song;
          if (!this.song.url.match('spotify:track:')) {
            this.song.url = 'spotify:track:' + response.song.url;
          }
        }, error => {
          console.log(error)
          this._router.navigate(['/timeline'])
        })
      }
    })
  }

  create() {
    this._songService.create(this.token, this.song).subscribe(
      response => {
        if (response.song && response.song._id) {
          this.status = "success";
          this._router.navigate(['/songs']);

        } else {
          this.status = "error"

        }
      }, error => {
        console.log(error);
      }
    );

  }

  update() {
    this._songService.update(this.token, this.song).subscribe(response => {
      if (response.song && response.song._id) {
        this.status = "success";
        this._router.navigate(['/songs']);

      } else {
        this.status = "error"

      }
    }, error => {
      console.log(error);
    })
  }

  getArtists() {
    this._artistService.getAllArtists(this.token).subscribe(response => {
      if (response.artists) {
        this.artists = response.artists;
      }
    }, error => {
      console.log(error)
    })
  }


}
