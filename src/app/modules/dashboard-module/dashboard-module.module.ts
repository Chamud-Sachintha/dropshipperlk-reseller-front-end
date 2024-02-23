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
import { ProfitLogComponent } from './profit-log/profit-log.component';
import { MyTeamComponent } from './my-team/my-team.component';
import { SessionInfoComponent } from './session-info/session-info.component';
import { CartComponent } from './cart/cart.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    AllProductsComponent,
    InsideProductComponent,
    ResellProductsComponent,
    CheckListedProductComponent,
    OrderManagementComponent,
    CheckOrderComponent,
    ProfitLogComponent,
    MyTeamComponent,
    SessionInfoComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    DashboardModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DashboardModuleModule { }
