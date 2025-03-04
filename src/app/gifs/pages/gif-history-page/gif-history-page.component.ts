import { Component, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'
import { map } from 'rxjs';

@Component({
  selector: 'app-gif-history-page',
  imports: [],
  templateUrl: './gif-history-page.component.html',
})
export default class GifHistoryPageComponent {

  query: Signal<string|undefined> = toSignal<string>(
    inject(ActivatedRoute).params.pipe(
      map( params => params['query'])
    )
  )
}
