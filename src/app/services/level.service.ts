import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  getEasy(): string {
    const storedCounter = localStorage.getItem('easy');
    return storedCounter ? storedCounter : "open";
  }

  getMedium(): string {
    const storedCounter = localStorage.getItem('medium');
    return storedCounter ? storedCounter : "locked";
  }

  getHard(): string {
    const storedCounter = localStorage.getItem('hard');
    return storedCounter ? storedCounter : "locked";
  }

  setEasy( value : string): void {
    localStorage.setItem('easy', value);
  }

  setMedium(value : string) : void {
    localStorage.setItem('medium', value);
  }

  setHard(value : string ) : void {
    localStorage.setItem('hard', value);
  }

  resetCounter() {
    localStorage.removeItem('easy')
    localStorage.removeItem('medium')
    localStorage.removeItem('hard')
  }
}
