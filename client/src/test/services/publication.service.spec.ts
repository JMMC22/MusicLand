import { TestBed, async } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { PublicationService } from 'src/app/services/publication.service';
import { UserService } from 'src/app/services/user.service';
import { SongService } from 'src/app/services/song.service';
import { Artist } from 'src/app/models/artist';
import { ArtistService } from 'src/app/services/artist.service';
import { Song } from 'src/app/models/song';
import { Publication } from 'src/app/models/publication';

describe('PublicationService', () => {
  let service: PublicationService;
  let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZWFlOTY4MDFhMzY1ODQ4MWMxZWE4ODkiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImF2YXRhciI6InVzZXIucG5nIiwiaWF0IjoxNTg4NTAwNjM4LCJleHAiOjE1OTEwOTI2Mzh9.lKVicnGInSnbG10Au_pJpMrWoI2rIDhKSW9TwIRkmSc';
  let idArtist;
  let idSong;
  let id;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PublicationService, UserService, SongService, ArtistService]
    });
    service = TestBed.inject(PublicationService);
  }));

  it('create publication', async(() => {
    const service: PublicationService = TestBed.get(PublicationService);
    const serviceSong: SongService = TestBed.get(SongService);
    const serviceArt: ArtistService = TestBed.get(ArtistService);

    const artista: Artist = new Artist("", "PRUEBA", "2013-12-12", "ESPAÑA", "");

    serviceArt.create(token, artista).subscribe(
      (response) => {
        expect(response.artist).not.toBeNull()
        idArtist = response.artist._id;

      },
      (error) => fail(error)

    );

    const newSong: Song = new Song("", "testing", "2013-12-12", "", idArtist, "spotify:track:1234567890123456789012");

    serviceSong.create(token, newSong).subscribe(
      (response) => { expect(response).not.toBeNull(), idSong = response.song._id; },
      (error) => fail(error)

    );

    const newPublication: Publication = new Publication("", "testing", null, "", "", idSong);

    service.create(token, newPublication).subscribe(
      (response) => { expect(response).not.toBeNull(), id = response.publication._id },
      (error) => fail(error)

    );
  }));
  it('get publications timeline', async(() => {
    const service: PublicationService = TestBed.get(PublicationService);
    service.getPublicationsTimeline(token, 1).subscribe(
      (response) => { expect(response).not.toBeNull() },
      (error) => fail(error)

    );
  }));

  it('get publications top 3', async(() => {
    const service: PublicationService = TestBed.get(PublicationService);
    service.getTop3PublicationsSongs(token).subscribe(
      (response) => { expect(response).not.toBeNull() },
      (error) => fail(error)

    );
  }));

  it('delete publication', async(() => {
    const service: PublicationService = TestBed.get(PublicationService);
    const serviceSong: SongService = TestBed.get(SongService);
    const serviceArt: ArtistService = TestBed.get(ArtistService);

    service.delete(token, id).subscribe(
      (response) => { expect(response).not.toBeNull() },
      (error) => fail(error)

    );

    serviceSong.delete(token, idSong).subscribe(
      (response) => { expect(response).not.toBeNull() },
      (error) => fail(error)

    );

    serviceArt.delete(token, idArtist).subscribe(
      (response) => {
        expect(response.artist).not.toBeNull()

      },
      (error) => fail(error)

    );






  }));
});
