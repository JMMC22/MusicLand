import { TestBed, async } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { ArtistService } from 'src/app/services/artist.service';
import { UserService } from 'src/app/services/user.service';
import { Artist } from 'src/app/models/artist';

describe('ArtistService', () => {
  let service: ArtistService;
  let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZWFlOTY4MDFhMzY1ODQ4MWMxZWE4ODkiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImF2YXRhciI6InVzZXIucG5nIiwiaWF0IjoxNTg4NTAwNjM4LCJleHAiOjE1OTEwOTI2Mzh9.lKVicnGInSnbG10Au_pJpMrWoI2rIDhKSW9TwIRkmSc';
  let id: string;
  let artistaTest;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ArtistService, UserService]
    });
    service = TestBed.inject(ArtistService);


  }));

  it('create  artist', async(() => {
    const service: ArtistService = TestBed.get(ArtistService);

    const artista: Artist = new Artist("", "PRUEBA", "2013-12-12", "ESPAÑA", "");

    service.create(token, artista).subscribe(
      (response) => {
        expect(response.artist).not.toBeNull()
        id = response.artist._id;
        artistaTest = response.artist;
      },
      (error) => fail(error)

    );
  }));


  it('create and update artist', async(() => {
    const service: ArtistService = TestBed.get(ArtistService);

    const expected = new Artist(artistaTest._id, "PRUEBA", "2013-12-12", "ESPAÑOL", "");
    service.update(token, expected).subscribe(
      (response) => expect(response.artist.nombre).toBe("PRUEBA"),
      (error) => fail(error)
    )

  }));

  it('get all artists', async(() => {
    const service: ArtistService = TestBed.get(ArtistService);


    service.getAllArtists(token).subscribe(
      (response) => {
        expect(response.artists).not.toBeNull();

      },
      (error) => fail(error)
    );
  }));

  it('get paginate artists', async(() => {
    const service: ArtistService = TestBed.get(ArtistService);


    service.getArtists(token, 1).subscribe(
      (response) => {
        expect(response.artists).not.toBeNull();
        expect(response.total).toBeGreaterThan(0);

      },
      (error) => fail(error)
    );
  }));

  it('search artist', async(() => {
    const service: ArtistService = TestBed.get(ArtistService);


    service.search(token, 'PRUEBA').subscribe(
      (response) => {
        expect(response.artists).not.toBeNull();
        expect(response.total).toBeGreaterThan(0);
        const artists = response.artists;
        artists.forEach(artist => {
          expect(artist.nombre).toBe('PRUEBA');
        });

      },
      (error) => fail(error)
    );
  }));


  it('get artist', async(() => {
    const service: ArtistService = TestBed.get(ArtistService);


    service.getArtist(token, id).subscribe(
      (response) => {
        expect(response.artist).not.toBeNull();
        expect(response.artist.nombre).toBe('PRUEBA');

      },
      (error) => fail(error)
    );
  }));

  it('delete artist', async(() => {
    const service: ArtistService = TestBed.get(ArtistService);

    service.delete(token, id).subscribe(
      (response) => {
        expect(response.artist).not.toBeNull();
      },
      (error) => fail(error)
    );
  }));
});
