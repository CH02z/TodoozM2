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
  selectedTask: Task = new Task();

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
    return this.db.collection('users').doc(this.uid).collection('tasks');
  }

  CreateTask(task: Task): void {
    console.log(task);
    if (task.name !== undefined) {
      const newTask: Task = {name: task.name,
                            endDate: task.endDate,
                            category: task.category,
                            isDone: false,
                            description: task.description,
                            dateDefined: new Date(),
                            highPriority: task.highPriority
                          };
      this.db.collection('users').doc(this.uid).collection('tasks').add(newTask);
    }
  }

  DeleteTask(taskID: string): void {
    if (taskID.length !== 0) {
      this.db.collection('users').doc(this.uid + '/' + 'tasks/' + taskID).delete();
    }
  }

}