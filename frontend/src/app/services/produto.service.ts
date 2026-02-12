import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interface Cliente para a relação. Vamos defini-la aqui também para garantir a consistência.
export interface Cliente {
  id?: number;
  nome: string;
}

// Interface para definir a estrutura do objeto Produto, alinhada com o backend
export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  cliente?: Cliente; // A PROPRIEDADE CORRETA É 'cliente', não 'id_cliente'
}

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  // Usar o endpoint relativo para que o proxy de dev roteie para o gateway
  // Endpoint para listar produtos no serviço 'produtos' (ControllerProdutos expõe GET em /v1)
  private readonly apiUrl = '/produtos/v1';

  // Endpoints do serviço Caixa (usar caminhos relativos para passar pelo proxy/dev-server)
  private readonly caixaSingleUrl = '/caixa/api/produtos/single';
  // Endpoint Caixa para operações em massa / transações
  private readonly caixaBulkUrl = '/caixa/api/produtos';

  constructor(private http: HttpClient) {}

  public getProdutos(): Observable<Produto[]> {
    console.log('Buscando produtos da API...');
    // Usar estritamente o endpoint original '/produtos/api/produtos' conforme definido
    // Não aplicar fallback para manter a integridade do contrato com o backend.
    return this.http.get<Produto[]>(this.apiUrl);
  }

  public addProduto(produto: Produto): Observable<Produto> {
    console.log('Enviando novo produto para a API...', produto);
    // Usar o endpoint relativo para que o dev-server proxy encaminhe a
    // requisição para o backend sem provocar CORS no browser.
    const url = '/produtos/v1/p';
    return this.http.post<Produto>(url, produto).pipe(
      catchError((error) => {
        console.error('Erro ao adicionar produto:', error);
        throw error;
      }),
    );
  }

  /**
   * Cria um produto via o serviço Caixa (endpoint /caixa/api/produtos/single)
   * Use quando quiser criar o produto especificamente no serviço Caixa.
   */
  public addProdutoSingleCaixa(produto: Produto): Observable<Produto> {
    console.log(
      'Enviando novo produto para o serviço Caixa (single)...',
      produto,
    );
    return this.http.post<Produto>(this.caixaSingleUrl, produto).pipe(
      catchError((error) => {
        console.error('Erro ao adicionar produto no Caixa (single):', error);
        throw error;
      }),
    );
  }

  // Método corrigido: o tipo genérico do post agora é 'number' para corresponder ao retorno da API.
  public salvarTransacao(produtos: Produto[]): Observable<number> {
    console.log('Enviando transação para a API de caixa...', produtos);
    // A API de back-end retorna um valor (BigDecimal), não um objeto Produto.
    // Alteramos o tipo genérico aqui para 'number'.
    return this.http.post<number>(this.caixaBulkUrl, produtos).pipe(
      catchError((error) => {
        console.error('Erro ao salvar a transação:', error);
        throw error;
      }),
    );
  }

  public updateProduto(produto: Produto): Observable<Produto> {
    const url = `${this.apiUrl}/${produto.id}`;
    console.log(`Atualizando produto na URL ${url}...`, produto);
    return this.http.put<Produto>(url, produto).pipe(
      catchError((error) => {
        console.error('Erro ao atualizar produto:', error);
        throw error;
      }),
    );
  }

  public deleteProduto(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log(`Deletando produto na URL ${url}...`);
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Erro ao deletar produto:', error);
        throw error;
      }),
    );
  }
}
