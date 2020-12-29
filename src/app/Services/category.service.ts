import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  uid = '';

  constructor(public authService: AuthService,
              private af: AngularFireAuth,
              private db: AngularFirestore) {
    this.af.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
      }
    });
  }

  GetCategorys(): AngularFirestoreCollection {
    return this.db.collection('users').doc(this.uid).collection('categorys');
  }

  CreateCategory(category: Category): void {
    if (category.name !== undefined) {
      const newCat: Category = {name: category.name, dateCreated: new Date()};
      this.db.collection('users').doc(this.uid).collection('categorys').add(newCat);
    }
  }

  DeleteCategory(categoryID: string): void {
    if (categoryID.length !== 0) {
      this.db.collection('users').doc(this.uid + '/' + 'categorys/' + categoryID).delete();
    }
  }
}
