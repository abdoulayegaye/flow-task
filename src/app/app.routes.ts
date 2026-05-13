import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { TaskListComponent } from './features/tasks/task-list/task-list';
import { TaskFormComponent } from './features/tasks/task-form/task-form';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: DashboardComponent //LoginComponent --- IGNORE ---
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'tasks',
        children: [
            { path: '', component: TaskListComponent }, // /tasks
            { path: 'new', component: TaskFormComponent }, // /tasks/new
            { path: ':id/edit', component: TaskFormComponent } // /tasks/2/edit
        ]
    }
];
