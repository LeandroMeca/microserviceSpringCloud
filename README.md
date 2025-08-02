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
<img width="400" height="400" alt="uml" src="https://github.com/user-attachments/assets/33cf6110-5e11-4243-92b6-fb26a09668fa" />

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
