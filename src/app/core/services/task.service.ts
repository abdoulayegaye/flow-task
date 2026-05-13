import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks: Task[] = [
    { 
      id: crypto.randomUUID(), 
      title: 'Task 1', 
      description: 'Description of Task 1', 
      status: 'done',
      priority: 'high',
      createdAt: new Date()
    },  
    { 
      id: crypto.randomUUID(), 
      title: 'Task 2', 
      description: 'Description of Task 2', 
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date()
    },
    { 
      id: crypto.randomUUID(), 
      title: 'Task 3', 
      description: 'Description of Task 3', 
      status: 'todo',
      priority: 'low',
      createdAt: new Date()
    },
    { 
      id: crypto.randomUUID(), 
      title: 'Task 4', 
      description: 'Description of Task 4', 
      status: 'done',
      priority: 'high',
      createdAt: new Date()
    },
    { 
      id: crypto.randomUUID(), 
      title: 'Task 5', 
      description: 'Description of Task 5', 
      status: 'todo',
      priority: 'low',
      createdAt: new Date()
    },
  ];
} 
