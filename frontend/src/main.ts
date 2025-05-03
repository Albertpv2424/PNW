import { bootstrapApplication } from '@angular/platform-browser';
// Update the path to match the actual location of AppComponent
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
