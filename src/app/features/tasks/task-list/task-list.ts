import { Component, inject, Signal } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  imports: [],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent {
  totalTasksCount: number = 0;
  completedTasksCount: number = 0;
  taskService = inject(TaskService);
  tasks = this.taskService.tasks;
  isFiltered: boolean = false;
}
