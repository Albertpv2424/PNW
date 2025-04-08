import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'], // Changed from scss to css
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule]
})
export class AboutComponent implements OnInit {

  constructor(
    private titleService: Title,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    // Set page title based on current language
    this.translateService.get('ABOUT.TITLE').subscribe((title: string) => {
      this.titleService.setTitle(`PNW - ${title}`);
    });
  }
}
