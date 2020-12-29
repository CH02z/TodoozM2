import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() hideForm = new EventEmitter<string>();
  @Input() editTask?: Task;
  @Input() category?: string;


  showForm: boolean = false;


  categorys?: Category[];
  taskForm: FormGroup;

  constructor(public af: AngularFireAuth,
              private categoryService: CategoryService,
              private formBuilder: FormBuilder,
              private taskService: TaskService) {
                this.taskForm = this.formBuilder.group({});
                
              }

  ngOnInit(): void {
    this.af.authState.subscribe(user => {
      if (user) {
        this.categorys = [];
        this.getCategorys();
        this.taskForm = this.createUserForm();
        this.showForm = true;
        
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
    if (this.editTask === undefined) {
      this.taskForm = this.formBuilder.group({
        taskID: [''],
        name: ['', Validators.required],
        endDate: ['', [Validators.required]],
        category: ['', [Validators.required]],
        highPriority: [''],
        description: ['']
      });
      if (this.category !== '') {
        this.taskForm.get('category')?.setValue(this.category);
        this.category = '';
      }
      

    } else {
      this.taskForm = this.formBuilder.group({
        taskID: [this.editTask.id],
        name: [this.editTask.name, Validators.required],
        endDate: [this.editTask.endDate, [Validators.required]],
        category: [this.editTask.category, [Validators.required]],
        highPriority: [this.editTask.highPriority],
        description: [this.editTask.description]
      });
    }
    return this.taskForm;
    }

    onSubmit() {
      if (this.taskForm) {
        if (this.taskForm.valid) {
          if (this.taskForm.value.taskID === "") {
            this.taskService.CreateTask(this.taskForm.value)
            this.closeModal.emit('hide');
            //window.alert('Aufgabe: ' + this.taskForm.value.name + ' erfolreich hinzugefügt!');
            this.resetForm();
          } else {
            this.taskService.UpdateTask(this.taskForm.value);
            this.resetForm()
            this.closeModal.emit('hide');
            this.hideForm.emit('hide');
          }
          
        }
      }
    }

    resetForm(): void {
      if (this.taskForm != null) {
        this.taskForm.reset();
      }
    }

}
