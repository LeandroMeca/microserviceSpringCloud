import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CaixaService, Cliente } from '../../services/caixa.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'acoes'];
  clientes: Cliente[] = [];
  novoCliente: Cliente = { nome: '' };
  clienteEmEdicao: Cliente | null = null;

  constructor(private caixaService: CaixaService) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.caixaService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Falha ao carregar clientes:', error);
      }
    });
  }

  salvarCliente(): void {
    // Adicionei este log para saber se a função é chamada
    console.log('salvarCliente() foi chamado. Verificando o cliente:', this.novoCliente);

    if (this.novoCliente.nome) {
      if (this.clienteEmEdicao) {
        this.caixaService.updateCliente(this.novoCliente as Cliente).subscribe({
          next: (clienteAtualizado) => {
            console.log('Cliente atualizado com sucesso:', clienteAtualizado);
            this.loadClientes();
            this.limparFormulario();
          },
          error: (error) => {
            console.error('Falha ao atualizar cliente:', error);
          }
        });
      } else {
        this.caixaService.addCliente(this.novoCliente).subscribe({
          next: (clienteSalvo) => {
            console.log('Cliente salvo com sucesso:', clienteSalvo);
            this.loadClientes();
            this.limparFormulario();
          },
          error: (error) => {
            console.error('Falha ao salvar cliente:', error);
          }
        });
      }
    } else {
      console.warn('O campo "nome" está vazio. Não foi possível salvar o cliente.');
    }
  }

  deletarCliente(id: number | undefined): void {
    if (id) {
      this.caixaService.deleteCliente(id).subscribe({
        next: () => {
          console.log(`Cliente com ID ${id} deletado com sucesso.`);
          this.clientes = this.clientes.filter(cliente => cliente.id !== id);
        },
        error: (error) => {
          console.error('Falha ao deletar cliente:', error);
        }
      });
    }
  }

  abrirEdicao(cliente: Cliente): void {
    this.clienteEmEdicao = { ...cliente };
    this.novoCliente = { ...cliente };
  }

  limparFormulario(): void {
    this.novoCliente = { nome: '' };
    this.clienteEmEdicao = null;
  }
}
