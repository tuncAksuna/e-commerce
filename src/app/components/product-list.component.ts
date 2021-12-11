import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../common/product';
import { ProductService } from '../services/product.service';

/**
 * @author Cem Tunc AKSUNA - tunCode
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  previousCategoryId: number;
  searchMode: boolean;

  /* properties for pagination */
  pageNumber: number = 1;
  pageSize: number = 20;
  totalElements: number = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    this.productService.searchProducts(theKeyword).subscribe(data => {
      this.products = data;
    });
  }

  handleListProducts() {

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId).subscribe(data => {
      return data => {
        this.processResult(data);
      }
    })
  }

  private processResult(data: any) {
    this.products = data._embedded.products;
    this.pageNumber = data.page.number + 1; //* 'cause pagination value is different front-end and back-end(in front = 1 (default) , in-backend = 0 (default))
    this.pageSize = data.page.size;
    this.totalElements = data.page.totalElements;
  }
}
