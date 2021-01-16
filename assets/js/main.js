$(document).ready(function(){

    //Default variables
    var companyRepositories = [];


    //Event handler da pesquisa de repositories
    $('#search-repos').click(function(e){
        e.preventDefault();

        $('.table-repositories').show();
        $('.repository-details').addClass('d-none').hide();

        //Default value para testes em Dev
        $('#companyName').val("apple");
        var company = $('#companyName').val();

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

//Exibe detalhes do repositório selecionado
function repositoryDetails(repoID) {

    var repository = {};
    var company    = $('#companyID').val();

    companyRepositories.forEach(function(repo){
        if(repo.id === repoID) {
            repository = repo;
        }
    });
    
    $('.repository-name').html(repository.full_name);
    
    $('.table-repositories').hide();
    $('.repository-details').removeClass('d-none').show();

}