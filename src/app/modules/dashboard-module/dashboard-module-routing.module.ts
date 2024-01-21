import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { InsideProductComponent } from './inside-product/inside-product.component';
import { ResellProductsComponent } from './resell-products/resell-products.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { CheckOrderComponent } from './check-order/check-order.component';
import { CheckListedProductComponent } from './check-listed-product/check-listed-product.component';
import { ProfitLogComponent } from './profit-log/profit-log.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'all-products',
    component: AllProductsComponent
  },
  {
    path: 'product/:pid',
    component: InsideProductComponent
  },
  {
    path: 'resell-products',
    component: ResellProductsComponent
  },
  {
    path: 'check-product/:orderId',
    component: CheckListedProductComponent
  },
  {
    path: 'order-management',
    component: OrderManagementComponent
  },
  {
    path: 'profit-log',
    component: ProfitLogComponent
  },
  {
    path: 'check-order/:orderNumber',
    component: CheckOrderComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardModuleRoutingModule { }
