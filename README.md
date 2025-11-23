> [!IMPORTANT]
> Projeto ainda em desenvolvimento.

# VacinaCard - Plataforma de Controle de Vacinação

Este projeto visa modernizar e otimizar o processo de imunização, oferecendo uma solução robusta e integrada que atende às necessidades de pacientes, profissionais de saúde e gestores.

Em um cenário onde a precisão de dados e a eficiência logística são cruciais para a saúde pública, esta plataforma foi concebida para superar desafios como a fragmentação de informações e a dificuldade no controle de estoque. Ao centralizar as operações em um ambiente digital seguro, o sistema assegura a rastreabilidade das vacinas e contribui para um serviço mais ágil e transparente para a população.

## 🚀 Funcionalidades Principais

A arquitetura completa do sistema é baseada em três pilares funcionais:

* **Gestão de Usuários e Autenticação:**
    * Cadastro de Pacientes (funcionando como um cartão de vacinação digital).
    * Cadastro de Profissionais de Saúde (médicos, enfermeiros) com rastreabilidade de ações.
    * Sistema de login seguro com autenticação para proteger os dados.
* **Gestão de Vacinas e Logística:**
    * Cadastro detalhado de tipos de vacinas (fabricante, doses, intervalo, etc.).
    * Controle de estoque em tempo real, com atualização automática a cada aplicação.
    * Registro e rastreabilidade de lotes, incluindo data de validade.
* **Processo de Vacinação e Acesso do Paciente:**
    * Registro da aplicação da vacina pelo profissional de saúde.
    * Consulta do histórico completo de vacinação pelo paciente.
    * Geração de Comprovante Digital.
    * Visualização de próximas doses pendentes ou recomendadas.

## 🛠️ Tecnologias

* **Front-end:** React
* **Back-end:** Node.js
* **Banco de Dados:** PostgreSQL (Atualmente configurado com PostgreSQL via Docker)
* **ORM**: Sequelize
* **Containerização:** Docker

## 📚 Documentação
Disclaimer: As documentação das features Back e Front estão no Notion do projeto
- **[🗄️ Banco de Dados / ORM](./docs/DATABASE.md)** - Documentação completa do banco de dados da aplicação
- **[🐳 Docker](./Docs/DOCKER.md)** - Comandos do Docker
- **[Git](./Docs/GIT.md)** - Comandos do Git


## 🏁 Como Executar o Projeto

Para rodar o **Backend** do projeto na sua máquina, siga os passo a passos abaixo.

### 1. Pré-requisitos
* [Node.js](https://nodejs.org/en)
* [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/)
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Visual Studio Code](https://code.visualstudio.com/)

### 2. Clonando o Projeto
```bash
git clone [https://github.com/Rafael8353/plataforma-controle-vacinacao.git](https://github.com/Rafael8353/plataforma-controle-vacinacao.git)
```

### 3. Abra a pasta no VS Code
```bash
code .
```
### 4. Instale as dependências
   ```bash
   npm install
   ```

### 5. Configure as variáveis de ambiente
```bash
   cp .env.example .env
   ```
Edite o arquivo `.env` com suas configurações:
```bash 
DB_USER=user
POSTGRES_USER=user
DB_PASS=sua_senha_segura
POSTGRES_PASSWORD=sua_senha_segura
# ... preencha o restante se necessario
```

### 6. Iniciando o Docker
Com o Docker Desktop em execução, rode o seguinte comando no terminal
``` bash
# Roda os contêineres em modo "detached" (em segundo plano)
docker-compose up -d
```

### 7. Configurando o Banco de dados
```bash
# 1. Roda todas as migrations pendentes
docker-compose exec api npx sequelize-cli db:migrate

# 2. Popula o banco com os dados iniciais (seeders)
docker-compose exec api npx sequelize-cli db:seed:all
```

Pronto! 
A aplicação está rodando.
Para conferir acesse http://localhost:5173 

Para conferir se o backend está funcionando acesse: http://localhost:3000


## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👥 Contribuidores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Rafael8353">
        <img src="https://avatars.githubusercontent.com/u/67080545?v=4" width="100px;" alt="Raul Lize"/><br />
        <sub><b>Rafael da Silveira Gonçales</b></sub>
      </a><br />
      <sub>Desenvolvedor </sub>
    </td>
    <td align="center">
      <a href="https://github.com/LeonardoEnnes">
        <img src="https://github.com/LeonardoEnnes.png" width="100px;" alt="Leonardo Ennes"/><br />
        <sub><b>Leonardo Ennes</b></sub>
      </a><br />
      <sub>Desenvolvedor </sub>
    </td>
    <td align="center">
      <a href="https://github.com/MatheusAlves111">
        <img src="https://github.com/MatheusAlves111.png" width="100px;" alt="Matheus Alves"/><br />
        <sub><b>Matheus Alves</b></sub>
      </a><br />
      <sub>Desenvolvedor </sub>
    </td>
  </tr>
</table>