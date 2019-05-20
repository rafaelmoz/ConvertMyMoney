const express = require('express')
const app = express()
const path = require('path')
const convert = require('./lib/convert')
const apiBCB = require('./lib/api.bcb')

//Setar quem vai ser responsável pela parte das Views, nesse caso o EJS
app.set('view engine', 'ejs')

//Informar em que diretório vão estar as views no caso a pasta views
app.set('views', path.join(__dirname, 'views'))

//Informar onde os nosso arquivos de css vão estar no caso a pasta public
//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname + '/public'))

//Definindo a nossa página principal '/'
app.get('/', async(req, res) =>{
    const cotacao = await apiBCB.getCotacao()
    console.log('cotacao', cotacao)
    res.render('home',{
        cotacao
    })
})


//Configuração para rodar no heroku
const port = process.env.PORT || 8080
app.listen(port)

//Definindo a página de cotação
app.get('/cotacao', (req, res)=>{
    const { cotacao, quantidade } = req.query
    if(cotacao && quantidade){
        const conversao = convert.convert(cotacao, quantidade)
        res.render('cotacao', {
            error: false,
            cotacao: convert.toMoney(cotacao),
            quantidade: convert.toMoney(quantidade),
            conversao: convert.toMoney(conversao)
        })
    }else{
        res.render('cotacao',{
            error: 'Valores Inválidos!'
        })
    }
})