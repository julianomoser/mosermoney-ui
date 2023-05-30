import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient) { }

  pesquisar(): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ****************************************************');

      return firstValueFrom(
        this.http.get(`${this.lancamentosUrl}?resumo`, { headers })
      ).then((response: any) => response['content']);
  }
}
