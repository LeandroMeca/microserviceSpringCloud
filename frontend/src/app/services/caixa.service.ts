import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interface para definir a estrutura do objeto Cliente.
// Agora, contém apenas o 'nome'.
export interface Cliente {
  id?: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class CaixaService {

  // URL base da sua API de Clientes.
  private readonly apiUrl = 'http://localhost:8080/caixa/api/clientes';

  constructor(private http: HttpClient) { }

  /**
   * Retorna a lista de todos os clientes da API.
   * @returns Um Observable com um array de clientes.
   */
  public getClientes(): Observable<Cliente[]> {
    console.log('Buscando clientes da API...');
    return this.http.get<Cliente[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Erro ao buscar clientes:', error);
        throw error;
      })
    );
  }

  /**
   * Adiciona um novo cliente à API.
   * @param cliente O objeto cliente a ser adicionado.
   * @returns Um Observable com o cliente recém-criado.
   */
  public addCliente(cliente: Cliente): Observable<Cliente> {
    console.log('Enviando novo cliente para a API...', cliente);
    return this.http.post<Cliente>(this.apiUrl, cliente).pipe(
      catchError((error) => {
        console.error('Erro ao adicionar cliente:', error);
        throw error;
      })
    );
  }

  /**
   * Atualiza um cliente existente na API.
   * @param cliente O objeto cliente com os dados atualizados.
   * @returns Um Observable com o cliente atualizado.
   */
  public updateCliente(cliente: Cliente): Observable<Cliente> {
    const url = `${this.apiUrl}/${cliente.id}`;
    console.log(`Atualizando cliente na URL ${url}...`, cliente);
    return this.http.put<Cliente>(url, cliente).pipe(
      catchError((error) => {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
      })
    );
  }

  /**
   * Deleta um cliente da API.
   * @param id O ID do cliente a ser deletado.
   * @returns Um Observable vazio após a exclusão bem-sucedida.
   */
  public deleteCliente(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log(`Deletando cliente na URL ${url}...`);
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Erro ao deletar cliente:', error);
        throw error;
      })
    );
  }
}
