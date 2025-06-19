/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

/*!
* Start Google chart
* Live Graphs
* Made by Google and Fernando Villanueva Orozco
*/
//
// Scripts
// 
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(loadData);

        function loadData() {
            const SHEET_ID = '1aO0Vug4P-mNNDxmBWRn08nFQ6AvmoT7MStu1_ZnQqto';
            const API_KEY = 'AIzaSyBqNHtW1UtFe2HhvHrJC1HUqdHXpQTPmpI';
            const URLS = {
                Origen: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/B1:B100?key=${API_KEY}`,
                Botellas: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/C1:C100?key=${API_KEY}`,
                Gasto: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/D1:D100?key=${API_KEY}`,
                Bebederos: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/E1:E100?key=${API_KEY}`
            };

            const opciones = {
                Origen: { 'Compro en la escuela': 0, 'La traigo de mi casa': 0 },
                Botellas: { 'De 1 a 3': 0, 'De 3 a 4': 0, 'De 4 a 5': 0, 'Ninguna': 0, 'Prefiero no responder': 0, 'Compro por garrafón y lleno en la botella': 0, 'Relleno garrafón': 0, 'Compro garrafones en casa': 0 },
                Gasto: { 'Menos de 50 pesos': 0, 'Menos de 100 pesos': 0, 'Más de 100 pesos': 0, 'Nada': 0, 'Prefiero no responder': 0 },
                Bebederos: { 'Sí': 0, 'No': 0, 'Prefiero no responder': 0 }
            };

            Object.entries(URLS).forEach(([pregunta, url], index) => {
                fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (!data.values || data.values.length < 2) {
                        console.error(`Error: No se encontraron suficientes datos para ${pregunta}`);
                        return;
                    }

                    console.log(`Respuestas de ${pregunta}:`, data.values.slice(1));

                    data.values.slice(1).forEach(row => {
                        let respuesta = row[0]?.trim().toLowerCase() || 'Sin respuesta';

                        // Normalización de respuestas
                        const correcciones = {
                            'compro en la escuela': 'Compro en la escuela',
                            'la traigo de mi casa': 'La traigo de mi casa',
                            'menos de 50 pesos': 'Menos de 50 pesos',
                            'menos de 100 pesos': 'Menos de 100 pesos',
                            'más de 100 pesos': 'Más de 100 pesos',
                            'nada': 'Nada',
                            'de 1 a 3': 'De 1 a 3',
                            'de 3 a 4': 'De 3 a 4',
                            'de 4 a 5': 'De 4 a 5',
                            'ninguna': 'Ninguna',
                            'compro garrafones en casa': 'Compro garrafones en casa',
                            'compro por garrafón y lleno en la botella': 'Compro por garrafón y lleno en la botella',
                            'relleno garrafon': 'Relleno garrafón',
                            'si': 'Sí',
                            'no': 'No',
                            'prefiero no responder': 'Prefiero no responder'
                        };

                        respuesta = correcciones[respuesta] || respuesta;

                        if (respuesta === 'Sin respuesta') return; // Ignorar respuestas vacías

                        if (opciones[pregunta][respuesta] !== undefined) {
                            opciones[pregunta][respuesta]++;
                        } else {
                            console.warn(`Respuesta no reconocida en ${pregunta}:`, respuesta);
                        }
                    });

                    let chartData = [['Opción', 'Cantidad']];
                    Object.entries(opciones[pregunta]).forEach(([key, value]) => {
                        chartData.push([key, value]);
                    });

                    drawChart(chartData, `chart_div_${index}`, obtenerTitulo(pregunta));
                })
                .catch(error => console.error(`Error al obtener los datos de ${pregunta}:`, error));
            });
        }

        function drawChart(chartData, chartId, title) {
            let dataTable = google.visualization.arrayToDataTable(chartData);
            let options = {
                title: title,
                pieHole: 0.4,
                legend: { position: 'bottom' }
            };

            let chart = new google.visualization.PieChart(document.getElementById(chartId));
            chart.draw(dataTable, options);
        }

        function obtenerTitulo(pregunta) {
            const titulos = {
                Origen: 'Origen del Agua en la Escuela',
                Botellas: 'Cantidad de Botellas Compradas por Semana',
                Gasto: 'Gasto Semanal en Agua',
                Bebederos: '¿Te gustaría que hubiera bebederos en la escuela?'
            };
            return titulos[pregunta];
        }


const img = document.getElementById('hoverImg');
img.onmouseover = () => img.src = './Imagenes/Circuito_M1/C13.jpg';
img.onmouseout = () => img.src = './Imagenes/Circuito_M1/C12.jpg';
