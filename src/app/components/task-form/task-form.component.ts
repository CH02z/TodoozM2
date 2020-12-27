import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/Category';
import { Task } from 'src/app/models/Task';
import { CategoryService } from 'src/app/Services/category.service';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  @Output() closeModal = new EventEmitter<string>();

  categorys?: Category[];
  taskForm: FormGroup;

  constructor(public af: AngularFireAuth,
              private categoryService: CategoryService,
              private formBuilder: FormBuilder,
              private taskService: TaskService) {
                this.taskForm = this.createUserForm();
              }

  ngOnInit(): void {
    this.af.authState.subscribe(user => {
      if (user) {
        this.categorys = [];
        this.getCategorys();
        
      }
    });
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

  createUserForm() {
    if (this.taskService.selectedTask === undefined) {
      this.taskForm = this.formBuilder.group({
        taskID: [''],
        name: ['', Validators.required],
        endDate: ['', [Validators.required]],
        category: ['', [Validators.required]],
        highPriority: [''],
        description: ['']
      });

    } else {
      this.taskForm = this.formBuilder.group({
        taskID: [this.taskService.selectedTask.id],
        name: [this.taskService.selectedTask.name, Validators.required],
        endDate: [this.taskService.selectedTask.endDate, [Validators.required]],
        category: [this.taskService.selectedTask.category, [Validators.required]],
        highPriority: [this.taskService.selectedTask.highPriority],
        description: [this.taskService.selectedTask.description]
      });
    }
    return this.taskForm;
    }

    onSubmit() {
      if (this.taskForm) {
        if (this.taskForm.valid) {
          this.taskService.CreateTask(this.taskForm.value)
          this.closeModal.emit('hide');
          //window.alert('Aufgabe: ' + this.taskForm.value.name + ' erfolreich hinzugefügt!');
          this.resetForm();
        }
      }
    }

    resetForm(): void {
      if (this.taskForm != null) {
        this.taskForm.reset();
      }
    }

}
