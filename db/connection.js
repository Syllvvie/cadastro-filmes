const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'./db/app.db'
})

sequelize.authenticate().then(function(){
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
}).catch(function(erro){
    console.error('Não foi possível conectar ao banco de dados:' + erro);
});

const Filme = sequelize.define('filmes', {
    capa: {
        type: Sequelize.STRING
    },
    titulo: {   
        type: Sequelize.STRING
    },
    diretor: {
        type: Sequelize.STRING
    },
    ano: {
        type: Sequelize.STRING
    },
    genero: {
        type: Sequelize.STRING
    },
    descricao: {
        type: Sequelize.TEXT
    },
});

Filme.sync({force: true}) // comente para parar de resetar a db

module.exports = Filme

