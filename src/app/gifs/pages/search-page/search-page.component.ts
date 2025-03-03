import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  gifsService = inject(GifService);
  gifs: WritableSignal<Gif[]> = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gifsService.searchGifs(query).subscribe((resp) => {
      this.gifs.set(resp);
    });
  }
}
