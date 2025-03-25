import { Injectable } from '@angular/core';
import { Cliente } from './cadastro/cliente';

@Injectable({
  providedIn: 'root'
})

export class ClienteService {

  static REPO_CLIENTES = "_CLIENTES";

  constructor() { }

  salvar(cliente: Cliente) {
    const storage = this.obterStorage();
    storage.push(cliente);

    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  atualizar(cliente: Cliente) {
    const storage = this.obterStorage();
    storage.forEach(c => {
      if (c.id === cliente.id) {
        Object.assign(c, cliente);
      }
    })
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  deletar(cliente: Cliente) {
    const storage = this.obterStorage();

    const novaLista = storage.filter(c => c.id !== cliente.id) //primeira opção

    //segunda opção
    // const indexItem = storage.indexOf(cliente);
    // if(indexItem > -1) {
    //   storage.splice(indexItem, 1);
    // }

    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(novaLista))
  }

  pesquisarClientes(nomeBusca: string): Cliente[] {
    const clientes = this.obterStorage();

    if(!nomeBusca) {
      return clientes;
    }

    //cliente.nome: Jose da Silva
    //nomeBusca: jose (indice 0, 1, 2, 3)
    //nomeBusca: silva (indice 8, 9, 10, 11)
    //nomeBusca: hugo (indice -1)
    return clientes.filter(cliente => cliente.nome?.toLowerCase().indexOf(nomeBusca.toLowerCase()) !== -1)
  }

  buscarClientePorId(id: string) : Cliente | undefined {
    const clientes = this.obterStorage();
    return clientes.find(cliente => cliente.id === id)
  }

  private obterStorage(): Cliente[] {
    const repositorioClientes = localStorage.getItem(ClienteService.REPO_CLIENTES);
    if (repositorioClientes) {
      const clientes: Cliente[] = JSON.parse(repositorioClientes) //recebe a string de repositorioClientes e transforma em array de clientes
      return clientes;
    }

    const clientes: Cliente[] = [];
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientes));
    return clientes;
  }
}

//obterStorage, faz a primeira verificação para caso já tenha um array, se não houver um array, vai ser skipada a primeira verificação e na segunda etapa ele cria o array vazio e insere o cliente ali, essa segunda etapa só será rodada uma vez por código caso necessário