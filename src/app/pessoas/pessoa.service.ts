import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export class PessoaFiltro {
  nome?: string;
  pagina= 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  pessoasUrl = environment.API_URL + '/pessoas';
  basicAuth = environment.BASIC_AUTH;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
    ) { }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', this.basicAuth);

    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return firstValueFrom(
      this.http.get(`${this.pessoasUrl}`, { headers, params })
    ).then((response: any) => {
      const pessoas = response['content'];

      const resultado = {
        pessoas,
        total: response['totalElements']
      };

      return resultado;
    });
  }

  listarTodas(): Promise<any> {
    const headers = new HttpHeaders()
    .append('Authorization', this.basicAuth);

    return firstValueFrom(
      this.http.get(`${this.pessoasUrl}`, { headers })
    ).then((response: any) => response['content']);
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', this.basicAuth);

    return firstValueFrom(
      this.http.delete<void>(`${this.pessoasUrl}/${codigo}`, { headers })
    );
  }
}
