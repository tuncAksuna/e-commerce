import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Product } from '../common/product';
import { catchError, map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _productsURL = "http://localhost:8080/api/products";
  private _productCategoriesURL = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {

    const _searchUrl = `${this._productsURL}/search/findByCategoryId?id=${theCategoryId}`;
    return this.httpClient.get<GetResponseProducts>(_searchUrl)
      .pipe(
        map(response => response._embedded.products),
        catchError(this.handleError)
      );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    //localhost:8080/api/products/findByCategoryId?id=".."
    return this.httpClient.get<GetResponseProductCategory>(`${this._productCategoriesURL}`)
      .pipe(
        map(response => response._embedded.productCategory),
        catchError(this.handleError)
      );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    //localhost:8080/api/products/dinByNameContaining?name="theKeyword"
    return this.httpClient.get<GetResponseProducts>(`${this._productsURL}/search/findByNameContaining?name=${theKeyword}`)
      .pipe(
        map(response => response._embedded.products),
        catchError(this.handleError)
      );
  }

  handleError(_httpError) {
    let errorMessage: string = '';

    if (_httpError.error instanceof ErrorEvent) {
      errorMessage = `Error : ${_httpError.error.message}`
    } else {
      errorMessage = `
      Error Code : ${_httpError.status}
      Error message : ${_httpError.message}`;
    }
    return throwError(errorMessage);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

