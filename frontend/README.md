# Caixa

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Observações sobre o backend (API)

A aplicação front-end consulta a API em `http://localhost:8080/caixa/api/...` por padrão. Se a API backend não estiver rodando, alguns dados (por exemplo, lista de clientes) não irão carregar e você verá erros do tipo `Http failure response` no console do terminal ou no console do navegador.

Para evitar os erros durante o desenvolvimento, inicie o(s) serviço(s) backend correspondente(s) (normalmente o microservice Spring boot presente no repositório principal) ou ajuste as URLs de API nas configurações do front.

Para parar o servidor de desenvolvimento do Angular, use Ctrl+C no terminal onde `ng serve` está rodando.
