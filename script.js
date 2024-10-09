function calculatePreTestProbability() {
    let score = 0;

    if (document.getElementById('fever').checked) score++;
    if (document.getElementById('cough').checked) score--;
    if (document.getElementById('swollenNodes').checked) score++;
    if (document.getElementById('tonsillarExudates').checked) score++;
    if (document.getElementById('age1').checked) score++;
    if (document.getElementById('age3').checked) score--;

    let preTestProbability;
    let preTestProbabilityHigh;

    switch(score) {
        case -1: preTestProbability = 1;  preTestProbabilityHigh = 2.5;  break;
        case 0: preTestProbability = 1;  preTestProbabilityHigh = 2.5;  break;
        case 1: preTestProbability = 5;  preTestProbabilityHigh = 10;  break;
        case 2: preTestProbability = 11;  preTestProbabilityHigh = 17;  break;
        case 3: preTestProbability = 28;  preTestProbabilityHigh = 35;  break;
        case 4: preTestProbability = 51;  preTestProbabilityHigh = 53;  break;
        case 5: preTestProbability = 51;  preTestProbabilityHigh = 53;  break;
    }

    document.getElementById('pretest-result').innerHTML = `Probabilidade pré-teste de etiologia estreptocócica: entre ${preTestProbability}% e ${preTestProbabilityHigh}%`;
    return [preTestProbability, preTestProbabilityHigh];
}

function calculatePTP(preTestP, sensibility, specificity, result) {
    let preTestOdds = preTestP / (1 - preTestP);
    let likelihoodRatio;
    if (result === true)
    {
        likelihoodRatio = sensibility / (1-specificity);
    }
    else 
    {
        likelihoodRatio = (1 - sensibility) / specificity;  
    }
    let postTestOdds = preTestOdds * likelihoodRatio;
    let postTestP = postTestOdds / (1 + postTestOdds);
    return postTestP;
}

function calculatePostTestProbability() {
    let preTestProbabilityArray = calculatePreTestProbability();
    let preTestProbabilityLow = preTestProbabilityArray[0] / 100;
    let preTestProbabilityHigh = preTestProbabilityArray[1] / 100;
    let sensitivity = parseFloat(document.getElementById('sensitivity').value) / 100;
    let specificity = parseFloat(document.getElementById('specificity').value) / 100;
    let testResult = document.getElementById('testResult').value;
    let testBoolean = false;
    if (testResult === 'positive'){
        testBoolean = true;
    }

    let postTestProbabilityLow = calculatePTP(preTestProbabilityLow, sensitivity, specificity, testBoolean) * 100;
    let postTestProbabilityHigh = calculatePTP(preTestProbabilityHigh, sensitivity, specificity, testBoolean) * 100;

    
    if (postTestProbabilityHigh.toFixed(0) === postTestProbabilityLow.toFixed(0))
    {
        document.getElementById('posttest-result').innerHTML = `Probabilidade pós-teste de etiologia estreptocócica: ${postTestProbabilityLow.toFixed(0)}% `;
    }
    else
    {
        document.getElementById('posttest-result').innerHTML = `Probabilidade pós-teste de etiologia estreptocócica: entre ${postTestProbabilityLow.toFixed(0)}% e ${postTestProbabilityHigh.toFixed(0)}% `;
    }
}
