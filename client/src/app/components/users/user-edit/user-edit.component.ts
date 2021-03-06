import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';
import { UploadService } from 'src/app/services/upload.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  providers: [UploadService]
})
export class UserEditComponent implements OnInit {

  public identity;
  public token;
  public url;
  public status;
  public user;
  public avatar;
  public filesToUpload: Array<File>;



  constructor(private _route: ActivatedRoute, private _router: Router,
    private _userService: UserService, private _uploadService: UploadService, private _location: Location) {
    this.identity = this._userService.getIdentity();
    this.user = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {


  }

  onSubmit() {
    this._userService.updateUser(this.user).subscribe(response => {
      if (!response.user) {
        if (response.message == "Los datos ya están en uso.") {
          this.status = "registrado"
        } else {
          this.status = "error"
        }
      } else {
        localStorage.setItem('identity', JSON.stringify(this.user));
        this.identity = this.user;

        //Subida imagenes
        if (this.filesToUpload != undefined) {
          this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
            .then((result: any) => {
              this.user.avatar = result.user.avatar;
              this.status = "success"
              localStorage.setItem('identity', JSON.stringify(this.user));
            }).catch((err) => {
              console.log(err);

              this.status = "error"
            })
        } else {
          this.status = "success"

        }


      }
    }, error => {
      console.log(error)
    })
  }


  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;

    if (!(/([/|.|\w|\s|-])*\.(?:jpg|png|jpeg)/.test(this.filesToUpload[0].name))) {
      this.status = "errorRegex"
    } else {
      this.status = "";
    }

  }

  atras() {
    this._location.back();
  }
}
