const express = require('express')
const expHandlebars = require('express-handlebars')
const path = require('path')
const multer = require('multer');
const Filme = require('../db/connection')

const aplicacao = express();

aplicacao.use(express.static(path.join(__dirname, '../public')));

aplicacao.use('/uploads', express.static(path.join(__dirname, '../uploads')));

aplicacao.use(express.urlencoded({ extended: false }))
aplicacao.use(express.json())

aplicacao.engine('handlebars', expHandlebars.engine({
    defaultLayout: 'main',
}));

aplicacao.set('views', path.join(__dirname, '../views'))
aplicacao.set('view engine', 'handlebars')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens (jpg, jpeg, png, webp) são permitidas!'));
    },
});

aplicacao.get('/', (requisicao, resposta) => {
    Filme.findAll().then(function(filmes){
        resposta.render('filmes', {filmes: filmes.map(f => f.toJSON())})
    })
})

aplicacao.get('/filmes/cadastro', (requisicao, resposta) => {
    resposta.render('cadastro')
})

aplicacao.post('/filmes', upload.single('capa'), async(requisicao, resposta) => {
    Filme.create({
        capa: requisicao.file?.filename || null,
        titulo: requisicao.body.titulo,
        diretor: requisicao.body.diretor,
        ano: requisicao.body.ano,
        genero: requisicao.body.genero,
        descricao: requisicao.body.descricao
    }).then(() => {
        console.log('Filme cadastrado:');
        resposta.redirect('/');
    }).catch((erro) => {
        console.error('Erro ao cadastrar filme:' + erro);
    });
})


// Verificao
aplicacao.listen(8000, () => {
    console.log('Inicioou o servidor')
})