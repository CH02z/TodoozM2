import { Pipe, PipeTransform } from '@angular/core';
import { Task } from './models/Task';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(tasks: Task[], searchTerm: string) {
    if (!tasks || !searchTerm) {
      return tasks;
    }
    return tasks.filter(task =>
        task.name?.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
      }
}
