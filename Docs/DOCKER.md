# Docker
⬅️ **[Voltar para README.md](../README.md)**

Comandos úteis para o Docker


```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Ver logs da aplicação
docker-compose logs app

# Reconstruir containers
docker-compose up --build

# Limpar volumes (cuidado: remove dados do banco)
docker-compose down -v
```

**Listar containers**

```bash
docker ps
```
