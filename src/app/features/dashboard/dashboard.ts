import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  
  private readonly taskService = inject(TaskService);

  username = 'Utilisateur';
  totalTasksCount = 0;
  completedTasksCount = 0;
  inProgressTasksCount = 0;

  constructor() {
    combineLatest({
      totalCount: this.taskService.totalCount$,
      completedCount: this.taskService.completedCount$,
      inProgressCount: this.taskService.inProgressCount$,
    })
      .subscribe(({ totalCount, completedCount, inProgressCount }) => {
        this.totalTasksCount = totalCount;
        this.completedTasksCount = completedCount;
        this.inProgressTasksCount = inProgressCount;
      });
  }
}
