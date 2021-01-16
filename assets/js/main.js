$(document).ready(function(){

    //Default variables
    var companyRepositories = [], companyName = '';


    //Event handler da pesquisa de repositories
    $('#search-repos').click(function(e){
        e.preventDefault();

        $('.table-repositories').show();
        $('.repository-details').addClass('d-none').hide();

        //Default value para testes em Dev
        $('#companyName').val("apple");
        var company = $('#companyName').val();

        saveCompany(company);

        //Faz um GET e renderiza os repositórios
        getRepositories(company);

    });

});

//Faz um GET retornando os repositórios e chama a renderRepositories()
function getRepositories(company){

    axios.get(`https://api.github.com/orgs/${company}/repos`, {
        params: {
            per_page : 100
        }
    })
        .then(response => {
            var repos = response.data;
            saveRepositories(repos);
            renderRepositories(repos);
    })
        .catch(error => {
            console.log(error)
    });
}


//Renderiza os repositórios na tabela de repositórios
function renderRepositories(data) {

    let html = '';

    data.map(repo => {
        html += '<tr>';
        html += '<td>' + repo.id + '</td>';
        html += '<td>' + repo.full_name + '</td>';
        html += '<td><button class="btn btn-success w-100" onClick="repositoryDetails(' + repo.id + ')">Detalhes</button></td>';
        html += '</tr>';
    })

    $('.table-repositories tbody').html(html);

}

//Salva os repositórios da company localmente
function saveRepositories(repos) {
    companyRepositories = repos;
}

//Salva o nome da company
function saveCompany(name) {
    companyName = name;
}

//Exibe detalhes do repositório selecionado
function repositoryDetails(repoID) {

    var repository = {};

    companyRepositories.forEach(function(repo){
        if(repo.id === repoID) {
            repository = repo;
        }
    });

    console.log(repository);

    getContributors(companyName, repository.name);
    
    $('.repository-name').html(repository.full_name);
    
    $('.table-repositories').hide();
    $('.repository-details').removeClass('d-none').show();

}

//GET contribuidores
function getContributors(companyName, repo){

    axios.get(`https://api.github.com/repos/${companyName}/${repo}/contributors`, {
        params: {
            per_page : 100,
            page: 1
        }
    })
        .then(response => {
            var data = response.data;
            separateContributors(data);
    })
        .catch(error => {
            console.log(error)
    })
}

//Separa os contribuidores por número de contribuições
function separateContributors(data){

    var result = { over_100 : [], over_200: [], over_500: [], others : [] };

    data.forEach(function(contributor){

        if(contributor.contributions > 100 && contributor.contributions < 200){
            result.over_100.push(contributor);

        }else if(contributor.contributions > 200 && contributor.contributions < 500){
            result.over_200.push(contributor);

        }else if(contributor.contributions > 500){
            result.over_500.push(contributor);
        }else{
            result.others.push(contributor);
        }

    });

    renderContributors(result);

}

//Renderiza os contribuidores
function renderContributors(contributors) {
    var html  = '';
    var limit = 0;

    if(contributors.over_500.length > 0 && limit < 20){
        html += '<a href="#" class="list-group-item list-group-item-action list-group-item-danger font-weight-bold">Acima de 500 contribuíções</a>';

        contributors.over_500.forEach(function(contributor) {
            if(limit < 20) {
                html += '<a href="#" class="list-group-item list-group-item-action list-group-item-danger">' + contributor.login + ' com ' + contributor.contributions + ' contribuições.</a>';
                limit++;
            }
        })
    }

    if(contributors.over_200.length > 0 && limit < 20){
        html += '<a href="#" class="list-group-item list-group-item-action list-group-item-warning font-weight-bold">Acima de 200 contribuíções</a>';

        contributors.over_200.forEach(function(contributor) {
            if(limit < 20) {
                html += '<a href="#" class="list-group-item list-group-item-action list-group-item-warning">' + contributor.login + ' com ' + contributor.contributions + ' contribuições.</a>';
                limit++;
            }
        })
    }

    if(contributors.over_100.length > 0 && limit < 20){
        html += '<a href="#" class="list-group-item list-group-item-action list-group-item-success font-weight-bold">Acima de 100 contribuíções</a>';

        contributors.over_100.forEach(function(contributor) {
            if(limit < 20) {
                html += '<a href="#" class="list-group-item list-group-item-action list-group-item-success">' + contributor.login + ' com ' + contributor.contributions + ' contribuições.</a>';
                limit++;
            }
        })
    }

    if(contributors.others.length > 0 && limit < 20){
        html += '<a href="#" class="list-group-item list-group-item-action font-weight-bold">Outros contribuidores</a>';

        contributors.others.forEach(function(contributor) {
            if(limit < 20) {
                html += '<a href="#" class="list-group-item list-group-item-action ">' + contributor.login + ' com ' + contributor.contributions + ' contribuições.</a>';
                limit++;
            }
        })
    }

    $('.list-contributors').html(html);

}