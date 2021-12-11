import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Product } from '../common/product';
import { catchError, map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

/**
 * @author Cem Tunc AKSUNA - tunCode
 */
@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private _baseURL = "http://localhost:8080/api/products";
  private _productCategoriesURL = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {

    const _searchUrl = `${this._baseURL}/search/findByCategoryId?id=${categoryId}`;
    return this.httpClient.get<GetResponseProducts>(_searchUrl)
      .pipe(
        map(response => response._embedded.products),
        catchError(this.handleError)
      );
  }

  getProductListPaginate(page: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {

    const _paginationUrl = `${this._baseURL}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`
    return this.httpClient.get<GetResponseProducts>(_paginationUrl);

  }

  getProductCategories(): Observable<ProductCategory[]> {

    //localhost:8080/api/products/findByCategoryId?id=".."
    return this.httpClient.get<GetResponseProductCategory>(this._productCategoriesURL)
      .pipe(
        map(response => response._embedded.productCategory),
        catchError(this.handleError)
      );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    //localhost:8080/api/products/findByNameContaining?name="theKeyword"
    return this.httpClient.get<GetResponseProducts>(`${this._baseURL}/search/findByNameContaining?name=${theKeyword}`)
      .pipe(
        map(response => response._embedded.products),
        catchError(this.handleError)
      );
  }

  getProductForDetailsView(productId: any): Observable<Product> {

    //localhost:8080/api/products/{productId..}
    const productIdURL = `${this._baseURL}/${productId}`
    return this.httpClient.get<Product>(productIdURL);
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
  },
  page: {
    size: number,
    totalElements: number,
    totalPage: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

