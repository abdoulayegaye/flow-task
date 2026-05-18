import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../core/models/task.model';

@Pipe({
  name: 'priorityLabel'
})
export class PriorityLabelPipe implements PipeTransform {

  private readonly labels: Record<TaskPriority, string> = {
      'low': 'Faible',
      'medium': 'Moyenne',
      'high': 'Élevée'
    };
  
    transform(value: TaskPriority): string {
      return this.labels[value] ?? value;
    }

}
