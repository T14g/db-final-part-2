# App que consome a API do GitHub

Projeto criado para consumir a API do GitHub buscando repositórios de uma company e podendo ver detalhes como contribuidores e issues do repositório.
É possível ainda ver detalhes do issue como descrição e comentários.
Neste projeto não foi usado Sass pois o foco foi bootstrap e um pouco de css apenas para pequenos ajustes.

# Requisitos
O projeto roda diretamente no Google Chrome ou Firefox abrindo o index.html

## Tecnologias utilizadas:

- Javascript
- Jquery
- Toastr
- Bootstrap 4
- HTML 5
- CSS3
- GitHub API

## Coisas que não foram pedidas mas resolvi implementar
- Funcionalidade Load More( carregar mais ) repositórios
- Exibe contribuidores com menos de 100 contribuições caso a soma dos outros 3 esteja abaixo de 20 contribuidores.

## O que acontece

O usuário deve digitar o nome de uma company por exemplo azure, microsoft, apple e pesquisar.
Ao pesquisar , caso existam repositórios desta company eles serão listados em uma table.
Também é possível usar o recurso "Carregar mais" , que tenta carregar mais repositórios daquela company.

Ao clicar em detalhes o usuário verá os colaboradores do repositório agrupados por número de contribuições.
Também verá uma aba chamada Issues onde ele pode ver os Issues daquele repositório, podendo filtrar issues por state.
Na listagem de issues é possível abrir a Issue e ver sua descrição e seus comentários. 
O usuário pode fechar os detalhes da issue e voltar a listagem de issues ou ir para a listagem de repositórios inicial com o botão de retornar a listagem de repositórios.

