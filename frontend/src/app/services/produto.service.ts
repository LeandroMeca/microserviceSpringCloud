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
  providedIn: 'root'
})
export class ProdutoService {

  private readonly apiUrl = 'http://localhost:8080/produtos/api/produtos';

  private readonly caixaUrl = 'http://localhost:8080/caixa/api/produtos';

  constructor(private http: HttpClient) { }

  public getProdutos(): Observable<Produto[]> {
    console.log('Buscando produtos da API...');
    return this.http.get<Produto[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      })
    );
  }

  public addProduto(produto: Produto): Observable<Produto> {
    console.log('Enviando novo produto para a API...', produto);
    return this.http.post<Produto>(this.apiUrl, produto).pipe(
      catchError((error) => {
        console.error('Erro ao adicionar produto:', error);
        throw error;
      })
    );
  }

  // Método corrigido: o tipo genérico do post agora é 'number' para corresponder ao retorno da API.
  public salvarTransacao(produtos: Produto[]): Observable<number> {
    console.log('Enviando transação para a API de caixa...', produtos);
    // A API de back-end retorna um valor (BigDecimal), não um objeto Produto.
    // Alteramos o tipo genérico aqui para 'number'.
    return this.http.post<number>(this.caixaUrl, produtos).pipe(
      catchError((error) => {
        console.error('Erro ao salvar a transação:', error);
        throw error;
      })
    );
  }

  public updateProduto(produto: Produto): Observable<Produto> {
    const url = `${this.apiUrl}/${produto.id}`;
    console.log(`Atualizando produto na URL ${url}...`, produto);
    return this.http.put<Produto>(url, produto).pipe(
      catchError((error) => {
        console.error('Erro ao atualizar produto:', error);
        throw error;
      })
    );
  }

  public deleteProduto(id: number): Observable<void> {
   const url = `${this.apiUrl}/${id}`;
    console.log(`Deletando produto na URL ${url}...`);
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Erro ao deletar produto:', error);
        throw error;
      })
    );
  }
}
