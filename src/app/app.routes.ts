import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MarketComponent } from './market/market.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { AddProductComponent } from './add-product/add-product.component';
import { UserConfigurationComponent } from './user-configuration/user-configuration.component';
import { UserComponent } from './user/user.component';
import { ProductComponent } from './product/product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AuthGuard } from '../guard/AuthGuard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'market', component: MarketComponent },
  { path: 'search', component: SearchComponent },
  { path: 'addProduct', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'userConfig', component: UserConfigurationComponent, canActivate: [AuthGuard] },
  { path: 'product/:id', component: ProductComponent},
  { path: 'editProduct/:id', component: EditProductComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent }

  // Otras rutas pueden ser agregadas aquí
];
