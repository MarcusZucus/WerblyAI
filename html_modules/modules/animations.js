/**
 * Aplica un efecto de desvanecimiento a un elemento.
 * @param {HTMLElement} element - El elemento al que se aplicará el efecto.
 * @param {number} duration - Duración de la animación en milisegundos.
 * @param {Function} [callback] - Función opcional a ejecutar tras completar la animación.
 */
export function fadeIn(element, duration = 500, callback = null) {
  if (!element) return;

  element.style.opacity = 0;
  element.style.transform = 'scale(0.9)'; // Escala inicial para añadir un efecto de ampliación
  element.style.transition = `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`;

  requestAnimationFrame(() => {
    element.style.opacity = 1;
    element.style.transform = 'scale(1)'; // Escala final
    setTimeout(() => {
      if (typeof callback === 'function') callback();
    }, duration);
  });
}

/**
 * Aplica un efecto de escritura letra por letra a un mensaje con soporte para animación.
 * @param {HTMLElement} messageContent - Contenedor del mensaje.
 * @param {string} content - El texto que se va a escribir.
 * @param {number} speed - Velocidad de escritura en milisegundos por carácter.
 * @param {Function} [callback] - Función opcional a ejecutar tras completar la escritura.
 */
export function typeMessageEffect(messageContent, content, speed = 24, callback = null) {
  if (!messageContent || typeof content !== 'string') return;

  let index = 0;
  const typingInterval = setInterval(() => {
    if (index < content.length) {
      const span = document.createElement('span');
      span.textContent = content[index];
      span.style.opacity = 0;
      span.style.animation = 'fade-in 0.3s ease forwards';
      if (content[index] === ',' || content[index] === '.') {
        // Pausa adicional en signos de puntuación
        clearInterval(typingInterval);
        setTimeout(() => {
          index++;
          typeMessageEffect(messageContent, content.substring(index), speed, callback);
        }, speed * 10);
        return;
      }
      messageContent.appendChild(span);
      index++;
    } else {
      clearInterval(typingInterval);
      if (typeof callback === 'function') callback();
    }
  }, speed);
}

/**
 * Aplica un efecto de apertura/cierre animado para un menú lateral con accesibilidad.
 * @param {HTMLElement} menuButton - Botón que activa el menú.
 * @param {HTMLElement} sidebar - Menú lateral a mostrar/ocultar.
 */
export function toggleMenuAnimation(menuButton, sidebar) {
  if (!menuButton || !sidebar) return;

  const isOpen = sidebar.classList.toggle('open');
  menuButton.classList.toggle('open');

  // Actualiza atributos ARIA para accesibilidad
  menuButton.setAttribute('aria-expanded', isOpen);
  sidebar.setAttribute('aria-hidden', !isOpen);

  // Agregar transición suave con transformaciones CSS para un mejor rendimiento
  if (isOpen) {
    sidebar.style.transform = 'translateX(0)';
    sidebar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
  } else {
    sidebar.style.transform = 'translateX(-100%)';
    sidebar.style.boxShadow = 'none';
  }
}

/**
 * Agrega eventos globales para cerrar el menú si se hace clic fuera de él.
 * @param {HTMLElement} menuButton - Botón que activa el menú.
 * @param {HTMLElement} sidebar - Menú lateral a gestionar.
 */
export function setupOutsideClickHandler(menuButton, sidebar) {
  if (!menuButton || !sidebar) return;

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!sidebar.contains(target) && target !== menuButton && sidebar.classList.contains('open')) {
      toggleMenuAnimation(menuButton, sidebar);
    }
  });
}

// CSS sugerido para complementar estas mejoras
const styles = `
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sidebar {
  transition: transform 300ms ease-in-out, box-shadow 300ms ease-in-out;
}

.sidebar.open {
  transform: translateX(0);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
`;

// Agrega el CSS al documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
