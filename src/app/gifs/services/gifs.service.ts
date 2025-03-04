import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '@environments/environment.development';
import type { GiphyItem, GiphyResponse } from '../interfaces/giphy.interface';
import type { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);

  return gifs;
};

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading: WritableSignal<boolean> = signal(true);

  trendingGifGroup = computed<Gif[][]>( () => {
    const groups = [];

    for( let i = 0; i < this.trendingGifs().length; i+=3) {
      groups.push(this.trendingGifs().slice(i , i+3));
    }

    console.log({groups})

    return groups;
  });

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() =>
    Object.keys(this.searchHistory())
  );

  constructor() {
    this.loadTrendingGifs();
   }

  saveGifsToLocalStorage = effect( () => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
      }
    })
    .subscribe( (resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
    });
  }

  searchGifs( query: string): Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: 20,
      }
    }).pipe(
      map<GiphyResponse, GiphyItem[]>( ({ data }) =>  data),
      map<GiphyItem[], Gif[]>( ( items ) =>  GifMapper.mapGiphyItemsToGifArray(items)),

      tap( items => {
        this.searchHistory.update( history =>
          (
            {
              ...history,
              [query.toLowerCase()]: items,
            }
          )
        );
      }),
    );

  }

  getHistoryGifs( query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }

}
