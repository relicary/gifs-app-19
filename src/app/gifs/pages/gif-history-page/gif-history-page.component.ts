import { Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.service';
import { GifListComponent } from '../../components/gif-list/gif-list.component';

@Component({
  selector: 'app-gif-history-page',
  imports: [GifListComponent],
  templateUrl: './gif-history-page.component.html',
})
export default class GifHistoryPageComponent {

  gifService = inject(GifService);

  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map( (params) => params['query'] ?? '')
    )
  );

  gifsByKey = computed(() => {
    return this.gifService.getHistoryGifs(this.query());
  })

}
