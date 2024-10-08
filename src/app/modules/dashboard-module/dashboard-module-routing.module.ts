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
import { MyTeamComponent } from './my-team/my-team.component';
import { AuthGuard } from '../../guards/Auth/auth.guard';
import { CartComponent } from './cart/cart.component';
import { ReportsComponent } from './reports/reports.component';
import { Auth } from 'src/app/shared/models/Auth/auth';
import { ExcelOrderUploadComponent } from './excel-order-upload/excel-order-upload.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'all-products',
    component: AllProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'product/:pid',
    component: InsideProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'resell-products',
    component: ResellProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'check-product/:orderId',
    component: CheckListedProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-management',
    component: OrderManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profit-log',
    component: ProfitLogComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'check-order/:orderNumber',
    component: CheckOrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'my-team',
    component: MyTeamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'upload-excel',
    component: ExcelOrderUploadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'DownloadReport',
    component: ReportsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardModuleRoutingModule { }
