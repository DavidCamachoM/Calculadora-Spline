import { Application } from '@splinetool/runtime';

const canvas = document.getElementById('canvas3d');
const spline = new Application(canvas);

// --- MEMORIA DE LA CALCULADORA ---
let valorActual = ""; 
let valorAnterior = ""; 
let operacionActiva = null; 
let terminoOperacion = false; 
let memoriaSecreta = 0; 

// IMPORTANTE: Tu link de Spline
const urlSpline = 'https://prod.spline.design/HQiNXvCODvPknmYe/scene.splinecode';

spline.load(urlSpline).then(() => {
    console.log("✅ Escena cargada. Modo Científico Activado.");
});

spline.addEventListener('mouseDown', (e) => {
    const nombreBoton = e.target.name;

    // 1. SI ES UN NÚMERO
    const numeros = ['B_0', 'B_1', 'B_2', 'B_3', 'B_4', 'B_5', 'B_6', 'B_7', 'B_8', 'B_9'];
    if (numeros.includes(nombreBoton)) {
        if (terminoOperacion === true) {
            valorActual = "";
            terminoOperacion = false;
        }
        valorActual += nombreBoton.replace('B_', '');
        spline.setVariable('texto_calculadora', valorActual);
    }

    // 2. PUNTO DECIMAL (.)
    if (nombreBoton === 'B_punto') {
        if (terminoOperacion) {
            valorActual = "0.";
            terminoOperacion = false;
        } else if (!valorActual.includes('.')) {
            valorActual += valorActual === "" ? "0." : ".";
        }
        spline.setVariable('texto_calculadora', valorActual);
    }

    // 3. CAMBIO DE SIGNO (+/-)
    if (nombreBoton === 'B_signo') {
        if (valorActual !== "") {
            valorActual = (parseFloat(valorActual) * -1).toString();
            spline.setVariable('texto_calculadora', valorActual);
        }
    }

    // 4. OPERADORES BÁSICOS Y EXPONENTE
    if (['B_mas', 'B_menos', 'B_por', 'B_div', 'B_exp'].includes(nombreBoton)) {
        if (valorActual === "") return; 
        terminoOperacion = false; 
        valorAnterior = valorActual; 
        valorActual = ""; 
        operacionActiva = nombreBoton; 
    }

    // 5. BOTÓN IGUAL (=)
    if (nombreBoton === 'B_igual') {
        if (valorAnterior === "" || valorActual === "" || operacionActiva === null) return;

        let num1 = parseFloat(valorAnterior);
        let num2 = parseFloat(valorActual);
        let resultado = 0;

        if (operacionActiva === 'B_mas') resultado = num1 + num2;
        if (operacionActiva === 'B_menos') resultado = num1 - num2;
        if (operacionActiva === 'B_por') resultado = num1 * num2;
        if (operacionActiva === 'B_div') {
            resultado = num2 === 0 ? "Error" : num1 / num2;
        }
        if (operacionActiva === 'B_exp') {
            resultado = Math.pow(num1, num2); 
        }

        valorActual = resultado.toString();
        spline.setVariable('texto_calculadora', valorActual);
        
        valorAnterior = "";
        operacionActiva = null;
        terminoOperacion = true; 
    }

    // 6. MEMORIA (M+, M-, MR)
    if (nombreBoton === 'B_Mmas') {
        if (valorActual !== "") memoriaSecreta += parseFloat(valorActual);
        terminoOperacion = true; 
    }
    if (nombreBoton === 'B_Mmenos') {
        if (valorActual !== "") memoriaSecreta -= parseFloat(valorActual);
        terminoOperacion = true;
    }
    if (nombreBoton === 'B_MR') { 
        valorActual = memoriaSecreta.toString();
        spline.setVariable('texto_calculadora', valorActual);
        terminoOperacion = true;
    }

    // 7. CLEAR (C) 
    if (nombreBoton === 'B_C') {
        valorActual = "";
        spline.setVariable('texto_calculadora', "0");
    }

    // 8. BORRAR ÚLTIMO NÚMERO (Lo que antes era AC)
    if (nombreBoton === 'B_AC') {
        if (terminoOperacion) {
            // Si acabas de darle al "igual", borrar el último número reinicia la pantalla
            valorActual = "";
            terminoOperacion = false;
            spline.setVariable('texto_calculadora', "0");
        } else if (valorActual !== "") {
            // Borramos el último dígito
            valorActual = valorActual.slice(0, -1);
            
            // Si al borrar se queda vacío (o solo queda un signo "-"), mostramos 0
            if (valorActual === "" || valorActual === "-") {
                valorActual = "";
                spline.setVariable('texto_calculadora', "0");
            } else {
                spline.setVariable('texto_calculadora', valorActual);
            }
        }
    }
});