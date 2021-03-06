import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Task } from '../models/Task';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  uid = '';

  constructor(public authService: AuthService,
              private af: AngularFireAuth,
              private db: AngularFirestore){
    this.af.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
      }
    });
  }

  GetTasks(): AngularFirestoreCollection {
    return this.db.collection('users').doc(this.uid).collection('tasks', ref => ref.orderBy('dateDefined', 'asc'));
  }

  CreateTask(task: Task): void {
    if (task.name !== undefined) {
      const newTask: Task = {name: task.name,
                            endDate: task.endDate,
                            category: task.category,
                            isDone: false,
                            description: task.description,
                            dateDefined: Date.now(),
                            highPriority: task.highPriority
                          };
      this.db.collection('users').doc(this.uid).collection('tasks').add(newTask);
    }
  }

  CheckTask(taskID: string): void {
    this.db.collection('users').doc(this.uid + '/' + 'tasks/' + taskID).update({isDone: true, dateFinished: Date.now()})
  }

  UpdateTask(task: any): void {
    this.db.collection('users').doc(this.uid + '/' + 'tasks/' + task.taskID).update({name: task.name,
                                                                                    endDate: task.endDate,
                                                                                    category: task.category,
                                                                                    highPriority: task.highPriority,
                                                                                    description: task.description})
  }

  DeleteTask(taskID: string): void {
    if (taskID.length !== 0) {
      this.db.collection('users').doc(this.uid + '/' + 'tasks/' + taskID).delete();
    }
  }

}