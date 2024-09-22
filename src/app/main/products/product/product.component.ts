import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SanitizerPipe } from 'src/app/shared/pipes';
import{takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'bs-product',
  standalone: true,
  imports: [SanitizerPipe],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class ProductComponent implements OnInit
{
  constructor(private activateRoute:ActivatedRoute, public productService:ProductsService)
  {
    this.activateRoute.params.pipe(takeUntilDestroyed()).subscribe(data => {
      this.productService.openProduct(data['productsGroup'], Number(data['productId']));
    });
  }

  ngOnInit()
  {

  }
}
