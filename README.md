<h1>Microserviço com Spring Cloud</h1>

<h2>Visão Geral do Projeto</h2>
<p>
  Este projeto demonstra a criação de um microserviço utilizando o ecossistema Spring Cloud. O principal desafio foi desenvolver uma arquitetura composta por quatro APIs distintas, cada uma com uma função específica. A solução inclui um serviço de descoberta (Eureka Discovery Server), um gateway de API (API Gateway) e duas APIs de serviço com persistência em banco de dados.
</p>
<p>
  O <strong>Eureka Discovery Server</strong> é responsável por gerenciar e monitorar todas as APIs da aplicação. É possível acompanhar o status de cada serviço pela porta 8761. O <strong>API Gateway</strong>, por sua vez, atua como um ponto de entrada único, direcionando as requisições para os endpoints corretos de cada microserviço. Para isso, ele utiliza os nomes registrados no Eureka para fazer o roteamento de forma eficiente.
</p>
<p>
  As duas APIs de serviço foram desenvolvidas para consumir e persistir dados em um banco de dados, completando o ciclo de funcionamento da arquitetura de microserviços.
</p>
<h2>Abaixo está uml de relacionamento das entidades</h2>
<img width="1280" height="244.66" alt="Untitled diagram _ Mermaid Chart-2025-08-10-231305" src="https://github.com/user-attachments/assets/eb0a2f98-efbb-4710-8f78-bf041f5942ec" />

<h2>Tecnologias Utilizadas</h2>
<ul>
  <li><strong>Spring Cloud Client e Server:</strong> Para a criação e orquestração dos microserviços.</li>
  <li><strong>Spring Eureka:</strong> Para o serviço de descoberta e registro de APIs.</li>
  <li><strong>Java:</strong> Linguagem de programação principal.</li>
  <li><strong>Banco de Dados H2:</strong> Banco de dados em memória, ideal para desenvolvimento e testes.</li>
</ul>

<h2>Ferramentas de Desenvolvimento</h2>
<ul>
  <li><strong>VS Code:</strong> Utilizado como IDE principal por ser leve e facilitar o desenvolvimento e execução das APIs.</li>
  <li><strong>Navegador Web:</strong> Para testar o acesso aos serviços pela URL.</li>
  <li><strong>Postman:</strong> Ferramenta para testar e validar todos os endpoints da API.</li>
</ul>

<h2>Conclusão</h2>
<p>
  Embora seja um projeto de microserviço de pequena escala, ele serve como uma excelente base para entender o funcionamento de conceitos essenciais como roteamento de requisições, descoberta de serviços e monitoramento de APIs. A escolha do VS Code como ferramenta principal foi motivada pela sua facilidade de uso e desempenho, que se mostrou superior em relação a outras IDEs para este tipo de projeto.
</p>

 <h1>Projeto Front-end: Sistema de Caixa</h1>

  <p>Este projeto foi desenvolvido para simular um sistema de caixa. Ele permite o cadastro de clientes e produtos, e a realização de vendas com o cálculo total no checkout.</p>

  <h2>Construção e Funcionalidades</h2>

  <p>O frontend do sistema possui três rotas principais: uma para o cadastro de clientes, outra para o cadastro de produtos, e uma terceira rota de caixa, que simula a saída de produtos, associando-os a um cliente e gerando o valor total da compra.</p>

  <h2>Tecnologias e Ferramentas</h2>

  <p>As tecnologias utilizadas no projeto foram <strong>Angular 19</strong>, com <strong>Angular Material</strong>, <strong>CSS</strong> e <strong>HTML</strong>. Para o desenvolvimento, foram usadas as ferramentas <strong>VS Code</strong> e as <strong>DevTools do navegador</strong>.</p>

  <h1>Print</h1>
<img width="1366" height="768" alt="11" src="https://github.com/user-attachments/assets/8100cee4-84d8-4234-99a1-055c5fde52f1" />
<img width="1366" height="768" alt="12" src="https://github.com/user-attachments/assets/9fffaaa7-b600-40ed-ba1b-4da4506daaf2" />
<img width="1366" height="768" alt="13" src="https://github.com/user-attachments/assets/f3055ddb-4863-4094-b45c-f754262b1c1a" />

