import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { TaskListComponent } from './features/tasks/task-list/task-list';
import { TaskFormComponent } from './features/tasks/task-form/task-form';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        component: DashboardComponent
    },
    {
        path: 'tasks',
        canActivate: [authGuard],
        children: [
            { path: '', component: TaskListComponent }, // /tasks
            { path: 'new', component: TaskFormComponent }, // /tasks/new
            { path: ':id/edit', component: TaskFormComponent } // /tasks/2/edit
        ]
    }
];
