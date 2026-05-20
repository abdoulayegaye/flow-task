import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TaskService } from '../../../core/services/task.service';
import { TaskPriority, TaskStatus } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService); 
  private readonly route = inject(ActivatedRoute);

  protected taskId: string | null = null;
  protected saving = false;

  protected get isEditMode(): boolean {
    return !!this.taskId; 
  }

  protected form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['medium' as TaskPriority],
    status: ['todo' as TaskStatus]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    const task = this.taskService.getById(id);
    if (!task) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.taskId = id;
    
    this.form.setValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status
    });
  }

  submit(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    const value = this.form.getRawValue();
    const operation$ = this.isEditMode
      ? this.taskService.update(this.taskId!, value)
      : this.taskService.create(value);

    operation$.subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => this.saving = false
    });
  }
}
