const container  = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
  formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e){
  e.preventDefault();

  // Validar los campos obligatorios
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;

  // console.log(ciudad);
  // console.log(pais);

  if(ciudad === '' || pais === ''){
    // Hubo un error
    mostrarError('Ambos campos son obligatorios');

    return;
  }

  // Consultar la API
  consultarAPI(ciudad, pais);
}

function mostrarError(mensaje){
  const alerta = document.querySelector('.bg-red-100');

  if(!alerta){
    // Crear una alerta
    const alerta = document.createElement('div');
    alerta.classList.add('border', 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

    alerta.innerHTML = `
      <strong class="font-bold">Error!</strong>
      <span class="block">${mensaje}</span>
    `;

    container.appendChild(alerta);

    // Eliminar la alerta después de 5s
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
}

function consultarAPI(ciudad, pais){

  const appId = 'd711aecc14e9b64e92c7628ec0990aef';

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

  // Llamar al Spinner de carga
  spinner();

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => {
      console.log(datos);
      limpiarHTML(); // Limpiar el HTML para imprimir la respuesta
      if(datos.cod === "404"){
        mostrarError('Ciudad no Encontrada');
        return;
      }

      // Imprimir la respuesta en el HTML
      mostrarClima(datos);
    });
}

function mostrarClima(datos){
  // Destructuring
  const {name, main: {temp, temp_max, temp_min}} = datos;

  const centigrados = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);

  const nombreCiudad = document.createElement('p');
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.classList.add('font-bold', 'text-2xl');
  
  const actual = document.createElement('p');
  actual.innerHTML = `${centigrados} &#8451;`;
  actual.classList.add('font-bold', 'text-6xl');

  const tempMaxima = document.createElement('p');
  tempMaxima.innerHTML = `Max: ${max} &#8451;`;
  tempMaxima.classList.add('text-xl');

  const tempMinima = document.createElement('p');
  tempMinima.innerHTML = `Min: ${min} &#8451;`;
  tempMinima.classList.add('text-xl');

  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white');
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);

  resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

// Limpiar el HTML para una nueva consulta
function limpiarHTML(){
  while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild);
  }
}

// Agregar el spinner de carga
function spinner(){
  limpiarHTML();

  const divSpinner = document.createElement('div');
  divSpinner.classList.add('spinner');

  resultado.appendChild(divSpinner);
}