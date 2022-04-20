
const inputNumero = document.getElementById('input-number');
const btnGenerate = document.getElementById('btn-generateKey');
const outputDigit = document.getElementById('output-digit');
const outputNumber = document.getElementById('output-number');
const spanInput = document.getElementById('span-error');
const divOutput = document.getElementById('output-div');
const clearForm = document.getElementById('delete-icon');

btnGenerate.addEventListener('click', event => {
  event.preventDefault();
  if(!verifyForm()) {
  divOutput.classList.remove('hidden');
  const result = generateAccessKeyNfe(inputNumero.value);
  outputDigit.innerText = result;
  outputNumber.innerText = inputNumero.value + result;
  } else {
    divOutput.classList.add('hidden');
  }
});

clearForm.addEventListener('click', event => {
  event.preventDefault();
  divOutput.classList.add('hidden');
  inputNumero.value = '';
})

const verifyForm = () => {
  let temErro = false;
  if (inputNumero.value.length !== 43) {
    temErro = true;
    spanInput.innerText = 'Devem ser inseridos 43 números';
    inputNumero.classList.add('input-erro');
  } else {
    temErro = false;
    spanInput.innerText = '';
    inputNumero.classList.remove('input-erro');
  }
  return temErro;
}

const generateAccessKeyNfe = key => {

  const pond = [...key].reverse().map((char, index) => {
    const weight = (index % 8) + 2;
    return weight * char;
  }).reduce((acc, cur) => acc + cur, 0);

  const restDiv = pond % 11;
  const digit = restDiv > 1 ? 11 - restDiv : 0;

  return digit;
}



