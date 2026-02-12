import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ProdutoService, Produto } from '../../services/produto.service';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
})
export class ProdutoComponent implements OnInit {
  // As colunas que serão exibidas na tabela
  displayedColumns: string[] = ['nome', 'descricao', 'preco', 'acoes'];
  // Usar MatTableDataSource para estabilidade e atualização segura da tabela
  dataSource = new MatTableDataSource<Produto>();
  // Objeto para o formulário
  novoProduto: Produto = { nome: '', descricao: '', preco: 0 };
  // Objeto para controle do modo de edição
  produtoEmEdicao: Produto | null = null;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    // Ao inicializar, carrega a lista de produtos
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (data) => {
        // Atualiza o dataSource sem substituir a referência para evitar problemas
        this.dataSource.data = data || [];
      },
      error: (error) => {
        console.error('Falha ao carregar produtos:', error);
      },
    });
  }

  salvarProduto(): void {
    if (
      this.novoProduto.nome &&
      this.novoProduto.descricao &&
      this.novoProduto.preco > 0
    ) {
      if (this.produtoEmEdicao) {
        this.produtoService
          .updateProduto(this.novoProduto as Produto)
          .subscribe({
            next: (produtoAtualizado) => {
              console.log('Produto atualizado com sucesso:', produtoAtualizado);
              this.loadProdutos();
              this.limparFormulario();
            },
            error: (error) => {
              console.error('Falha ao atualizar produto:', error);
            },
          });
      } else {
        this.produtoService.addProduto(this.novoProduto).subscribe({
          next: (produtoSalvo) => {
            console.log('Produto salvo com sucesso:', produtoSalvo);
            this.loadProdutos();
            this.limparFormulario();
          },
          error: (error) => {
            console.error('Falha ao salvar produto:', error);
          },
        });
      }
    }
  }

  deletarProduto(id: number | undefined): void {
    if (id) {
      this.produtoService.deleteProduto(id).subscribe({
        next: () => {
          console.log(`Produto com ID ${id} deletado com sucesso.`);
          this.dataSource.data = this.dataSource.data.filter(
            (produto) => produto.id !== id,
          );
        },
        error: (error) => {
          console.error('Falha ao deletar produto:', error);
        },
      });
    }
  }

  abrirEdicao(produto: Produto): void {
    this.produtoEmEdicao = { ...produto };
    this.novoProduto = { ...produto };
  }

  limparFormulario(): void {
    this.novoProduto = { nome: '', descricao: '', preco: 0 };
    this.produtoEmEdicao = null;
  }
}
