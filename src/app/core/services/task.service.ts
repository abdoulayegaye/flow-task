import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, Observable, map, tap } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly _tasks$ = new BehaviorSubject<Task[]>([]);

  readonly tasks$: Observable<Task[]> = this._tasks$.asObservable();
  readonly totalCount$: Observable<number> = this._tasks$.pipe(map(tasks => tasks.length));
  readonly completedCount$: Observable<number> = this._tasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'done').length),
  );
  readonly inProgressCount$: Observable<number> = this._tasks$.pipe(
    map(tasks => tasks.filter(t => t.status === 'in-progress').length),
  );

  constructor() {
    this.http
      .get<Task[]>('/api/tasks')
      .pipe(
        map(tasks => tasks.map(t => ({ ...t, createdAt: new Date(t.createdAt) }))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(tasks => this._tasks$.next(tasks));
  }

  getById(id: string): Task | undefined {
    return this._tasks$.getValue().find(t => t.id === id);
  }

  create(data: Omit<Task, 'id' | 'createdAt'>): Observable<void> {
    const task: Task = { ...data, id: crypto.randomUUID(), createdAt: new Date() };
    return this.http.post<Task>('/api/tasks', task).pipe(
      map(raw => ({ ...raw, createdAt: new Date(raw.createdAt) })),
      tap(created => this._tasks$.next([...this._tasks$.getValue(), created])),
      map(() => void 0),
    );
  }

  update(id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>): Observable<void> {
    if (!this._tasks$.getValue().find(t => t.id === id)) return EMPTY;
    return this.http.patch<Task>(`/api/tasks/${id}`, data).pipe(
      map(raw => ({ ...raw, createdAt: new Date(raw.createdAt) })),
      tap(updated => {
        this._tasks$.next(this._tasks$.getValue().map(t => (t.id === id ? updated : t)));
      }),
      map(() => void 0),
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete(`/api/tasks/${id}`).pipe(
      tap(() => this._tasks$.next(this._tasks$.getValue().filter(t => t.id !== id))),
      map(() => void 0),
    );
  }
} 
