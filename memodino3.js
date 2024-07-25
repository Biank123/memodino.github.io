document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('backgroundMusic');
    const musicButton = document.getElementById('pararmusica');
    const playButton = document.getElementById('playButton');
    const cancelButton = document.getElementById('cancelButton');
    const easyBtn = document.getElementById("easyBtn");
    const mediumBtn = document.getElementById("mediumBtn");
    const hardBtn = document.getElementById("hardBtn");
    const tablero = document.getElementById('tablero');
    const tiempoInicial = 60;
    let tiempoRestante = tiempoInicial;
    let intervalo;
    let lockBoard = true;
    let firstCard = null;
    let matchedCards = [];
    let dinosaurImages = [];
    let dificultadActual;

    const dinosaurios = [
        'polacantus.jpg',
        'braquisaurio.jpg',
        'cafalosaurio.jpg',
        'diplodocus.jpg',
        'parasaurolopinus.jpg',
        'ankylosaurus.jpg',
        'estegosaurio.jpg',
        'plesiosaurio.jpg',
        'pterodactilo.jpg',
        'triceratops.jpg',
        'dilophosaurus.jpg',
        'tiranosaurio.jpg',
        'rarosaurus.jpg',
        'algoratops.jpg',
        'velociraptor.jpg'
    ];

    function reproducirMusica() {
        audio.play();
        musicButton.textContent = 'Parar Sonido';
    }

    function detenerMusica() {
        audio.pause();
        musicButton.textContent = 'Reproducir Sonido';
    }

    musicButton.addEventListener('click', function () {
        if (audio.paused) {
            reproducirMusica();
        } else {
            detenerMusica();
        }
    });

    if (audio.paused) {
        musicButton.textContent = 'Reproducir Sonido';
    } else {
        musicButton.textContent = 'Parar Sonido';
    }

    // Reproducir música automáticamente al cargar la página
    reproducirMusica();
    // ------------------------------------------------------------------------------------------
    function actualizarContador() {
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;
        const formatoSegundos = segundos < 10 ? `0${segundos}` : segundos;
        document.getElementById('tiempo').textContent = `Tiempo: 0${minutos}:${formatoSegundos}`;
    }

    function iniciarContador() {
        actualizarContador();
        intervalo = setInterval(function () {
            tiempoRestante--;
            if (tiempoRestante < 0) {
                clearInterval(intervalo);
                tiempoRestante = 0;
                document.getElementById('tiempo').textContent = '¡Tiempo agotado!';
                mostrarResultado('fin-malo');
            } else {
                actualizarContador();
            }
        }, 1000);
    }
    // ----------------------------------------------------------------------------------------------------------------
    function mostrarResultado(estado) {
        const resultadoTexto = document.getElementById("texto");
        switch (estado) {
            case 'inicio':
                resultadoTexto.textContent = 'RESULTADOS: ¡COMIENZA EL JUEGO!';
                hideResult();
                break;
            case 'fin-bueno':
                lockBoard = true;
                clearInterval(intervalo);
                resultadoTexto.textContent = 'RESULTADOS: ¡TE SALVASTE!';
                showResult('¡TE SALVASTE!');
                animacionGanar();
                break;
            case 'fin-malo':
                lockBoard = true;
                resultadoTexto.textContent = 'RESULTADOS: ¡EXTINTO!';
                showResult('¡EXTINTO!');
                animacionGanar();
                break;
            case 'jugando':
                resultadoTexto.textContent = 'RESULTADOS: ...';
                hideResult();
                break;
        }
    }
    // --------------------------------------------------------------------------------------------------------------------
    function mezclar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard(pares) {
        dinosaurImages = [];
        for (let i = 0; i < pares; i++) {
            const imageName = dinosaurios[i % dinosaurios.length];
            dinosaurImages.push(imageName, imageName);
        }
        mezclar(dinosaurImages);

        tablero.innerHTML = '';
        dinosaurImages.forEach(image => {
            const casilla = document.createElement('div');
            casilla.classList.add('casilla');
            const img = document.createElement('img');
            img.setAttribute('src', 'casillagiradadino.jpg');
            img.setAttribute('alt', 'Imagen de dinosaurio');
            casilla.appendChild(img);
            tablero.appendChild(casilla);
            casilla.setAttribute('data-original', image);
            casilla.addEventListener('click', handleCardClick);
        });
    }

    function handleCardClick() {
        if (lockBoard) return;
        const casilla = this;
        const img = casilla.querySelector('img');
    
        // Si la imagen ya está visible o la casilla es la misma que la primera, no hacer nada
        if (img.src.includes(casilla.getAttribute('data-original')) || casilla === firstCard) return;
    
        // Mostrar la imagen en la casilla clickeada
        img.src = casilla.getAttribute('data-original');
        
        // Si no hay una primera casilla, establecer la primera casilla clickeada
        if (!firstCard) {
            firstCard = casilla;
            return;
        }
    
        // Si las imágenes coinciden...
        if (firstCard.getAttribute('data-original') === casilla.getAttribute('data-original')) {
            matchedCards.push(firstCard, casilla);
            firstCard = null;
            if (matchedCards.length === dinosaurImages.length) {
                mostrarResultado('fin-bueno');
                
            }
        } else {
            lockBoard = true;
            // Aplicar la animación de ocultamiento
            firstCard.classList.add('hide');
            casilla.classList.add('hide');
            
            setTimeout(() => {
                firstCard.querySelector('img').src = 'casillagiradadino.jpg';
                casilla.querySelector('img').src = 'casillagiradadino.jpg';
                firstCard.classList.remove('hide');
                casilla.classList.remove('hide');
                firstCard = null;
                lockBoard = false; 
            }, 500);
        }
    }
    
    function startGame() {
        gameStarted = true;
        lockBoard = false;
        firstCard = null;
        if (intervalo) clearInterval(intervalo);
        tiempoRestante = tiempoInicial;
        iniciarContador();
        matchedCards = [];
        mostrarResultado('jugando');
        tablero.style.pointerEvents = 'auto'; // Desbloquear tablero
        createBoard(dificultadActual); // Reiniciar el tablero al iniciar el juego
        hideResult();
    }

    playButton.addEventListener('click', startGame);

    cancelButton.addEventListener('click', function () {
        if (intervalo) clearInterval(intervalo);
        tiempoRestante = tiempoInicial;
        actualizarContador();
        gameStarted = false;
        lockBoard = true;
        tablero.style.pointerEvents = 'none'; // Bloquear tablero
        mostrarResultado('inicio');
        createBoard(dificultadActual); // Volver a cargar el tablero con la dificultad actual
        hideResult();
    });

    function cambiarDificultad(pares) {
        if (intervalo) clearInterval(intervalo);
        gameStarted = false;
        tiempoRestante = tiempoInicial;
        actualizarContador();
        dificultadActual = pares;
        createBoard(dificultadActual);
        lockBoard = true;
        tablero.style.pointerEvents = 'none'; // Bloquear tablero
        mostrarResultado('inicio');
        hideResult();
    }

    easyBtn.addEventListener('click', function () {
        cambiarDificultad(9);
        tablero.style.gridTemplateRows = 'repeat(3, 1fr)';
    });

    mediumBtn.addEventListener('click', function () {
        cambiarDificultad(12);
        tablero.style.gridTemplateRows = 'repeat(4, 1fr)';
    });

    hardBtn.addEventListener('click', function () {
        cambiarDificultad(15);
        tablero.style.gridTemplateRows = 'repeat(5, 1fr)';
    });

    function showResult(resultText) {
        const resultado = document.getElementById('resultado');
        resultado.textContent = resultText;
        resultado.classList.remove('hidden');
        resultado.classList.add('animate');

        setTimeout(() => {
            resultado.classList.remove('animate');
            setTimeout(() => {
                hideResult();
            }, 1000);
        }, 1500);
    }

    function hideResult() {
        const resultado = document.getElementById('resultado');
        resultado.classList.add('hidden');
        resultado.classList.remove('animate');
    }

    function animacionGanar() {
        const casillas = document.querySelectorAll('.casilla');
        casillas.forEach(casilla => {
            casilla.classList.add('animacioWin');
        });
    }

    const dificultadInicial = 9;
    dificultadActual = dificultadInicial;
    createBoard(dificultadActual);
    mostrarResultado('inicio');

});
