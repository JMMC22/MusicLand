import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserGuard } from './services/user.guard';
import { SongComponent } from './components/song/song.component';
import { SongEditComponent } from './components/song/song-edit/song-edit.component';
import { MainComponent } from './components/messages/main/main.component';
import { CreateMessageComponent } from './components/messages/create-message/create-message.component';
import { ListReceivedComponent } from './components/messages/list-receives/list-received.component';
import { ListSentComponent } from './components/messages/list-receives/list-sends.component';
import { ArtistComponent } from './components/artist/artist.component';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
import { EditArtistComponent } from './components/artist/edit-artist/edit-artist.component';
import { ListTrackComponent } from './components/track/list-track/list-track.component';
import { RoleGuard } from './services/role.guard';
import { FollowsComponent } from './components/follows/follows.component';



const routes: Routes = [
  { path: '', component: TimelineComponent, canActivate: [UserGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'buscar-gente/:page', component: UsersComponent, canActivate: [UserGuard] },
  { path: 'buscar-gente/:usernameSearch/:page', component: UsersComponent, canActivate: [UserGuard] },
  { path: 'buscar-gente', component: UsersComponent, canActivate: [UserGuard] },
  { path: 'timeline', component: TimelineComponent, canActivate: [UserGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [UserGuard] },
  { path: 'songs/:page', component: SongComponent, canActivate: [UserGuard] },
  { path: 'songs/:query/:page', component: SongComponent, canActivate: [UserGuard] },
  { path: 'songs', component: SongComponent, canActivate: [UserGuard] },
  { path: 'song', component: SongEditComponent, canActivate: [UserGuard, RoleGuard] },
  { path: 'song/:id', component: SongEditComponent, canActivate: [UserGuard, RoleGuard] },
  { path: 'messages', component: MainComponent, canActivate: [UserGuard] },
  { path: 'message', component: CreateMessageComponent, canActivate: [UserGuard] },
  { path: 'messages-received', component: ListReceivedComponent, canActivate: [UserGuard] },
  { path: 'messages-received/:page', component: ListReceivedComponent, canActivate: [UserGuard] },
  { path: 'messages-sent', component: ListSentComponent, canActivate: [UserGuard] },
  { path: 'messages-sent/:page', component: ListSentComponent, canActivate: [UserGuard] },
  { path: 'artists/:page', component: ArtistComponent, canActivate: [UserGuard] },
  { path: 'artists', component: ArtistComponent, canActivate: [UserGuard, RoleGuard] },
  { path: 'artists/:query/:page', component: ArtistComponent, canActivate: [UserGuard] },
  { path: 'artist', component: EditArtistComponent, canActivate: [UserGuard, RoleGuard] },
  { path: 'artist/:id', component: EditArtistComponent, canActivate: [UserGuard, RoleGuard] },
  { path: 'edit-profile', component: UserEditComponent, canActivate: [UserGuard] },
  { path: 'tracks', component: ListTrackComponent, canActivate: [UserGuard, RoleGuard] },
  { path: 'tracks/:page', component: ListTrackComponent, canActivate: [UserGuard, RoleGuard] },
  { path: 'siguiendo/:id/:page', component: FollowsComponent, canActivate: [UserGuard] },
  { path: 'seguidores/:id/:page', component: FollowsComponent, canActivate: [UserGuard] }













];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
