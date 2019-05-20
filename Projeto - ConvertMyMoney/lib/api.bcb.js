const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`


//Pegando a URL da api do Banco central
const getCotacaoAPI = url => axios.get(url)

//Pegando a posição do Vetor onde me informa a cotacaoVenda
const extractCotacao = res => res.data.value[0].cotacaoVenda

const getToday = () =>{
    const today = new Date()
    return (today.getMonth()+1)+ '-'+today.getDate()+'-'+today.getFullYear()
}

//Vai tentar entrar na API do Banco Central, caso não consiga vai retornar vazio.
const getCotacao = ({ getToday, getUrl, getCotacaoAPI, extractCotacao }) => async() =>{
    try{
        const today = getToday()
        const url = getUrl(today)
        const res = await getCotacaoAPI(url)
        const cotacao = extractCotacao(res)
        return cotacao
    }catch(err){
        return ''
    }    
}

module.exports = {
    getCotacaoAPI,
    getCotacao: getCotacao({getToday, getUrl, getCotacaoAPI, extractCotacao}),
    extractCotacao,
    getUrl,
    getToday,
    pure:{
        getCotacao
    }
}