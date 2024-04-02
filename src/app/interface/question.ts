export interface EasyQuestion {
  vraag: string
  opties: Opties
  antwoord: string
  uitleg: string
}

export interface Opties {
  a: string
  b: string
  c: string
  d: string
}

export interface Tabel {
  headers: string[]
  data: [string, string, string][]
}

export interface MediumQuestion {
  vraag: string
  opties: Opties
  antwoord: string
  uitleg: string
  tabel: Tabel
}