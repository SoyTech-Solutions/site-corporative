var btnProductivity = document.querySelector('#btn_produtividade');

btnProductivity.addEventListener('click', function () {
    var totalHectare = Number(document.querySelector('#txt_qtdHectare').value);
    var plantsMq = Number(document.querySelector('#txt_qtdPlantaMq').value);
    var podAmountByPlant = Number(document.querySelector('#txt_qtdVagemPlanta').value);
    var grainAmount = Number(document.querySelector('#txt_graoVagem').value);
    var grainWeight100 = Number(document.querySelector('#txt_peso100graos').value);

    var priceBag = Number(document.querySelector('#txt_precoSacas').value);


    // verificando campos vazios
    if (totalHectare != '' && plantsMq != '' && podAmountByPlant != '' && grainAmount != '' && grainWeight100 != '' && priceBag != '') {
        //============ CALCULO LÓGICA AQUI ===============

        // quantidade de grãos por metro quadrado (plantas x vagens x graos)
        var grainsByMq = plantsMq * podAmountByPlant * grainAmount;

        // grãos totais em um hectare (graos total em 1m quadrado x 1000)
        var grainsByHectare = grainsByMq * 1000;

        // peso dessa "colheita" EM KG - em um unico hectare
        var grainsWeightByHectareG = grainWeight100 * grainsByHectare; // considerando n gramas a cada grãos

        // POTENCIAL produtividade (sem perdas)
        var potentialProductivityKgHa = grainsWeightByHectareG / 1000; // convertendo para kg
        var potentiaProductivityBagHa = potentialProductivityKgHa / 60 // considerando sacas de 60kg

        // REAL produtividade (com perdas)
        var realProductivityKgHa = potentialProductivityKgHa * ((100 - 47) / 100); // considerando a perda de 47%
        var realProductivityBagHa = realProductivityKgHa / 60;


        //============ APRESENTAÇÃO DOS CARDS ===============

        // === perdas
        var lossProductivity = potentialProductivityKgHa * 0.47; // considerando a perda de 47%

        // === nível do produtor
        var producerStatus;
        if (realProductivityBagHa < 90) {
            producerStatus = `iniciante`;
        } else if (realProductivityBagHa < 110) {
            producerStatus = `médiano`;
        } else if (realProductivityBagHa >= 110) {
            producerStatus = 'avançado';
        }

        // === qualidade
        var celciusDegree = Number(document.querySelector('#txt_temperaturaCelcius').value);
        var humidityPercentage = Number(document.querySelector('#txt_qtdUmidadePercentual').value);

        var grainQuality; // qualidade
        var grainQualitySentence; // frase 

        // medindo a "qualidade" (boa ou ruim, true e false)
        // e a frase individual
        var celciusQuality;
        var celciusSentence;
        var humidityQuality;
        var humiditySentence;

        if (celciusDegree == 0 || humidityPercentage == 0) {
            humidityQuality = false;
            celciusQuality = false;
            grainQuality = 'duvidosa'
            grainQualitySentence = 'Pois não possui um sistema de termometria e/ou umidade!'
        } else {

            if (celciusDegree < 20) {
                celciusQuality = false;
                celciusSentence = 'Temperatura <b>abaixo do ideal!</b> Deve estar entre 20-30°C';
            } else if (celciusDegree <= 30) {
                celciusQuality = true;
                celciusSentence = 'A temperatura esta <b>perfeita!</b> Entre 20-30°C';
            } else if (celciusDegree > 30) {
                celciusQuality = false;
                celciusSentence = 'Temperatura <b>acima do ideal!</b> Deve estar entre 20-30°C';
            }

            if (humidityPercentage >= 12 && humidityPercentage <= 14.5) {
                humidityQuality = true;
                humiditySentence = 'A umidade esta <b>boa!</b> entre 12% e 14,5%'
                if (humidityPercentage == 13) {
                    humiditySentence = 'A umidade esta <b>perfeita!</b> exatamente 13%'
                }
            } else {
                humidityQuality = false;
                humiditySentence = 'Umidade <b>não está boa!</b> Deve estar entre 12% e 14,5%'
            }

            if (humidityQuality == true && celciusQuality == true) {
                grainQuality = 'Ótima'
            } else if (humidityQuality == true || celciusQuality == true) {
                grainQuality = 'Média'
            } else {
                grainQuality = 'Baixa'
            }

            grainQualitySentence = `
                ${celciusSentence}<br>
                ${humiditySentence}
            `
        }

        // == perda em dinheiro

        var lossProductivityKgHa = potentialProductivityKgHa * ((100 - 63) / 100); // considerando a perda de 47%
        var lossProductivityMoney = ((lossProductivityKgHa / 60) * priceBag).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // 

        //=================================================


        // tornando o modal visível
        var modalLoader = document.querySelector('.modal-loader');
        modalLoader.style.display = 'block';

        // capturando os containers onde será apresentado o resultado
        var responseContainer = document.querySelector('.response-container')
        var dataAnalysisResponse = document.querySelector('.data-analysis');

        // aumentando a altura dos containers
        responseContainer.style.height = '1990px';
        dataAnalysisResponse.style.padding = '25px';
        dataAnalysisResponse.style.height = '1390px';


        // simulando o carregamento (loader)
        setTimeout(function () {
            modalLoader.style.display = 'none';
        }, 1500); // 1 segundo para tornar o modal invisível denovo


        var data = 'null'
        // apresentando o resultado na tela
        dataAnalysisResponse.innerHTML = `
            <!-- adding later via js -->
            <h1 class="analysis-title">Análise <i class="fa-solid fa-magnifying-glass-chart"></i></h1>
            <div class="row data-row">
                <div class="col data-col">
                    <img width="48" height="48" src="https://img.icons8.com/fluency/48/bar-chart.png" alt="bar-chart"/>
                    <h2 class="data-info-title">Produtividade</h2>
                    <p class="data-info-text">Total de <b>${realProductivityKgHa.toFixed(1)}kg/ha</b></p>
                    <p class="data-info-text"> cerca de <b>${(realProductivityBagHa).toFixed(1)}sa/ha</b></p>
                    <p class="data-info-text">O que se traduz para <span class="green-text">${(realProductivityBagHa * priceBag).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
                </div>
                <div class="col data-col">
                    <img width="48" height="48" src="https://img.icons8.com/fluency/48/bearish.png" alt="bearish"/>   
                    <h2 class="data-info-title">Perdas</h2>
                    <p class="data-info-text">Deixando de colher cerca de <span class="red-text">${lossProductivity.toFixed(1)}kg/ha</span></p>
                    <p class="data-info-text">O que significa que é necessário realizar alguns <b>ajustes na sua produção</b></p>
                </div>
                <div class="col data-col">
                    <img width="48" height="48" src="https://img.icons8.com/fluency/48/line-chart.png" alt="line-chart"/>                    
                    <h2 class="data-info-title">Produtor</h2>
                    <p class="data-info-text">Você é um produtor <b>${producerStatus} (${realProductivityBagHa.toFixed(1)}sa/ha)</b></p>
                    <p class="data-info-text">em relação aos produtores do mercado média (65sa)</p>
                </div>
            </div>

            <div class="row data-row">
                <div class="col data-col">
                    <img width="48" height="48" src="https://img.icons8.com/fluency/48/stocks-growth--v1.png" alt="stocks-growth--v1"/>                    
                    <h2 class="data-info-title">Potencial</h2>
                    <p class="data-info-text">Potencial de escala em até <span class="green-text">${potentialProductivityKgHa.toFixed(1)}kg/ha</span></p>
                    <p class="data-info-text">Podendo aumentar seus ganhos em até <b>47%</b></p>
                </div>
                <div class="col data-col">
                    <img width="48" height="48" src="https://img.icons8.com/color/48/soy.png" alt="corn"/>
                    <h2 class="data-info-title">Qualidade</h2>
                    <p class="data-info-text">Seu grão tem uma <b>${grainQuality} qualidade</b></p>
                    <p class="data-info-text">${grainQualitySentence}</p>
                </div>
                <div class="col data-col">
                    <img width="48" height="48" src="https://img.icons8.com/fluency/48/delete-dollar.png" alt="delete-dollar"/>
                    <h2 class="data-info-title">Lucratividade</h2>
                    <p class="data-info-text">Você está deixando de ganhar cerca de <span class="red-text">${lossProductivityMoney}</span>, de toda sua plantação</p>
                </div>
            </div>
            <div class="row data-row-last">
                <div class="col data-col-last">
                    <img width="48" height="48" src="https://img.icons8.com/fluency/48/growing-money.png" alt="growing-money"/>
                    <h2 class="data-info-title">Soytech te salva</h2>
                    <p class="data-info-text">Com a nossa solução, a gente não te deixa na mão!<br>
                    conheça a nossa tecnologia e tenha lucro em qualquer canto do Brasil e do Mundo</p>
                    <p class="data-info-text">Veja em como nossa solução pode potencializar sua lucratividade!</p>
                    <table>
                        <tr>
                            <th>Entrega</th>
                            <th>Valor</th>
                            <th><img width="25" height="25" src="https://img.icons8.com/fluency/48/ok--v1.png" alt="ok--v1"/></th>
                        </tr>
                        <tr>
                            <td><b>Monitoramento remoto da plantação</b></td>
                            <td>Acesso em tempo real as condições de umidade e temperatura da plantação de soja, permitindo uma gestão eficiente mesmo à distância.</td>
                            <td><span class="green-text">Facilidade</span></td>
                        </tr>
                        <tr>
                            <td><b>Prevenção de doenças e pragas</b></td>
                            <td>Ao monitorar as condições ambientais, você pode identificar precocemente sinais de doenças e infestações de pragas, permitindo ação rápida.</td>
                            <td><span class="green-text">Saúde</span></td>
                        </tr>
                        <tr>
                            <td><b>Redução do desperdício de recursos</b></td>
                            <td>A capacidade de monitorar de forma precisa as condições da plantação ajuda a evitar o uso excessivo de água e outros recursos, reduzindo custos e impactos ambientais.</td>
                            <td><span class="green-text">Sustentável</span></td>
                        </tr>
                        <tr>
                            <td><b>Aumento da produtividade</b></td>
                            <td>Uma gestão mais eficaz da plantação, baseada em dados em tempo real, pode levar a um aumento significativo na produtividade da cultura de soja.</td>
                            <td><span class="green-text">Faturamento</span></td>
                        </tr>
                        <tr>
                            <td><b>Tomada de decisão concisa</b></td>
                            <td>Os agricultores podem tomar decisões baseadas em dados concretos e precisos, em vez de depender apenas de observações subjetivas.</td>
                            <td><span class="green-text">Estratégia</span></td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="row last-thing">
                <div class="col">
                    <h4 class="response-subtitle" style="margin-top: 30px;">SoyTech</h4>
                    <h1 class="response-title">Nós temos a solução</h1>
                    <p class="response-subtext">Venha conhecer a nossa empresa, somos a SoyTech Solutions e temos a solução para o seu negócio, clique em saiba mais, confira e entre em contato com a gente, estamos te esperando ;)</p>
                    <button class="btn-know">Saiba Mais</button>
                </div>
            </div>
        `

    } else {
        alert('Há campos vazios. Preencha todos para calcular!');
    }
})