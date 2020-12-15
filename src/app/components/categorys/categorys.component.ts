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

  

  onDelete(categoryID: string | undefined): void {
    if (categoryID !== undefined) {
      this.categoryService.DeleteCategory(categoryID);
    }
    window.alert('Kategorie erfolreich gelöscht!');
  }
}
