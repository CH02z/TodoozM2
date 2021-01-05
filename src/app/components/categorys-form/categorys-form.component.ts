import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Category } from 'src/app/models/Category';
import { AuthService } from 'src/app/Services/auth.service';
import { CategoryService } from 'src/app/Services/category.service';

@Component({
  selector: 'app-categorys-form',
  templateUrl: './categorys-form.component.html',
  styleUrls: ['./categorys-form.component.scss']
})
export class CategorysFormComponent implements OnInit {

  @Output() closeModal = new EventEmitter<string>();

  selecteCategory: Category = new Category();

  constructor(public authService: AuthService,
              public af: AngularFireAuth,
              private categoryService: CategoryService,
              private translate: TranslateService) {
    }
  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.categoryService.CreateCategory(this.selecteCategory);
      this.closeModal.emit('hide');
      window.alert(this.translate.instant('todo.category') + ": " + this.selecteCategory.name + " " + this.translate.instant('auth.successful') + " " + this.translate.instant('todo.added') + ".");
      this.resetForm(form);
    }
   
  }

  resetForm(form?: NgForm): void {
    if (form != null) {
      form.reset();
    }
  }

}
