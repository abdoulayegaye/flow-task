import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  username: string = 'Abdoulaye';
  totalTasksCount: number = 0;
  completedTasksCount: number = 0;
  inProgressTasksCount: number = 0;
}
