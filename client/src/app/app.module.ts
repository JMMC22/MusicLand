import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MomentModule } from 'ngx-moment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserGuard } from './services/user.guard';
import { UserService } from './services/user.service';
import { SongComponent } from './components/song/song.component';
import { SongEditComponent } from './components/song/song-edit/song-edit.component';
import { MainComponent } from './components/messages/main/main.component';
import { CreateMessageComponent } from './components/messages/create-message/create-message.component';
import { ListReceivedComponent } from './components/messages/list-receives/list-received.component';
import { MessageService } from './services/message.service';
import { ListSentComponent } from './components/messages/list-receives/list-sends.component';
import { NgModule } from '@angular/core';
import { ArtistComponent } from './components/artist/artist.component';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
import { EditArtistComponent } from './components/artist/edit-artist/edit-artist.component';
import { TrackComponent } from './components/track/track.component';
import { ListTrackComponent } from './components/track/list-track/list-track.component';
import { SafePipe } from './services/safe.pipe';
import { RoleGuard } from './services/role.guard';
import { FollowsComponent } from './components/follows/follows.component';
import { StadisticsComponent } from './components/stadistics/stadistics.component';
import { StadisticsListComponent } from './components/stadistics/list/stadistics-list.component';
import { StadisticsList7DaysComponent } from './components/stadistics/list_7days/stadistics-list-7Days.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UsersComponent,
    TimelineComponent,
    ProfileComponent,
    SongComponent,
    SongEditComponent,
    MainComponent,
    CreateMessageComponent,
    ListReceivedComponent,
    ListSentComponent,
    ArtistComponent,
    UserEditComponent,
    EditArtistComponent,
    TrackComponent,
    ListTrackComponent,
    SafePipe,
    FollowsComponent,
    StadisticsComponent,
    StadisticsListComponent,
    StadisticsList7DaysComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MomentModule],
  providers: [UserGuard, UserService, MessageService, RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
