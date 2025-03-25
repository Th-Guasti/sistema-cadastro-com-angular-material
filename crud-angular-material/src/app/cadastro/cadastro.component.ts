import { ActivatedRoute, Router } from '@angular/router';
import { BrasilApiService } from '../brasilapi.service';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule } from '@angular/forms';
import { Estado, Municipio } from '../brasilapi.models';
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-cadastro',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgxMaskDirective,
    MatSelectModule,
    CommonModule
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {
  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor(
    private service: ClienteService,
    private brasilApiService: BrasilApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe((query: any) => {
      const params = query['params'];
      const id = params['id']

      if (id) {
        let clienteEncontrado = this.service.buscarClientePorId(id);
        if (clienteEncontrado) {
          this.atualizando = true;
          this.cliente = clienteEncontrado;
          if (this.cliente.uf) {
            const event = { value: this.cliente.uf }
            this.carregarMunicipios(event as MatSelectChange)
          }
        }
      }
    })

    this.carregarUfs()
  }

  carregarUfs() {
    this.brasilApiService.listarUFs().subscribe({
      next: listaEstados => this.estados = listaEstados,
      error: erro => console.log("ocorreu um erro: ", erro)
    })
  }

  carregarMunicipios(event: MatSelectChange) {
    const ufSelecionada = event.value;

    this.brasilApiService.listarMunicipios(ufSelecionada).subscribe({
      next: listaMunicipios => this.municipios = listaMunicipios,
      error: erro => console.log('Ocorreu um erro: ', erro)
    })
  }

  salvar() {
    this.cliente.nome = this.removerAcentos((this.cliente.nome ?? "").toUpperCase());
    this.cliente.email = this.cliente.email?.toUpperCase();
    this.cliente.cpf = this.cliente.cpf?.toUpperCase();
    this.cliente.uf = this.cliente.uf?.toUpperCase();
    this.cliente.municipio = this.cliente.municipio?.toUpperCase();

    if (!this.atualizando) {
      this.service.salvar(this.cliente);
      this.cliente = Cliente.newCliente();
      this.mostrarMensagem('Salvo com sucesso!')
    } else {
      this.service.atualizar(this.cliente);
      this.router.navigate(['/consulta'])
      this.mostrarMensagem('Atualizado com sucesso!')
    }
  }

  limpar() {
    this.cliente = Cliente.newCliente();
  }

  mostrarMensagem(mensagem: string) {
    this.snack.open(mensagem, "Ok")
  }

  removerAcentos(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}