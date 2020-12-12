import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/Services/category.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.component.html',
  styleUrls: ['./categorys.component.scss']
})
export class CategorysComponent implements OnInit {

  selecteCategory: Category = new Category();
  categorys?: Category[];

  constructor(public authService: AuthService,
              public af: AngularFireAuth,
              private categoryService: CategoryService) {
              }

  ngOnInit(): void {
    this.af.authState.subscribe(user => {
      if (user) {
        this.categorys = [];
        this.getCategorys();

      }
    });
  }

  /* getCategorys(): Category[] {
    this.categoryService.GetCategorys().snapshotChanges().subscribe(category => {
      this.categorys = category.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Category;
      });
      console.log(this.categorys);
    });
    return(this.categorys);
  } */

  getCategorys(): void {
    console.log('get category called');
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

  onSubmit(form: NgForm): void {
    this.categoryService.CreateCategory(this.selecteCategory);
    this.resetForm(form);
  }

  onDelete(categoryID: string): void {
    this.categoryService.DeleteCategory(categoryID);
  }

  resetForm(form?: NgForm): void {
    if (form != null) {
      form.reset();
    }
  }







}
