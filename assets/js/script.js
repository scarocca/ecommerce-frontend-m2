document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica de Login (Corregida y Movida dentro de DOMContentLoaded) ---
    
    // Inicializar el Offcanvas de Login
    const loginOffcanvasEl = document.getElementById('loginOffcanvas');
    let loginOffcanvas;
    if (loginOffcanvasEl) {
         loginOffcanvas = new bootstrap.Offcanvas(loginOffcanvasEl);
    }
    
    // Botón abre offcanvas (ya no es estrictamente necesario si usas data-bs-toggle en el HTML)
    const openLoginBtn = document.getElementById('openLoginBtn');
    if (openLoginBtn && loginOffcanvas) {
        openLoginBtn.addEventListener('click', () => {
          loginOffcanvas.show();
        });
    }

    // Toggle mostrar/ocultar contraseña
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            // Usar iconos de Bootstrap (bi bi-eye-fill/bi bi-eye-slash-fill) en index.html
            togglePasswordBtn.innerHTML = type === 'password' ? '<i class="bi bi-eye-fill"></i>' : '<i class="bi bi-eye-slash-fill"></i>';
        });
    }


    // Validación simple del formulario
    const form = document.getElementById('loginForm');
    const errorBox = document.getElementById('errorBox');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (errorBox) {
                errorBox.style.display = 'none';
                errorBox.textContent = '';
            }

            const emailInput = document.getElementById('email');
            const passwordValue = passwordInput ? passwordInput.value.trim() : '';
            const emailValue = emailInput ? emailInput.value.trim() : '';

            if (!emailValue || !passwordValue) {
                if (errorBox) {
                    errorBox.style.display = 'block';
                    errorBox.textContent = 'Completa todos los campos.';
                }
                return;
            }
            if (!emailValue.includes('@')) {
                if (errorBox) {
                    errorBox.style.display = 'block';
                    errorBox.textContent = 'Ingresa un correo válido.';
                }
                return;
            }

            // Simulación:
            alert('Login exitoso (simulado)');
            if (loginOffcanvas) {
                loginOffcanvas.hide();
            }
            form.reset();
        });
    }

    // ------------------------------------------------------------------------
    // --- Lógica del Carrito de Compras (LA PARTE QUE FALTABA) ---
    // ------------------------------------------------------------------------
    let cart = JSON.parse(localStorage.getItem('cart')) || []; 
    const cartCountElement = document.getElementById('cart-count'); 

    // Función para guardar el carrito en localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Función para actualizar el contador del carrito (globito en el icono)
    function updateCartCount() {
        if (cartCountElement) { 
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
            if (totalItems > 0) {
                cartCountElement.classList.remove('visually-hidden');
            } else {
                cartCountElement.classList.add('visually-hidden'); 
            }
        }
    }

    // Función para formatear el precio (asumimos CLP Peso Chileno)
    function formatPrice(price) {
        return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    }

    // Función principal para agregar un producto al carrito
    function addProductToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartCount(); // ¡ESTA ES LA CLAVE para que se actualice el contador!
        
        // Si el usuario está en la página del carrito, renderizamos de nuevo.
        if (document.getElementById('cart-items')) {
            renderCartPage(); 
        }
    }

    // Event listener para los botones "Agregar al carrito" (Solo para index.html)
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = {
                // Obtenemos los datos de los atributos data-* del botón
                id: e.currentTarget.dataset.productId, 
                name: e.currentTarget.dataset.productName,
                price: parseFloat(e.currentTarget.dataset.productPrice),
                image: e.currentTarget.dataset.productImage
            };
            addProductToCart(product);
        });
    });

    // --- CÓDIGO ESPECÍFICO PARA cart.html (Renderizado y gestión de botones dentro del carrito) ---
    if (document.getElementById('cart-items')) { 
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        function renderCartPage() {
            cartItemsContainer.innerHTML = ''; 
            let total = 0;

            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
            } else {
                emptyCartMessage.style.display = 'none';
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;

                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('d-flex', 'align-items-center', 'mb-3', 'p-3', 'border', 'rounded', 'shadow-sm'); 
                    cartItemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;" class="me-3 rounded">
                        <div class="flex-grow-1">
                            <h5 class="mb-1">${item.name}</h5>
                            <p class="mb-1 text-muted">${formatPrice(item.price)}</p>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary me-2 decrease-quantity" data-id="${item.id}">-</button>
                                <span class="fw-bold">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary ms-2 increase-quantity" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="text-end">
                            <h5 class="mb-1 fw-bold">${formatPrice(itemTotal)}</h5>
                            <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.id}">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                });
            }
            cartTotalElement.textContent = formatPrice(total);
            updateCartCount(); 
            saveCart();
        }

        // Event listener para los botones de eliminar y cambiar cantidad dentro del carrito
        cartItemsContainer.addEventListener('click', (e) => {
            const target = e.target;
            const id = target.dataset.id || target.closest('button')?.dataset.id; 

            if (!id) return; 

            if (target.classList.contains('remove-from-cart') || target.closest('.remove-from-cart')) {
                cart = cart.filter(item => item.id !== id);
                renderCartPage();
            } else if (target.classList.contains('decrease-quantity')) {
                const item = cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    renderCartPage();
                } else if (item && item.quantity === 1) {
                    cart = cart.filter(product => product.id !== id);
                    renderCartPage();
                }
            } else if (target.classList.contains('increase-quantity')) {
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.quantity++;
                    renderCartPage();
                }
            }
        });

        // Inicializar la vista del carrito al cargar la página cart.html
        renderCartPage();
    }

    // Asegurarse de que el contador del carrito se actualice en cualquier página que cargue script.js al inicio
    updateCartCount();

});

// --- Lógica del Reloj de Cuenta Regresiva (Countdown) ---
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) { // Solo ejecutar si el elemento countdown existe en la página
        const christmasDate = new Date(new Date().getFullYear(), 11, 25, 23, 59, 59).getTime(); // 25 de diciembre a las 23:59:59

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = christmasDate - now;

            // Si la cuenta regresiva ha terminado
            if (distance < 0) {
                clearInterval(countdownInterval);
                document.getElementById('countdown').innerHTML = '<h3 class="text-success">¡Feliz Navidad!</h3>';
                return;
            }

            // Cálculos de tiempo
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Mostrar el resultado en los elementos
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }

        // Actualizar la cuenta regresiva cada segundo
        const countdownInterval = setInterval(updateCountdown, 1000);

        // Llamar a updateCountdown una vez inmediatamente para evitar un retraso inicial
        updateCountdown();
    }