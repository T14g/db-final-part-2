$(document).ready(function(){

    //Default variables
    var companyRepositories = [], companyName = '', repositoryIssues = [];


    //Event handler da pesquisa de repositories
    $('#search-repos').click(function(e){
        e.preventDefault();

        $('.table-repositories').show();
        $('.repository-details').addClass('d-none').hide();

        //Default value para testes em Dev
        $('#companyName').val("azure");
        var company = $('#companyName').val();

        saveCompany(company);

        //Faz um GET e renderiza os repositórios
        getRepositories(company);

    });

    $('#filter-issues').click(function(e){
        e.preventDefault();
        filterIssues();
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

//Salva os issues do repositório localmente
function saveIssues(issues) {
    repositoryIssues = issues;
}

//Exibe detalhes do repositório selecionado
function repositoryDetails(repoID) {

    var repository = {};

    companyRepositories.forEach(function(repo){
        if(repo.id === repoID) {
            repository = repo;
        }
    });

    // console.log(repository);

    getContributors(companyName, repository.name);
    getIssues(companyName, repository.name);
    
    $('.repository-name').html(repository.full_name);
    
    $('.table-repositories').hide();
    $('.issue-details').hide();
    $('.issues-list').show();
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
        html += '<a href="#" class="list-group-item list-group-item-action list-group-item-danger font-weight-bold">Acima de 500 contribuições</a>';

        contributors.over_500.forEach(function(contributor) {
            if(limit < 20) {
                html += '<a href="#" class="list-group-item list-group-item-action list-group-item-danger">' + contributor.login + ' com ' + contributor.contributions + ' contribuições.</a>';
                limit++;
            }
        })
    }

    if(contributors.over_200.length > 0 && limit < 20){
        html += '<a href="#" class="list-group-item list-group-item-action list-group-item-warning font-weight-bold">Acima de 200 contribuições</a>';

        contributors.over_200.forEach(function(contributor) {
            if(limit < 20) {
                html += '<a href="#" class="list-group-item list-group-item-action list-group-item-warning">' + contributor.login + ' com ' + contributor.contributions + ' contribuições.</a>';
                limit++;
            }
        })
    }

    if(contributors.over_100.length > 0 && limit < 20){
        html += '<a href="#" class="list-group-item list-group-item-action list-group-item-success font-weight-bold">Acima de 100 contribuições</a>';

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

//GET Issues
function getIssues(companyName, repo){

    axios.get(`https://api.github.com/repos/${companyName}/${repo}/issues`, {
        params: {
            per_page : 100,
            page: 1,
            state: 'all'
        }
    })
        .then(response => {
            var issues = response.data;

            saveIssues(issues);
            renderIssues(issues);

    })
        .catch(error => {
            console.log(error)
    })
}

//Filtra issues por state
function filterIssues() {

    var filter = $('#issueState').val();
    var filtered = [];

    if(filter !== 'all'){

        repositoryIssues.forEach(function(issue){
            if(issue.state === filter ){
                filtered.push(issue);
            }
        });

    }else{
        filtered = repositoryIssues;
    }
    
    renderIssues(filtered);
}


//Renderiza os itens da lista de issues
function renderIssues(data){
    var html = '';

    if(data.length > 0){
        data.forEach(function(issue) {

            html += '<tr>';
            html += '<td>' + issue.number + '</td>';
            html += '<td>' + issue.title + '</td>';
            html += '<td>' + issue.state + '</td>';
            html += '<td><button class="btn btn-success w-100" onClick="issueDetails(' + issue.number + ')">Detalhes</button></td>';
            html += '</tr>';

        })
    }

    $('.table-issues tbody').html(html);
}

//Mostra os detalhes de uma issue
function issueDetails(issueNumber) {

    var selected = {};

    repositoryIssues.forEach(function(issue){
        if(issue.number === issueNumber){
            selected = issue;
        }
    })


    getIssueComments(selected.comments_url);

    var issueTitle = '#' + selected.number + ' ' + selected.title;

    $('.details-issue-title').html(issueTitle);
    $('.details-issue-description').html(selected.body);

    $('.issues-list').hide();
    $('.issue-details').removeClass('d-none').show();


}

//GET comentários de uma issue
function getIssueComments(url) {

    axios.get(url, {
        params: {
            per_page : 100,
            page: 1
        }
    })
        .then(response => {
            renderComments(response.data);
    })
        .catch(error => {
            console.log(error)
    })
}

//Renderiza os comentários da issue
function renderComments(data) {

    var html = '';

    if(data.length > 0) {
        data.forEach(function(issue){
            console.log(issue);
            html += '<div class="pt-3">';
            html += '<p class="pb-3 mb-0 small border-bottom border-gray">';
            html += '<strong class="d-block text-gray-dark">@' + issue.user.login + '</strong>';
            html += issue.body;
            html +='</p></div>';
        })
    }

    $('.issue-comments-container').html(html);

}