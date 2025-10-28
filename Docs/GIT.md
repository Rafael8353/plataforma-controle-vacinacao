# Git

Separei algumas dicas para o versionamento no projeto.

`git config --global pull.rebase true pra configurar todo pull com rebase por default, evita muito conflito e te força a trabalhar com versionamento por stash`

**Branchs**

Branchs são ramificações da main(ou master) e elas servem para trabalhar em conjunto em outras features ao mesmo tempo sem causar confusão

**Como escrever commits?**

Sempre utilize commits semânticos, De preferencia no mesmo padrão dos outro.

Se foi escrito em inglês, escreva tmb

https://blog.geekhunter.com.br/o-que-e-commit-e-como-usar-commits-semanticos/

**Se tiver uma alteração na main enquanto estou trabalhando? O que fazer?**

Digamos que você fez algumas alterações mas ainda não commitou e acabou descobrindo que alguém commitou na na main

```bash
git status # checar a propria branch
```

```bash
git stash push -m "WIP: trabalando...."  # O stash serve para guardar as suas alterações
```

```bash
#troque para main para fazer o pull com o rebase (ja configurado)
git checkout main
git pull

# depois volte pra sua branch
git checkout feature/add-login

# da um rebase 
git rebase main
```

```bash
# reaplique as coisas do seu stash
git stash pop

```

```bash
# se aparecer conflitos quando der um pop, resolva eles
git add <file>
git rebase --continue   # if it was still in rebase

```

```bash
# depois de checar tudo, remova o stash
git stash list
git stash drop stash@{0}   # 

# depois de um update na sua branch
git push --force-with-lease

```