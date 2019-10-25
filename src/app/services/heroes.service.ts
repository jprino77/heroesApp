import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private url = 'https://loginapp-12a44.firebaseio.com';

  constructor(private http: HttpClient) {}

  crearHeroe(heroe: HeroeModel) {
    return this.http.post(`${this.url}/heroes.json`, heroe).pipe(
      map((resp: any) => {
        heroe.id = resp.name;

        return heroe;
      })
    );
  }

  actualizarHeroe(heroe: HeroeModel) {
    const heroeTemp = {
      ...heroe
    };

    delete heroeTemp.id;

    return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeTemp);
  }

  getHeroes() {
    return this.http.get(`${this.url}/heroes.json`).pipe(
      /** Java Script hace su magia y detecta que el argumento es la respuesta */
      map(this.crearArrayHeroes),
      delay(1000)
    );
  }

  getHeroe(id: string){

    return this.http.get(`${this.url}/heroes/${id}.json`);
  }

  deleteHeroe(id: string){
    return this.http.delete(`${this.url}/heroes/${id}.json`);
  }

  private crearArrayHeroes(heroesObj: object) {
    const heroes: HeroeModel[] = [];

    if (heroesObj === null) {
      return [];
    }

    /**
     * {"-Ls-aT4IiPCEb51qM4NP":{"nombre":"Capitan America","poder":"La Droga","vivo":true}}
     * 
     * esto refiere la key -Ls-aT4IiPCEb51qM4NP Object.key permite obtener los objetos
     **/
    Object.keys(heroesObj).forEach( key => {
      const heroe: HeroeModel = heroesObj[key];
      heroe.id = key;

      heroes.push(heroe);
    });

    return heroes;
  }
}
