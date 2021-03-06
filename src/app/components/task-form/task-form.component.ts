import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/Category';
import { Task } from 'src/app/models/Task';
import { TaskService } from 'src/app/Services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  @Output() closeModal = new EventEmitter<string>();
  @Output() hideForm = new EventEmitter<string>();
  @Output() changedCategory = new EventEmitter<string>();
  @Input() editTask?: Task;
  @Input() selectedCat?: string;
  @Input() categorys?: Category[];


  showForm: boolean = false;

  taskForm: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(public af: AngularFireAuth,
              private formBuilder: FormBuilder,
              private taskService: TaskService) {
                this.taskForm = this.formBuilder.group({});
                
              }

  ngOnInit(): void {
    this.subscriptions.push(
      this.af.authState.subscribe(user => {
        if (user) {
          this.taskForm = this.createUserForm();
          this.showForm = true;
          
        }
      })
    );
  }

  dateValidator(control: AbstractControl): {[key: string]: any} | null  {
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
    const newdate = year + "-" + stringMonth + "-" + stringDay;
    if (control.value < newdate) {
      return { 'dateInvalid': true };
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {  
    const control = formGroup.get(field);             
    if (control instanceof FormControl) {            
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        
      this.validateAllFormFields(control);            
    }
  });
}


  //form Getters used in template for validationn
  get name() { return this.taskForm.get('name'); }
  get endDate() { return this.taskForm.get('endDate'); }
  get categoryv() { return this.taskForm.get('category'); }

  createUserForm() {
    if (this.editTask === undefined) {
      this.taskForm = this.formBuilder.group({
        taskID: [''],
        name: ['', Validators.required],
        endDate: ['', [Validators.required, this.dateValidator]],
        category: ['', [Validators.required]],
        highPriority: [''],
        description: ['']
      });
      if (this.selectedCat !== '') {
        this.taskForm.get('category')?.setValue(this.selectedCat);
        this.selectedCat = '';
      }
      

    } else {
      this.taskForm = this.formBuilder.group({
        taskID: [this.editTask.id],
        name: [this.editTask.name, Validators.required],
        endDate: [this.editTask.endDate, [Validators.required, this.dateValidator]],
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
            this.getModifiedCat();
            this.closeModal.emit('hide');
            this.resetForm();
          } else {
            this.taskService.UpdateTask(this.taskForm.value);
            this.getModifiedCat();
            this.resetForm()
            this.closeModal.emit('hide');
            this.hideForm.emit('hide');
          }
        
          
        } else {
          this.validateAllFormFields(this.taskForm);
        }
      }
    }

    private getModifiedCat(): void {
      const changedCat = this.taskForm.get('category')?.value;
      if (changedCat !== '') {
        this.changedCategory.emit(changedCat);
      }
    }

    resetForm(): void {
      if (this.taskForm != null) {
        this.taskForm.reset();
      }
    }

}
