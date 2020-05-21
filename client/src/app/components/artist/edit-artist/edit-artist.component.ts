import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ArtistService } from 'src/app/services/artist.service';
import { Artist } from 'src/app/models/artist';
import { GLOBAL } from 'src/app/services/global';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-edit-artist',
  templateUrl: './edit-artist.component.html',
  providers: [ArtistService]
})
export class EditArtistComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public url;
  public status;
  public artist;

  constructor(private _userService: UserService, private _router: Router, private _artistService: ArtistService, private _route: ActivatedRoute) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.artist = new Artist("", "", "", "", "");
  }

  ngOnInit() {

    this.loadArtist();

  }

  create() {
    if (this.artist.fechaNacimiento > formatDate(new Date(), 'yyyy', 'en')) {
      this.status = "errorFecha"
    } else {
      this._artistService.create(this.token, this.artist).subscribe(
        response => {
          if (response.artist && response.artist._id) {
            this.status = "success";
            this._router.navigate(['/artists']);

          } else {
            if (response.message == "El artista ya está registrado.") {
              this.status = "registrado"
            } else {
              this.status = "error"
            }

          }
        }, error => {
          console.log(error);
        }

      );
    }

  }



  loadArtist() {

    this._route.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this._artistService.getArtist(this.token, id).subscribe(response => {
          this.artist = response.artist;
        }, error => {
          console.log(error)
          this._router.navigate(['/artists'])
        })
      }
    })
  }

  update() {
    if (this.artist.fechaNacimiento > formatDate(new Date(), 'yyyy', 'en')) {
      this.status = "errorFecha"
    } else {
      this._artistService.update(this.token, this.artist).subscribe(response => {
        if (response.artist && response.artist._id) {
          this.status = "success";
          this._router.navigate(['/artists']);

        } else {
          if (response.message == "El artista ya está registrado.") {
            this.status = "registrado"
          } else {
            this.status = "error"
          }

        }
      }, error => {
        console.log(error);
      })
    }

  }

}

