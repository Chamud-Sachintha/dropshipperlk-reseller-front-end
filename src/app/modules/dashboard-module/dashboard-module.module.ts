import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardModuleRoutingModule } from './dashboard-module-routing.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllProductsComponent } from './all-products/all-products.component';
import { InsideProductComponent } from './inside-product/inside-product.component';
import { ResellProductsComponent } from './resell-products/resell-products.component';
import { CheckListedProductComponent } from './check-listed-product/check-listed-product.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { CheckOrderComponent } from './check-order/check-order.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    AllProductsComponent,
    InsideProductComponent,
    ResellProductsComponent,
    CheckListedProductComponent,
    OrderManagementComponent,
    CheckOrderComponent
  ],
  imports: [
    CommonModule,
    DashboardModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardModuleModule { }
