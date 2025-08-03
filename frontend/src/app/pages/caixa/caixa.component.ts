import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CaixaService, Cliente } from '../../services/caixa.service'; // Importa o serviço e a interface do cliente
import { ModalClienteComponent } from '../../components/modal-cliente/modal-cliente.component'; // Importa o modal

@Component({
  selector: 'app-caixa',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './caixa.component.html',
  styleUrls: ['./caixa.component.css']
})
export class CaixaComponent implements OnInit {

  // As colunas da tabela de clientes
  displayedColumns: string[] = ['id', 'nome'];
  clientes: Cliente[] = [];

  constructor(
    private caixaService: CaixaService,
    private dialog: MatDialog // Injeta o serviço de diálogo do Angular Material
  ) { }

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

  // Método para abrir o modal quando um cliente é clicado
  abrirModal(cliente: Cliente): void {
    // Abre o modal e passa o objeto 'cliente' para ele
    this.dialog.open(ModalClienteComponent, {
      width: '800px', // Define a largura do modal para acomodar a tabela
      data: cliente
    });
  }
}
