import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export class LancamentoFiltro {
  descricao?: string;
  dataVencimentoInicio?: Date;
  dataVencimentoFim?: Date;
  pagina= 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl = environment.API_URL + '/lancamentos';
  basicAuth = environment.BASIC_AUTH;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
    ) { }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', this.basicAuth);

    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoIncio', this.datePipe.transform(filtro.dataVencimentoInicio, 'yyyy-MM-dd')!);
    }

    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoFim', this.datePipe.transform(filtro.dataVencimentoFim, 'yyyy-MM-dd')!);
    }

    return firstValueFrom(
      this.http.get(`${this.lancamentosUrl}?resumo`, { headers, params })
    ).then((response: any) => {
      const lancamentos = response['content'];

      const resultado = {
        lancamentos,
        total: response['totalElements']
      };

      return resultado;
    });
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', this.basicAuth);

    return firstValueFrom(
      this.http.delete<void>(`${this.lancamentosUrl}/${codigo}`, { headers })
    );
  }
}
