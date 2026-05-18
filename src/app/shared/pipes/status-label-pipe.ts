import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../../core/models/task.model';

@Pipe({
  name: 'statusLabel'
})
export class StatusLabelPipe implements PipeTransform {

  private readonly labels: Record<TaskStatus, string> = {
    'todo': 'À faire',
    'in-progress': 'En cours',
    'done': 'Terminée'
  };

  transform(value: TaskStatus): string {
    return this.labels[value] ?? value;
  }

}
