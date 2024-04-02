import { Component } from '@angular/core';
import { LevelService } from '../../services/level.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MediumQuestion } from '../../interface/question';
import { Response } from '../../interface/response';

@Component({
  selector: 'app-hard',
  templateUrl: './hard.component.html',
  styleUrl: './hard.component.scss'
})
export class HardComponent {
  question = new Subject<Response>();
  streak: number = 0;
  vraag: number = 1;
  httpHeaders = new HttpHeaders().set("Authorization", "Bearer " + environment.apiKey);

  displayedColumns = ['Productcategorie', 'Prijs in 2022 (€)', 'Prijs in 2023 (€)', 'Wegingsfactor'];

  currQuestion: MediumQuestion = this.emptyQuestion();

  messages = [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
     "content": "Geef een meerkeuze vraag waarbij leerlingen het CPI moeten uitrekenen, gebruik wegingsfactoren, en echte namen voor producten, geef het als json-bestand, genereer geen extra tekst, gebruik dit als format {\"vraag\": , \"opties\": \{ \"a\": , \"b\": , \"c\": , \"d\": \}, \"antwoord\": , \"uitleg\": , \"tabel\": \{\"headers\": [\"Productcategorie\", \"Prijs in 2022 (€)\", \"Prijs per eenheid (€)\"], \"Prijs in 2023 (€)\", \"Wegingsfactor\": [ [\"\", \"\", \"\", \"\"],]} }"
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
        if (this.lvl.getHard() != "fin"){
          this.lvl.setHard("fin");
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
