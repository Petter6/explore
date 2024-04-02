import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { EasyComponent} from './components/easy/easy.component';
import { MediumComponent } from './components/medium/medium.component';
import { HardComponent } from './components/hard/hard.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './components/toolbar/toolbar.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EasyComponent,
    MediumComponent,
    HardComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
   MaterialModule,
   HttpClientModule,
   ReactiveFormsModule,
   RouterModule,
   BrowserAnimationsModule,
  
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
