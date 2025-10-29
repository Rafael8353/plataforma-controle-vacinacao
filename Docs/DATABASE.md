## Banco de dados
⬅️ **[Voltar para README.md](../README.md)**

O banco é uma parte importante para o desenvolvimento das features, sem ele não haveria como realizar o desenvolvimento.

Separei comandos importantes para acessar, criar migrations e popular o banco utilizando a **ORM Sequelize** do projeto.

Lembrete: Deixei um curso e a documentação do sequelize na pasta de [recomendações](https://www.notion.so/Recomenda-es-28538a45e45680b1b2feca270d19db55?pvs=21) 


Diagrama da base de dados: https://dbdiagram.io/d/Plataforma-Controle-Vacinacao-68db4528d2b621e4227f9fab

**Para entrar no container do banco:**

Substitua pelos valores do `.env`

```bash
docker-compose exec db psql -U {DB_USER} -d controle-vacinacao-db
```

**Inserindo as migrations no Banco:**

```bash
# Se as migrations já estiverem prontas / Você quer implementar uma no banco faça:
docker-compose exec api npx sequelize-cli db:migrate
```

**Para executar os Seeder e popular o banco:** 

```bash
# aqui você vai executar todas as seeders
docker-compose exec api npx sequelize-cli db:seed:all

# apenas a seeder especifica
docker-compose exec api npx sequelize-cli db:seed:nome_da_seed
```

**Para verificar se as tabelas estão criadas:**

Dentro do banco execute a query

```bash
# substitua Users pela tabela que quer verificar
SELECT * FROM "Users";
```

---

**Como migrations são criadas?**

```bash
docker-compose exec api npx sequelize-cli migration:create --name=create-users 
# sempre com o verbo create + a tabela
```

**Se precisar remover a migration:**

```bash
# isso vai desfazer a ultima vez que você rodou o dbmigrate (somente a ultima migration) => 
# isso serve pro ambiente de desenvolvimento
docker-compose exec api npx sequelize-cli db:migrate:undo

# Curiosidade: Para ambiente de produção (n vai ser nosso caso em nenhum momento eu acho)
# Em ambiente de produção não há como dar rollback na migration
# Isso significa que terá que criar uma nova migration implementando o que esqueceu
# Ex: Esqueci de adicionar data na coluna de user
docker-compose exec api npx sequelize-cli migration:create --name=add-age-to-users
```

**Como criar Seeders?**

```bash
docker-compose exec api npx sequelize-cli seed:generate --name demo-users
```

**Para desfazer o último seed:**

```bash
docker-compose exec api npx sequelize-cli db:seed:undo
```

---

Explicações

**Porque precisou do file sequelizerc no projeto?**

Pois para rodar o comando `npx sequelize-cli db:migrate`  na aplicação é necessario esse arquivo apontando senhas e endereços do banco de dados.