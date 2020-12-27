import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { CategoryService } from 'src/app/Services/category.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Category } from 'src/app/models/Category';
import { Task } from 'src/app/models/Task';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  email: string | null = '';
  categorys?: Category[];
  tasks?: Task[];
  modalRef?: BsModalRef;
  searchTerm?: string;


  constructor(public authService: AuthService,
              private router: Router,
              public af: AngularFireAuth,
              private categoryService: CategoryService,
              private taskService: TaskService,
              private modalService: BsModalService,) {
    this.af.authState.subscribe(user => {
      if (user) {
        this.email = user.email;
        this.categorys = [];
        this.tasks = [];
        this.getCategorys();
        this.getTasks();
      }
    });
  }

  ngOnInit(): void {
  }

  getCategorys(): void {
    let tempCategorys: Category[] = [];
    this.categoryService.GetCategorys().snapshotChanges().subscribe(category => {
      category.forEach(element => {
        const y = element.payload.doc.data();
        y['id'] = element.payload.doc.id;
        tempCategorys.push(y as Category);
      });
      this.categorys = tempCategorys;
      tempCategorys = []; //reset temp categorys
    });
  }

  getTasks(): void {
    let tempTasks: Task[] = [];
    this.taskService.GetTasks().snapshotChanges().subscribe(category => {
      category.forEach(element => {
        const y = element.payload.doc.data();
        y['id'] = element.payload.doc.id;
        tempTasks.push(y as Task);
      });
      this.tasks = tempTasks;
      tempTasks = []; //reset temp tasks
    });
  }

  onCheck(taskID: string | undefined) {
    setTimeout(() => {
      if (taskID) {
        this.taskService.CheckTask(taskID);
      }
    }, 800);
  }

  containsHighPriority(): boolean {
    let containsHighPriority = false;
    if (this.tasks?.length !== 0 && this.tasks) {
      this.tasks.forEach(element => {
        if (element.highPriority && !element.isDone) {
          containsHighPriority = true;
        }
      });
    }
    return containsHighPriority;
  }

  categoryIsUsed(category: string | undefined): boolean {
    let usedCategorys: string[] = [];
    if (this.tasks?.length !== 0 && this.tasks && this.categorys) {
      this.tasks.forEach(task => {
        if (!task.isDone && !task.highPriority) {
          if (task.category) {
            if (!usedCategorys.includes(task.category)) {
              usedCategorys.push(task.category as string)
            }
          }
        }
      });
    }
    let returnbool = false;
    if (category) {
      returnbool = usedCategorys.includes(category) ? true : false;
    }
    return returnbool;
    
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal(status: string): void {
    if (status == 'hide') {
      this.modalRef?.hide();
    }
  }

}
