export type SelectItem = {
  title: string
  value: number
}

export type Klijent = {
  id: number
  ime: string
  prezime: string
  email: string
  telefon: string
  ime_prezime: string
}

export type Teren = {
  id: number
  naziv: string
  podloga: string
  lokacija: string
  cijena_po_satu: number
  aktivan: boolean
}

export type Oprema = {
  id: number
  naziv: string
  kategorija: string
  ukupna_kolicina: number
  dostupna_kolicina: number
  cijena_najma: number
}

export type Rezervacija = {
  id: number
  datum: string
  vrijeme_pocetka: string
  trajanje: number
  status: string
  klijent_id: number
  teren_id: number
  klijent_ime_prezime: string
  teren_naziv: string
}

export type NajamOpreme = {
  id: number
  datum_najma: string
  datum_povrata: string
  kolicina: number
  status: string
  klijent_id: number
  oprema_id: number
  rezervacija_id: number
  klijent_ime_prezime: string
  oprema_naziv: string
  rezervacija_opis: string
}
