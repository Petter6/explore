import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Response } from '../../interface/response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { EasyQuestion } from '../../interface/question';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LevelService } from '../../services/level.service';

@Component({
  selector: 'app-easy',
  templateUrl: './easy.component.html',
  styleUrl: './easy.component.scss',
})
export class EasyComponent implements OnInit {  
  question = new Subject<Response>();
  currQuestion : EasyQuestion = this.emptyQuestion();
  
  streak: number = 0;
  vraag: number = 1;
  httpHeaders = new HttpHeaders().set("Authorization", "Bearer " + environment.apiKey);

  applyForm = new FormGroup({answer: new FormControl('')});

  messages = [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
     "content": "Geef een meerkeuzevraag waarin leerlingen een procentueel deel van een totaal moeten uitrekenen in de context economie, geef ook uitleg bij het antwoord, geef het als json-bestand, genereer geen extra tekst, gebruik dit als format {\"vraag\": , \"opties\": \{ \"a\": , \"b\": , \"c\": , \"d\": \}, \"antwoord\": , \"uitleg\": }"
    }
  ];


  url = "https://api.openai.com/v1/chat/completions";

  constructor( private http: HttpClient, private snack: MatSnackBar, private lvl: LevelService){}

  ngOnInit(): void {
    this.askGPT().subscribe(value => {this.question.next(value)})
    
    this.question.subscribe({
      next: (value) => {
        this.messages.push({"role": "assistant", "content": value.choices[0].message.content});
        this.currQuestion = JSON.parse(value.choices[0].message.content);
      }
    })
  }

  askGPT(): Observable<Response> {
      const options = {
        "model": "gpt-4",
        "messages": this.messages,
      }
      return this.http.post<Response>(this.url, options, {headers: this.httpHeaders});
  }

  answer(ans: string): void {
    if (ans == this.currQuestion.antwoord) {
      this.streak++;
      if (this.streak == 3){
        this.snack.open("Je hebt het volgende niveau vrijgespeeld! Klik op home.", "", {panelClass:'app-notification-success'});
        this.lvl.setEasy("fin");
        if (this.lvl.getMedium() != "fin"){
          this.lvl.setMedium("open");
        }
      } else {
        this.snack.open("Correct!", "", {panelClass:'app-notification-success'});
      }
    } else {
      this.snack.open(this.currQuestion.uitleg, "Close", {
        panelClass: 'app-notification-error',
      });
      this.streak = 0;
    }
    this.currQuestion = this.emptyQuestion();
    this.messages.push({"role": "assistant", "content": "Genereer nog 1"});
    this.askGPT().subscribe(value => {this.question.next(value)})
    this.vraag++;
  }  

  emptyQuestion(): EasyQuestion{
    return {
      vraag: "",
      opties: {
        a: "",
        b: "",
        c: "",
        d: ""
      },
      antwoord: "",
      uitleg: ""
  };
  }
}
