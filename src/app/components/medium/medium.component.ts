import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MediumQuestion } from '../../interface/question';
import { LevelService } from '../../services/level.service';
import { Response } from '../../interface/response';

interface DynamicObject {
  [key: string]: any; // Now TypeScript knows any string can be used as an index
}

@Component({
  selector: 'app-medium',
  templateUrl: './medium.component.html',
  styleUrl: './medium.component.scss'
})
export class MediumComponent {
  question = new Subject<Response>();
  streak: number = 0;
  vraag: number = 1;
  httpHeaders = new HttpHeaders().set("Authorization", "Bearer " + environment.apiKey);

  displayedColumns = ['Jaar', 'Product', 'Prijs per eenheid (€)'];

  currQuestion: MediumQuestion = this.emptyQuestion();

  messages = [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
     "content": "Geef een tabel met een meerkeuzevraag om economieleerlingen te laten rekenen met index cijfers, geef het als json-bestand, genereer geen extra tekst, gebruik dit als format {\"vraag\": , \"opties\": \{ \"a\": , \"b\": , \"c\": , \"d\": \}, \"antwoord\": , \"uitleg\": , \"tabel\": \{\"headers\": [\"Jaar\", \"Product\", \"Prijs per eenheid (€)\"], \"data\": [ [\"\", \"\", \"\"],]} }"
    }
  ];

  dataSource = new MatTableDataSource(this.currQuestion.tabel.data);


  url = "https://api.openai.com/v1/chat/completions";

  constructor( private http: HttpClient, private snack: MatSnackBar, private lvl: LevelService){}

  ngOnInit(): void {
    this.askGPT().subscribe(value => {this.question.next(value)})
    console.log(this.dataSource);
    
    this.question.subscribe({
      next: (value) => {
        this.messages.push({"role": "assistant", "content": value.choices[0].message.content});
        this.currQuestion = JSON.parse(value.choices[0].message.content);
        this.dataSource = new MatTableDataSource(this.currQuestion.tabel.data);
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

  answer(ans : string): void {
    if (ans == this.currQuestion.antwoord) {
      this.streak++;
      if (this.streak == 3){
        this.snack.open("Je hebt het volgende niveau vrijgespeeld! Klik op home.", "", {panelClass:'app-notification-success'});
        this.lvl.setMedium("fin");
        if (this.lvl.getHard() != "fin"){
          this.lvl.setHard("open");
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
    this.dataSource = new MatTableDataSource(this.currQuestion.tabel.data);
    this.messages.push({"role": "assistant", "content": "Genereer nog 1"});
    this.askGPT().subscribe(value => {this.question.next(value)})
    this.vraag++;
}
  emptyQuestion(): MediumQuestion{
    return {
      vraag: "",
      opties: {
        a: "",
        b: "",
        c: "",
        d: ""
      },
      antwoord: "",
      uitleg: "",
      tabel: {
        headers: [""],
        data: [["", "", ""]]
      }
    };
  }
}
