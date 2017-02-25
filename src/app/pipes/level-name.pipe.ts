import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'levelName'})
export class LevelNamePipe implements PipeTransform {
  transform(value: number): string {
    let level = '';
    switch (value) {
      case 0 : level = 'read'; break;
      case 1 : level = 'write'; break;
      default: level = 'unknown';
    }
    return level;
  }
}
