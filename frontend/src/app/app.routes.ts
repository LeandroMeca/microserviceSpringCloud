import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { CaixaComponent } from './pages/caixa/caixa.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'produtos', component: ProdutoComponent },
  { path: 'caixa', component: CaixaComponent }
];