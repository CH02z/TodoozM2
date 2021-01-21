import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/Services/category.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TaskService } from 'src/app/Services/task.service';
import { Task } from 'src/app/models/Task';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.component.html',
  styleUrls: ['./categorys.component.scss']
})
export class CategorysComponent implements OnInit {

  categorys?: Category[];
  tasks?: Task[];
  modalRef?: BsModalRef;

  constructor(public authService: AuthService,
              public af: AngularFireAuth,
              private categoryService: CategoryService,
              private taskService: TaskService,
              private modalService: BsModalService,
              private translate: TranslateService) {
                
              }

  ngOnInit(): void {
    this.af.authState.subscribe(user => {
      if (user) {
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

  categoryIsUsed(category: string | undefined): boolean {
    let usedCategorys: string[] = [];
    if (this.tasks?.length !== 0 && this.tasks && this.categorys) {
      this.tasks.forEach(task => {
        if (!task.isDone) {
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
      returnbool = usedCategorys.includes(category)
    }
    return returnbool;
  }

  onDelete(category: Category | undefined): void {
    if (this.categoryIsUsed(category?.name)) {
      window.alert(this.translate.instant('todo.CatCannotBeDeleted') + ".");
    } else {
      if (category?.id !== undefined) {
        this.categoryService.DeleteCategory(category.id);
        window.alert(this.translate.instant('todo.category') + " " + this.translate.instant('todo.deleted') + ".");
      }
    }
    
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
