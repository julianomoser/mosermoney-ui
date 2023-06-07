import { Component, OnInit } from '@angular/core';

import { LancamentoFiltro, LancamentoService } from './../lancamento.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  filtro = new LancamentoFiltro();

  totalRegistros: number = 0

  lancamentos: any[] = [] ;


  constructor(private lancamentoService: LancamentoService) {}

  ngOnInit(): void {}

  pesquisar(pagina: number = 0): void {
    this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro)
      .then(response => {
        this.lancamentos = response.lancamentos;
        this.totalRegistros = response.total;
      });
  }

  onPageChange(event: LazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;
    this.pesquisar(pagina);
  }
}
