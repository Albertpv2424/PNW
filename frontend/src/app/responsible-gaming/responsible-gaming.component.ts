import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-responsible-gaming',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './responsible-gaming.component.html',
  styleUrl: './responsible-gaming.component.css'
})
export class ResponsibleGamingComponent implements OnInit {

  constructor(
    private titleService: Title,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    // Set page title based on current language
    this.translateService.get('RESPONSIBLE_GAMING.TITLE').subscribe((title: string) => {
      this.titleService.setTitle(`PNW - ${title}`);
    });
  }
}
