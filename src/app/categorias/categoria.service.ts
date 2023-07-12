import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categoria } from './categoria.';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  categoriasUrl = environment.API_URL + '/categorias';
  basicAuth = environment.BASIC_AUTH;

  constructor(
    private http: HttpClient
    ) { }

  listarTodas(): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', this.basicAuth);

    return firstValueFrom(
      this.http.get(this.categoriasUrl, { headers })
    );
  }
}
