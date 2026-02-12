import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Cliente } from '../../services/caixa.service';
import { ProdutoService, Produto } from '../../services/produto.service';

interface ProdutoComQuantidade extends Produto {
  quantidade: number;
}

interface ItemCarrinho extends ProdutoComQuantidade {
  cliente: Cliente;
}

@Component({
  selector: 'app-modal-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDividerModule,
    MatExpansionModule,
    CurrencyPipe,
  ],
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css'],
})
export class ModalClienteComponent implements OnInit {
  displayedProductsColumns: string[] = ['nome', 'preco', 'quantidade', 'acao'];
  // Usar MatTableDataSource para estabilidade nas tabelas
  produtos: ProdutoComQuantidade[] = [];
  produtosDataSource = new MatTableDataSource<ProdutoComQuantidade>();

  displayedCartColumns: string[] = [
    'nome',
    'preco',
    'quantidade',
    'total',
    'remover',
  ];
  carrinho: ItemCarrinho[] = [];

  vendaFinalizada: boolean = false;
  valorTotalVenda: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public cliente: Cliente,
    private produtoService: ProdutoService,
  ) {}

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (data) => {
        const mapped = (data || []).map((produto) => ({
          ...produto,
          quantidade: 1,
        }));
        this.produtos = mapped;
        this.produtosDataSource.data = mapped;
      },
      error: (error) => {
        console.error('Falha ao carregar produtos no modal:', error);
      },
    });
  }

  adicionarAoCarrinho(produto: ProdutoComQuantidade): void {
    const produtoExistente = this.carrinho.find(
      (item) => item.nome === produto.nome,
    );
    if (produtoExistente) {
      produtoExistente.quantidade += produto.quantidade;
    } else {
      if (this.cliente) {
        this.carrinho = [
          ...this.carrinho,
          { ...produto, cliente: this.cliente, quantidade: produto.quantidade },
        ];
      } else {
        console.error('Dados do cliente não estão disponíveis.');
      }
    }
  }

  removerDoCarrinho(produtoId: number | undefined): void {
    this.carrinho = this.carrinho.filter((produto) => produto.id !== produtoId);
  }

  calcularTotalItem(produto: ItemCarrinho): number {
    return (produto.preco || 0) * (produto.quantidade || 0);
  }

  calcularTotalCarrinho(): number {
    return this.carrinho.reduce(
      (acc, produto) => acc + this.calcularTotalItem(produto),
      0,
    );
  }

  confirmarVenda(): void {
    if (this.carrinho.length === 0) {
      console.warn('O carrinho está vazio. Nenhuma venda será salva.');
      return;
    }

    const produtosParaSalvar: Produto[] = [];

    this.carrinho.forEach((item) => {
      for (let i = 0; i < item.quantidade; i++) {
        const produtoParaSalvar: Produto = {
          nome: item.nome,
          descricao: item.descricao,
          preco: item.preco,
          cliente: item.cliente,
        };
        produtosParaSalvar.push(produtoParaSalvar);
      }
    });

    this.produtoService.salvarTransacao(produtosParaSalvar).subscribe({
      next: (response: any) => {
        console.log('Resposta bruta da API:', response);
        console.log('Tipo da resposta da API:', typeof response);

        let valorRetornado = 0;
        // Tenta extrair o valor do objeto, se for um.
        if (typeof response === 'object' && response !== null) {
          // Tenta extrair o valor das chaves mais comuns, como 'valor', 'total' ou 'value'.
          // Ajuste esta lógica se a sua API usar uma chave diferente.
          if (response.valor !== undefined) {
            valorRetornado = Number(response.valor);
          } else if (response.total !== undefined) {
            valorRetornado = Number(response.total);
          } else if (response.value !== undefined) {
            valorRetornado = Number(response.value);
          } else {
            // Caso não seja um dos campos acima, imprime um aviso para depuração
            console.warn(
              'Resposta da API é um objeto sem a chave esperada (valor, total, ou value).',
            );
          }
        } else if (
          typeof response === 'number' ||
          typeof response === 'string'
        ) {
          // Se a resposta já é um número ou string, converte diretamente
          valorRetornado = Number(response);
        }

        // Verifica se a conversão foi bem-sucedida antes de atribuir
        if (!isNaN(valorRetornado)) {
          this.valorTotalVenda = valorRetornado;
          this.vendaFinalizada = true;
        } else {
          console.error(
            'Erro: o valor retornado pela API não é um número válido.',
            response,
          );
          // Ainda exibimos o modal para que o usuário veja a falha
          this.vendaFinalizada = true;
        }
      },
      error: (error) => {
        console.error('Erro ao salvar a transação:', error);
        this.vendaFinalizada = true;
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  fecharModal(): void {
    this.dialogRef.close();
  }
}
