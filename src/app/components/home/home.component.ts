import { Component, OnDestroy, OnInit } from '@angular/core';
import { LevelService } from '../../services/level.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  easy: string = "empty";
  medium: string = "empty";
  hard: string = "empty";


  constructor(private lvl: LevelService){}

  ngOnInit(): void {
      this.easy = this.lvl.getEasy();
      this.medium = this.lvl.getMedium();
      this.hard = this.lvl.getHard();
  }
}
