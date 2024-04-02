import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EasyComponent } from './components/easy/easy.component';
import { MediumComponent } from './components/medium/medium.component';
import { HardComponent } from './components/hard/hard.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'easy', component: EasyComponent },
  { path: 'medium', component: MediumComponent},
  { path: 'hard', component: HardComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
