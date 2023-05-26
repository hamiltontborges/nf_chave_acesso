const inputChave = document.getElementById('input-chave');
const btnSubmit = document.getElementById('btn-submit');
const spanInput = document.getElementById('span-error');
const divOutput = document.getElementById('output-div');
const clearForm = document.getElementById('delete-icon');

inputChave.addEventListener('input', () => {
  inputChave.value = inputChave.value.replace(/[^0-9]/g,'');
});

btnSubmit.addEventListener('click', event => {
  event.preventDefault();
  if(!verifyForm()) {
  divOutput.innerHTML = ''
  divOutput.classList.remove('hidden');
  divOutput.insertAdjacentHTML('afterBegin', generateNFeTable())
  } else {
    divOutput.classList.add('hidden');
    divOutput
  }
});

clearForm.addEventListener('click', event => {
  event.preventDefault();
  divOutput.classList.add('hidden');
  inputChave.value = '';
})


function verifyForm() {
  let temErro = true;
  let key = inputChave.value;
  let digit_verify = verifyKeyNfe(key.substring(0,43));
  let digit_input = key.slice(-1);
  let text = '';
  inputChave.classList.remove('input-erro');

  if (key.length !== 44) {
    text = 'Devem ser inseridos 44 números';
    inputChave.classList.add('input-erro');
  } else if(digit_input != digit_verify){
    text = 'Chave de Acesso Inválida'
    inputChave.classList.add('input-erro');
  } else {
    temErro = false;
  }
  
  spanInput.innerText = text;
  return temErro;
}

function extractNFeComponents(chaveDeAcesso) {
  const nfe = {};
  nfe.cUF = chaveDeAcesso.substring(0, 2);
  nfe.AAMM = chaveDeAcesso.substring(2, 6);
  nfe.CNPJ = chaveDeAcesso.substring(6, 20);
  nfe.mod = chaveDeAcesso.substring(20, 22);
  nfe.serie = chaveDeAcesso.substring(22, 25);
  nfe.nNF = chaveDeAcesso.substring(25, 34);
  nfe.tpEmis = chaveDeAcesso.substring(34, 35);
  nfe.cDV = chaveDeAcesso.substring(35, 36);
  return nfe;
}

function generateNFeTable() {
  const nfe = extractNFeComponents(inputChave.value);
  const table = document.createElement("table");
  table.classList.add('table');
  const tbody = document.createElement("tbody");

  for (const [key, value] of Object.entries(nfe)) {
    const row = document.createElement("tr");
 
    const componentCell = document.createElement("td");
    
    componentCell.textContent = key;
    row.appendChild(componentCell);

    const valueCell = document.createElement("td");
    valueCell.textContent = value;
    
    row.appendChild(valueCell);

    const descriptionCell = document.createElement("td");

    switch (key) {
      case "cUF":
        descriptionCell.innerHTML = `<p>Código da UF do emissor</p>
        <p class="hint">${UF[nfe.cUF]["sigla"]} (${UF[nfe.cUF]["nome"]})</p>
        `;
        break;
      case "AAMM":
        descriptionCell.innerHTML = `<p>Ano e mês da emissão</p>
        <p class="hint">20${nfe.AAMM.substring(0,2)}/${nfe.AAMM.substring(2,4)}</p>`;
        break;
      case "CNPJ":
        descriptionCell.innerHTML = `<p>CNPJ do emissor</p>
        <p class="hint">${nfe.CNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}</p>`;
        break;
      case "mod":
        descriptionCell.innerHTML = `<p>Modelo</p>
        <p class="hint">${modelo[nfe.mod]}</p>`;
        break;
      case "serie":
        descriptionCell.innerHTML = "Série";
        break;
      case "nNF":
        descriptionCell.innerHTML = "Número";
        break;
      case "tpEmis":
        descriptionCell.innerHTML = `<p>Tipo</p>
        <p class="hint">${tipo[nfe.tpEmis]}</p>`
        break;
      case "cDV":
        descriptionCell.innerHTML = "Digito verificador";
        break;
      default:
        descriptionCell.innerHTML = "";
    }
    row.appendChild(descriptionCell);

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  return table.outerHTML;
}

function verifyKeyNfe(key) {
  const pond = [...key].reverse().map((char, index) => {
    const weight = (index % 8) + 2;
    return weight * char;
  }).reduce((acc, cur) => acc + cur, 0);

  const restDiv = pond % 11;
  const digit = restDiv > 1 ? 11 - restDiv : 0;

  return digit;
}

const UF = {
  "12": {"nome": "Acre", "sigla": "AC"},
  "27": {"nome": "Alagoas", "sigla": "AL"},
  "16": {"nome": "Amapá", "sigla": "AP"},
  "13": {"nome": "Amazonas", "sigla": "AM"},
  "29": {"nome": "Bahia", "sigla": "BA"},
  "23": {"nome": "Ceará", "sigla": "CE"},
  "53": {"nome": "Distrito Federal", "sigla": "DF"},
  "32": {"nome": "Espírito Santo", "sigla": "ES"},
  "52": {"nome": "Goiás", "sigla": "GO"},
  "21": {"nome": "Maranhão", "sigla": "MA"},
  "51": {"nome": "Mato Grosso", "sigla": "MT"},
  "50": {"nome": "Mato Grosso do Sul", "sigla": "MS"},
  "31": {"nome": "Minas Gerais", "sigla": "MG"},
  "15": {"nome": "Pará", "sigla": "PA"},
  "25": {"nome": "Paraíba", "sigla": "PB"},
  "41": {"nome": "Paraná", "sigla": "PR"},
  "26": {"nome": "Pernambuco", "sigla": "PE"},
  "22": {"nome": "Piauí", "sigla": "PI"},
  "33": {"nome": "Rio de Janeiro", "sigla": "RJ"},
  "24": {"nome": "Rio Grande do Norte", "sigla": "RN"},
  "43": {"nome": "Rio Grande do Sul", "sigla": "RS"},
  "11": {"nome": "Rondônia", "sigla": "RO"},
  "14": {"nome": "Roraima", "sigla": "RR"},
  "42": {"nome": "Santa Catarina", "sigla": "SC"},
  "35": {"nome": "São Paulo", "sigla": "SP"},
  "28": {"nome": "Sergipe", "sigla": "SE"},
  "17": {"nome": "Tocantins", "sigla": "TO"}
}

const modelo = {
  "55": "NF-e",
  "65": "NFC-e"
}

const tipo = {
  "1": "Normal",
  "2": "Complementar",
  "3": "Ajuste",
  "4": "Devolução"  
}
