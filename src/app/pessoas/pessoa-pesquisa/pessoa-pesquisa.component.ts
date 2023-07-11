import { Component, ViewChild } from '@angular/core';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

import { PessoaFiltro, PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoa-pesquisa',
  templateUrl: './pessoa-pesquisa.component.html',
  styleUrls: ['./pessoa-pesquisa.component.css']
})
export class PessoaPesquisaComponent  {

  totalRegistros = 0;
  filtro = new PessoaFiltro()
  pessoas: any[] = [];
  @ViewChild('tabela') tabela!: Table;

  constructor(
    private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) { }

  pesquisar(pagina: number = 0): void {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
      .then((dados: any) => {
        this.pessoas = dados.pessoas;
        this.totalRegistros = dados.total;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  onPageChange(event: LazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {
    this.pessoaService.excluir(lancamento.codigo)
      .then(() => {
        if (this.tabela.first === 0) {
          this.pesquisar();
        } else {
          this.tabela.reset();
        }

        this.message('success', 'Pessoa excluída com sucesso!');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;
    console.log('Status',novoStatus)
    if(novoStatus) {
      this.pessoaService.ativar(pessoa.codigo)
      .then(() => {
        pessoa.ativo = novoStatus;
        this.message('success', 'Pessoa ativada com sucesso!');
      })
      .catch(erro => this.errorHandler.handle(erro));
    } else {
      this.pessoaService.inativar(pessoa.codigo)
      .then(() => {
        pessoa.ativo = novoStatus;
        this.message('success', 'Pessoa inativa com sucesso!');
      })
      .catch(erro => this.errorHandler.handle(erro));
    }
  }

  private message(typeMessage: string, message: string): void {
    this.messageService.add({ severity: typeMessage, detail: message });
  }
}
