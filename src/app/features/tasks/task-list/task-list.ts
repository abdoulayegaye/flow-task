import { Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Task, TaskPriority, TaskStatus } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { StatusLabelPipe } from '../../../shared/pipes/status-label-pipe';
import { PriorityLabelPipe } from "../../../shared/pipes/priority-label-pipe";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink, StatusLabelPipe, PriorityLabelPipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent {
  private readonly taskService = inject(TaskService);

  tasks: Task[] = [];
  totalCount = 0;
  completedCount = 0;
  confirmDeleteId: string | null = null;

  searchQuery = '';
  selectedStatus: TaskStatus | null = null;
  selectedPriority: TaskPriority | null = null;

  readonly pageSize = 5;
  currentPage = 1;

  get filteredTasks(): Task[] {
    let result = this.tasks;
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      );
    }
    if (this.selectedStatus) 
      result = result.filter(t => t.status === this.selectedStatus);

    if (this.selectedPriority) 
      result = result.filter(t => t.priority === this.selectedPriority);

    return result;
  }

  get pagedTasks(): Task[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTasks.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredTasks.length / this.pageSize));
  }

  get isFiltered(): boolean {
    return !!this.searchQuery.trim() || !!this.selectedStatus || !!this.selectedPriority;
  }

  constructor() {
    combineLatest({
      tasks: this.taskService.tasks$,
      totalCount: this.taskService.totalCount$,
      completedCount: this.taskService.completedCount$,
    })
      .subscribe(({ tasks, totalCount, completedCount }) => {
        this.tasks = tasks;
        this.totalCount = totalCount;
        this.completedCount = completedCount;
        this.clampPage();
      });
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
  }

  setStatusFilter(status: TaskStatus | null): void {
    this.selectedStatus = status;
    this.currentPage = 1;
  }

  setPriorityFilter(priority: TaskPriority | null): void {
    this.selectedPriority = priority;
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  requestDelete(id: string): void {
    this.confirmDeleteId = id;
  }

  confirmDelete(id: string): void {
    this.taskService.remove(id).subscribe(() => {
      this.confirmDeleteId = null;
    });
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  private clampPage(): void {
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  }
}
