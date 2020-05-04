import { TestBed, async } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { SongService } from 'src/app/services/song.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Song } from 'src/app/models/song';
import { Artist } from 'src/app/models/artist';
import { ArtistService } from 'src/app/services/artist.service';

describe('SongService', () => {
  let service: SongService;
  let elemDefault: User;
  let token: string;
  let idArtist;
  let id;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SongService, UserService, ArtistService]
    });
    service = TestBed.inject(SongService);

    elemDefault = new User("", 'admin', 'admin', 'admin@email.com', 'ROLE_ADMIN', "");

    const serviceUser: UserService = TestBed.get(UserService);

    serviceUser.login(elemDefault, true).subscribe(
      (response) => {
        expect(response.token).not.toBeNull();
        localStorage.setItem('token', JSON.stringify(response.token));
        token = JSON.stringify(response.token);

      },
      (error) => { fail(error) }
    );
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));


  it('create song', async(() => {
    const service: SongService = TestBed.get(SongService);
    const serviceArt: SongService = TestBed.get(ArtistService);

    const artista: Artist = new Artist("", "PRUEBA", "2013-12-12", "ESPAÑA", "");

    serviceArt.create(token, artista).subscribe(
      (response) => {
        expect(response.artist).not.toBeNull()
        idArtist = response.artist._id;

      },
      (error) => fail(error)

    );

    const newSong: Song = new Song("", "testing", "2013-12-12", "", idArtist, "spotify:track:1234567890123456789012");

    service.create(token, newSong).subscribe(
      (response) => { expect(response).not.toBeNull(), id = response.song._id; },
      (error) => fail(error)

    );
  }));

  it('update song', async(() => {
    const service: SongService = TestBed.get(SongService);

    const update: Song = new Song(id, "testingACTU", "2013-12-12", "", idArtist, "spotify:track:1234567890123456789012");

    service.update(token, update).subscribe(
      (response) => expect(response).not.toBeNull(),
      (error) => fail(error)

    );
  }));

  it('get all song', async(() => {
    const service: SongService = TestBed.get(SongService);

    service.getAllSongs(token).subscribe(
      (response) => expect(response).not.toBeNull(),
      (error) => fail(error)

    );
  }));

  it('get song', async(() => {
    const service: SongService = TestBed.get(SongService);

    service.getSong(token, id).subscribe(
      (response) => expect(response).not.toBeNull(),
      (error) => fail(error)

    );
  }));

  it('search song', async(() => {
    const service: SongService = TestBed.get(SongService);

    service.search(token, 'testingACTU', 1).subscribe(
      (response) => expect(response).not.toBeNull(),
      (error) => fail(error)

    );
  }));

  it('delete song', async(() => {
    const service: SongService = TestBed.get(SongService);

    service.delete(token, id).subscribe(
      (response) => expect(response).not.toBeNull(),
      (error) => fail(error)

    );

    //Delete artist for this test
    const serviceArt: SongService = TestBed.get(ArtistService);
    serviceArt.delete(token, idArtist).subscribe(
      (response) => expect(response).not.toBeNull(),
      (error) => fail(error)

    );


  }));
});
