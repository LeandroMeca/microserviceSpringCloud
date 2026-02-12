import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';

// Interface para definir a estrutura do objeto Cliente.
// Agora, contém apenas o 'nome'.
export interface Cliente {
celular: any;
  id?: number;
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class CaixaService {
  // URL base da sua API de Clientes (usar caminho relativo para o proxy do dev-server).
  private readonly apiUrl = '/caixa/api/clientes';

  private readonly CLIENTES_KEY = makeStateKey<any[]>('caixa-clientes');
  // Cache em memória para manter a lista de clientes enquanto a SPA estiver ativa.
  // Isso evita que a lista suma quando o usuário muda de rota e o componente
  // for recriado antes da resposta HTTP chegar.
  private clientesCache: Cliente[] | null = null;

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  /**
   * Retorna a lista de todos os clientes da API.
   * @returns Um Observable com um array de clientes.
   */
  public getClientes(): Observable<Cliente[]> {
    console.log('Buscando clientes da API...');

    // Se já temos cache em memória, retorna imediatamente para evitar "flash".
    if (this.clientesCache && Array.isArray(this.clientesCache)) {
      return of(this.clientesCache);
    }

    // During server-side rendering, fetch and store the result in TransferState
    if (isPlatformServer(this.platformId)) {
      return this.http.get<Cliente[]>(this.apiUrl).pipe(
        tap((data) => {
          try {
            this.transferState.set(this.CLIENTES_KEY, data);
            // também popula o cache no servidor (útil se houver lógica de pré-render)
            this.clientesCache = data;
          } catch (e) {
            console.warn('Falha ao gravar TransferState (server):', e);
          }
        }),
        catchError((error) => {
          console.error('Erro ao buscar clientes (server):', error);
          throw error;
        }),
      );
    }

    // On the client, try to read from TransferState first to avoid refetch and flicker
    const saved = this.transferState.get<Cliente[] | null>(
      this.CLIENTES_KEY,
      null,
    );
    if (saved && Array.isArray(saved) && saved.length > 0) {
      // Remove the state after reading so future navigations will refetch as needed
      try {
        this.transferState.remove(this.CLIENTES_KEY);
      } catch (e) {
        console.warn('Falha ao remover TransferState (client):', e);
      }
      // popula o cache e devolve os dados
      this.clientesCache = saved;
      return of(saved);
    }

    return this.http.get<Cliente[]>(this.apiUrl).pipe(
      tap((data) => {
        // atualiza cache ao receber os dados
        this.clientesCache = data;
      }),
      catchError((error) => {
        console.error('Erro ao buscar clientes:', error);
        throw error;
      }),
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
      tap((saved) => {
        // atualiza cache localmente quando possível
        try {
          if (!this.clientesCache) this.clientesCache = [];
          this.clientesCache.push(saved);
        } catch (e) {
          // não bloquear a operação principal se falhar o cache
          console.warn('Falha ao atualizar cache local de clientes (add):', e);
        }
      }),
      catchError((error) => {
        console.error('Erro ao adicionar cliente:', error);
        throw error;
      }),
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
      tap((updated) => {
        // atualiza cache local se presente
        try {
          if (this.clientesCache) {
            this.clientesCache = this.clientesCache.map((c) =>
              c.id === updated.id ? updated : c,
            );
          }
        } catch (e) {
          console.warn(
            'Falha ao atualizar cache local de clientes (update):',
            e,
          );
        }
      }),
      catchError((error) => {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
      }),
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
      tap(() => {
        // remove do cache local se presente
        try {
          if (this.clientesCache) {
            this.clientesCache = this.clientesCache.filter((c) => c.id !== id);
          }
        } catch (e) {
          console.warn(
            'Falha ao atualizar cache local de clientes (delete):',
            e,
          );
        }
      }),
      catchError((error) => {
        console.error('Erro ao deletar cliente:', error);
        throw error;
      }),
    );
  }
}
