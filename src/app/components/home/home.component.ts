import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { CategoryService } from 'src/app/Services/category.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Category } from 'src/app/models/Category';
import { TaskService } from 'src/app/Services/task.service';
import { Task } from 'src/app/models/Task';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  email: string | null = '';
  categorys?: Category[];
  tasks?: Task[];
  detailTask: Task = {} as Task;
  showEditForm: boolean = false;
  modalRef?: BsModalRef;
  searchTerm?: string;
  formTask?: Task;
  selectedCategory?: string;
  chevDirection: boolean = true; //direction of chevron icon from done tasks button


  constructor(public authService: AuthService,
              public af: AngularFireAuth,
              private categoryService: CategoryService,
              private taskService: TaskService,
              private modalService: BsModalService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.af.authState.subscribe(user => {
      if (user) {
        this.email = user.email;
        this.categorys = [];
        this.tasks = [];
        this.getCategorys();
        
        this.getTasks();
      }
    })
  }

  getCategorys(): void {
    let tempCategorys: Category[] = [];
    this.categoryService.GetCategorys().snapshotChanges().
    subscribe(category => {
      category.forEach(element => {
        const y = element.payload.doc.data();
        y['id'] = element.payload.doc.id;
        tempCategorys.push(y as Category);
      });
      this.categorys = tempCategorys;
      tempCategorys = []; //reset temp categorys
    })
  }

  getTasks(): void {
    let tempTasks: Task[] = [];
    this.taskService.GetTasks().snapshotChanges().
    subscribe(category => {
      category.forEach(element => {
        const y = element.payload.doc.data();
        y['id'] = element.payload.doc.id;
        tempTasks.push(y as Task);
      });
      this.tasks = tempTasks;
      tempTasks = []; //reset temp tasks
    })
  }

  onCategoryModified(name: string): void {
    if (this.categorys) {
      this.categorys.forEach(cat => {
        if (cat.name == name) {
          if (cat.id) {
            this.categoryService.ModifiyCategory(cat.id);
          }
        }
      })
    }
  }

  onCheck(taskID: string | undefined) {
    setTimeout(() => {
      if (taskID) {
        this.taskService.CheckTask(taskID);
      }
    }, 800);
  }

  onDelete(taskID: string | undefined): void {
    if (taskID) {
      this.taskService.DeleteTask(taskID);
    }
  }

  openTaskDetail(task: Task): void {
    this.detailTask = Object.assign({}, task)
  }

  hideForm(status: string): void {
    if (status === 'hide') {
      this.detailTask  = {} as Task;
      this.showEditForm = false;
    }
  }

  taskEndsToday(endDate: string | undefined): boolean {
    let stringMonth = "";
    let stringDay = "";
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + 1);
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    if (month.toString().length == 1) {
      stringMonth = "0" + month.toString();
    } else {
      stringMonth = stringMonth + month;
    }
    const day = dateObj.getUTCDate();
    if (day.toString().length == 1) {
      stringDay = "0" + day.toString();
    } else {
      stringDay = stringDay + day;
    }
    const year = dateObj.getUTCFullYear();
    const today = year + "-" + stringMonth + "-" + stringDay;
    return today == endDate ? true : false;
  }

  containsEndingToday(): boolean {
    let containsEndingToday = false;
    if (this.tasks?.length !== 0 && this.tasks) {
      this.tasks.forEach(element => {
        let stringMonth = "";
        let stringDay = "";
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + 1);
        const month = dateObj.getUTCMonth() + 1; //months from 1-12
        if (month.toString().length == 1) {
          stringMonth = "0" + month.toString();
        } else {
          stringMonth = stringMonth + month;
        }
        const day = dateObj.getUTCDate();
        if (day.toString().length == 1) {
          stringDay = "0" + day.toString();
        } else {
          stringDay = stringDay + day;
        }
        const year = dateObj.getUTCFullYear();
        const today = year + "-" + stringMonth + "-" + stringDay;
        if (element.endDate == today && !element.isDone) {
          containsEndingToday = true;
        }
      });
    }
    return containsEndingToday;
  }

  containsHighPriority(): boolean {
    let containsHighPriority = false;
    if (this.tasks?.length !== 0 && this.tasks) {
      this.tasks.forEach(element => {
        if (element.highPriority &&
            !element.isDone &&
            !this.taskIsOverdue(element.endDate) &&
            !this.taskEndsToday(element.endDate)) {
          containsHighPriority = true;
        }
      });
    }
    return containsHighPriority;
  }

  taskIsOverdue(endDate: string | undefined): boolean {
    let stringMonth = "";
    let stringDay = "";
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    if (month.toString().length == 1) {
      stringMonth = "0" + month.toString();
    } else {
      stringMonth = stringMonth + month;
    }
    const day = dateObj.getUTCDate();
    if (day.toString().length == 1) {
      stringDay = "0" + day.toString();
    } else {
      stringDay = stringDay + day;
    }
    const year = dateObj.getUTCFullYear();
    const today = year + "-" + stringMonth + "-" + stringDay;
    if (endDate) {
      return today >= endDate ? true : false;
    } else {
      return false;
    }
    
  }

  containsOverdueTask(): boolean {
    let containsOverdueTask = false;
    if (this.tasks?.length !== 0 && this.tasks) {
      this.tasks.forEach(element => {
        let stringMonth = "";
        let stringDay = "";
        const dateObj = new Date();
        const month = dateObj.getUTCMonth() + 1; //months from 1-12
        if (month.toString().length == 1) {
          stringMonth = "0" + month.toString();
        } else {
          stringMonth = stringMonth + month;
        }
        const day = dateObj.getUTCDate();
        if (day.toString().length == 1) {
          stringDay = "0" + day.toString();
        } else {
          stringDay = stringDay + day;
        }
        const year = dateObj.getUTCFullYear();
        const today = year + "-" + stringMonth + "-" + stringDay;
        if (element.endDate) {
          if (today >= element.endDate && !element.isDone) {
            containsOverdueTask = true;
          }
        }
      });
    }
    return containsOverdueTask;
  }

  taskCounter(): number {
    let taskCounter: number = 0;
    if (this.tasks?.length !== 0 && this.tasks) {
      this.tasks.forEach(element => {
        if (!element.isDone) {
          taskCounter += 1;
        }
      });
    }
    return taskCounter;
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

  openEditorWithCategory(category: string | undefined, template: TemplateRef<any>): void {
    if (category) {
      this.selectedCategory = category;
      this.openModal(template);
    }
    
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal(status: string): void {
    if (status === 'hide') {
      this.modalRef?.hide();
      this.selectedCategory = '';
    }
  }

  logout(): void {
    setTimeout(() => {
    }, 500);
    
      this.authService.logout();
    setTimeout(() => {
      if (this.router.url != "/resetpw") {
        this.router.navigateByUrl('/login');
      }
    }, 1000);
  }

  async resetPW() {
    this.router.navigateByUrl('resetpw')
    this.logout();
  }

}
