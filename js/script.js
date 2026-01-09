// ========================================
// GESTION DU PANIER COMPLET
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Récupérer le panier depuis le localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Mettre à jour l'affichage au chargement
    updateCartDisplay();
    
    // Si on est sur la page panier, afficher les produits
    if (document.querySelector('.cart-page')) {
        displayCartItems();
    }
    
    // Sélectionner tous les boutons "Ajouter au panier"
    const addToCartButtons = document.querySelectorAll('.btn-add-cart, .btn-add-cart-large');
    
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Trouver les informations du produit
            const productCard = button.closest('.product-card, .product-detail-info');
            
            let productName, productPrice, productImage;
            
            // Si c'est une carte produit (page d'accueil)
            if (productCard.classList.contains('product-card')) {
                productName = productCard.querySelector('h3').textContent;
                productPrice = productCard.querySelector('.product-price').textContent;
                productImage = productCard.querySelector('img').src;
            } 
            // Si c'est la page détail produit
            else {
                productName = productCard.querySelector('h1').textContent;
                productPrice = productCard.querySelector('.product-detail-price').textContent;
                productImage = document.querySelector('.product-detail-image img').src;
            }
            
            // Créer l'objet produit
            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            // Vérifier si le produit existe déjà dans le panier
            const existingProduct = cart.find(item => item.name === product.name);
            
            if (existingProduct) {
                // Augmenter la quantité
                existingProduct.quantity++;
            } else {
                // Ajouter le nouveau produit
                cart.push(product);
            }
            
            // Sauvegarder dans le localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Afficher notification
            showNotification('✅ Produit ajouté au panier !');
            
            // Mettre à jour l'affichage
            updateCartDisplay();
        });
    });
    
    // Fonction pour mettre à jour le compteur du panier
    function updateCartDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartIcon = document.querySelector('.nav-icons a');
        if (cartIcon) {
            cartIcon.innerHTML = '🛒 Panier (' + totalItems + ')';
        }
    }
    
    // Fonction pour afficher les produits dans le panier
    function displayCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        
        if (!cartItemsContainer) return;
        
        // Vider le conteneur
        cartItemsContainer.innerHTML = '';
        
        // Si le panier est vide
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Votre panier est vide</p>';
            updateCartSummary();
            return;
        }
        
        // Afficher chaque produit
        cart.forEach(function(product, index) {
            const priceValue = parseFloat(product.price.replace('€', '').trim());
            const totalPrice = (priceValue * product.quantity).toFixed(2);
            
            const cartItemHTML = `
                <div class="cart-item" data-index="${index}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="cart-item-details">
                        <h3>${product.name}</h3>
                        <p class="cart-item-price">${product.price}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn minus-btn">-</button>
                        <span>${product.quantity}</span>
                        <button class="qty-btn plus-btn">+</button>
                    </div>
                    <p class="cart-item-total">${totalPrice} €</p>
                    <button class="btn-remove">🗑️</button>
                </div>
            `;
            
            cartItemsContainer.innerHTML += cartItemHTML;
        });
        
        // Ajouter les événements aux boutons
        setupCartButtons();
        updateCartSummary();
    }
    
    // Fonction pour gérer les boutons du panier
    function setupCartButtons() {
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach(function(item) {
            const index = parseInt(item.dataset.index);
            const minusBtn = item.querySelector('.minus-btn');
            const plusBtn = item.querySelector('.plus-btn');
            const removeBtn = item.querySelector('.btn-remove');
            
            // Bouton MOINS
            minusBtn.addEventListener('click', function() {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    displayCartItems();
                    updateCartDisplay();
                }
            });
            
            // Bouton PLUS
            plusBtn.addEventListener('click', function() {
                cart[index].quantity++;
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCartItems();
                updateCartDisplay();
            });
            
         // Bouton SUPPRIMER
removeBtn.addEventListener('click', function() {
    // Ajouter la classe d'animation
    item.classList.add('removing');
    
    // Attendre la fin de l'animation avant de supprimer
    setTimeout(function() {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartDisplay();
    }, 400);
});
        });
    }
    
    // Fonction pour mettre à jour le résumé
    function updateCartSummary() {
        let total = 0;
        
        cart.forEach(function(product) {
            const priceValue = parseFloat(product.price.replace('€', '').trim());
            total += priceValue * product.quantity;
        });
        
        const subtotalElement = document.querySelector('.summary-line:first-child span:last-child');
        if (subtotalElement) {
            subtotalElement.textContent = total.toFixed(2) + ' €';
        }
        
        const totalElement = document.querySelector('.summary-line.total span:last-child');
        if (totalElement) {
            totalElement.textContent = total.toFixed(2) + ' €';
        }
    }
    
    // Fonction pour afficher une notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(function() {
            notification.classList.remove('show');
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 3000);
    }
});

// ========================================
// ANIMATIONS AU SCROLL
// ========================================

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function animateOnScroll() {
    const productCards = document.querySelectorAll('.product-card');
    const featureCards = document.querySelectorAll('.feature-card');
    const allCards = [...productCards, ...featureCards];
    
    allCards.forEach(function(card, index) {
        if (isElementInViewport(card)) {
            setTimeout(function() {
                card.classList.add('fade-in');
            }, index * 100);
        }
    });
}

animateOnScroll();
window.addEventListener('scroll', animateOnScroll);

// ========================================
// GESTION DU PANIER (page panier.html)
// ========================================

function setupCartQuantities() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    cartItems.forEach(function(item) {
        const minusBtn = item.querySelector('.qty-btn:first-child');
        const plusBtn = item.querySelector('.qty-btn:last-child');
        const quantitySpan = item.querySelector('.cart-item-quantity span');
        const priceElement = item.querySelector('.cart-item-price');
        const totalElement = item.querySelector('.cart-item-total');
        const removeBtn = item.querySelector('.btn-remove');
        
        const unitPrice = parseFloat(priceElement.textContent.replace('€', '').trim());
        
        if (minusBtn) {
            minusBtn.addEventListener('click', function() {
                let quantity = parseInt(quantitySpan.textContent);
                if (quantity > 1) {
                    quantity--;
                    quantitySpan.textContent = quantity;
                    const newTotal = (unitPrice * quantity).toFixed(2);
                    totalElement.textContent = newTotal + ' €';
                    updateCartTotal();
                }
            });
        }
        
        if (plusBtn) {
            plusBtn.addEventListener('click', function() {
                let quantity = parseInt(quantitySpan.textContent);
                quantity++;
                quantitySpan.textContent = quantity;
                const newTotal = (unitPrice * quantity).toFixed(2);
                totalElement.textContent = newTotal + ' €';
                updateCartTotal();
            });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    setTimeout(function() {
                        item.remove();
                        updateCartTotal();
                    }, 300);
                }
            });
        }
    });
}

function updateCartTotal() {
    let total = 0;
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(function(item) {
        const totalElement = item.querySelector('.cart-item-total');
        const itemTotal = parseFloat(totalElement.textContent.replace('€', '').trim());
        total += itemTotal;
    });
    
    const subtotalElement = document.querySelector('.summary-line:first-child span:last-child');
    if (subtotalElement) {
        subtotalElement.textContent = total.toFixed(2) + ' €';
    }
    
    const totalElement = document.querySelector('.summary-line.total span:last-child');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2) + ' €';
    }
}

if (document.querySelector('.cart-page')) {
    setupCartQuantities();
}

// ========================================
// PAGE COMMANDE
// ========================================

// Si on est sur la page de commande
if (document.querySelector('.checkout-page')) {
    
    // Récupérer le panier
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Afficher les produits dans le résumé
    displayOrderSummary();
    
    // Gérer le changement de mode de livraison
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(function(option) {
        option.addEventListener('change', function() {
            updateOrderTotal();
        });
    });
    
    // Gérer la validation de la commande
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    placeOrderBtn.addEventListener('click', function() {
        validateAndPlaceOrder();
    });
    
    // Fonction pour afficher le résumé de commande
    function displayOrderSummary() {
        const orderItemsContainer = document.getElementById('orderItems');
        
        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<p style="text-align: center; color: #666;">Votre panier est vide</p>';
            return;
        }
        
        orderItemsContainer.innerHTML = '';
        
        cart.forEach(function(product) {
            const priceValue = parseFloat(product.price.replace('€', '').trim());
            const totalPrice = (priceValue * product.quantity).toFixed(2);
            
            const orderItemHTML = `
                <div class="order-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="order-item-details">
                        <div class="order-item-name">${product.name}</div>
                        <div class="order-item-quantity">Quantité : ${product.quantity}</div>
                    </div>
                    <div class="order-item-price">${totalPrice} €</div>
                </div>
            `;
            
            orderItemsContainer.innerHTML += orderItemHTML;
        });
        
        updateOrderTotal();
    }
    
    // Fonction pour mettre à jour le total
    function updateOrderTotal() {
        let subtotal = 0;
        
        // Calculer le sous-total
        cart.forEach(function(product) {
            const priceValue = parseFloat(product.price.replace('€', '').trim());
            subtotal += priceValue * product.quantity;
        });
        
        // Récupérer le coût de livraison
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        let shippingCost = 0;
        let shippingText = 'Gratuite';
        
        if (selectedShipping && selectedShipping.value === 'express') {
            shippingCost = 9.99;
            shippingText = '9,99 €';
        }
        
        // Calculer le total
        const total = subtotal + shippingCost;
        
        // Mettre à jour l'affichage
        document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' €';
        document.getElementById('shippingCost').textContent = shippingText;
        document.getElementById('totalCost').textContent = total.toFixed(2) + ' €';
    }
    
    // Fonction pour valider et passer la commande
    function validateAndPlaceOrder() {
        // Récupérer les valeurs des champs
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const zipCode = document.getElementById('zipCode').value.trim();
        const city = document.getElementById('city').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiry = document.getElementById('expiry').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        
        // Vérifier que tous les champs sont remplis
        if (!firstName || !lastName || !email || !phone || !address || 
            !zipCode || !city || !cardNumber || !expiry || !cvv) {
            alert('⚠️ Veuillez remplir tous les champs obligatoires');
            return;
        }
        
        // Vérifier le format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('⚠️ Veuillez entrer une adresse email valide');
            return;
        }
        
        // Vérifier que le panier n'est pas vide
        if (cart.length === 0) {
            alert('⚠️ Votre panier est vide');
            return;
        }
        
        // Créer l'objet commande
        const order = {
            id: 'CMD-' + Date.now(),
            date: new Date().toLocaleDateString('fr-FR'),
            customer: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone
            },
            shipping: {
                address: address,
                zipCode: zipCode,
                city: city,
                country: document.getElementById('country').value,
                method: document.querySelector('input[name="shipping"]:checked').value
            },
            items: cart,
            total: document.getElementById('totalCost').textContent
        };
        
        // Sauvegarder la commande
        localStorage.setItem('lastOrder', JSON.stringify(order));
        
        // Vider le panier
        localStorage.removeItem('cart');
        localStorage.setItem('cartCount', 0);
        
        // Rediriger vers la page de confirmation
        window.location.href = 'confirmation.html';
    }
}

// ========================================
// PAGE CONFIRMATION
// ========================================

// Si on est sur la page de confirmation
if (document.querySelector('.confirmation-page')) {
    
    // Récupérer la dernière commande
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    
    if (!lastOrder) {
        // Si pas de commande, rediriger vers l'accueil
        document.querySelector('.confirmation-container').innerHTML = `
            <div class="success-icon">⚠️</div>
            <h1>Aucune commande trouvée</h1>
            <p class="confirmation-message">Vous n'avez pas encore passé de commande.</p>
            <a href="index.html" class="btn-primary">Retour à l'accueil</a>
        `;
    } else {
        // Remplir les détails de la commande
        document.getElementById('orderNumber').textContent = lastOrder.id;
        document.getElementById('orderDate').textContent = lastOrder.date;
        document.getElementById('customerEmail').textContent = lastOrder.customer.email;
        
        // Adresse complète
        const fullAddress = `${lastOrder.shipping.address}, ${lastOrder.shipping.zipCode} ${lastOrder.shipping.city}, ${lastOrder.shipping.country}`;
        document.getElementById('shippingAddress').textContent = fullAddress;
        
        // Total
        document.getElementById('orderTotal').textContent = lastOrder.total;
        
        // Afficher les produits commandés
        const orderedItemsContainer = document.getElementById('orderedItems');
        orderedItemsContainer.innerHTML = '';
        
        lastOrder.items.forEach(function(product) {
            const priceValue = parseFloat(product.price.replace('€', '').trim());
            const totalPrice = (priceValue * product.quantity).toFixed(2);
            
            const productHTML = `
                <div class="ordered-product">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="ordered-product-info">
                        <div class="ordered-product-name">${product.name}</div>
                        <div class="ordered-product-quantity">Quantité : ${product.quantity}</div>
                    </div>
                    <div class="ordered-product-price">${totalPrice} €</div>
                </div>
            `;
            
            orderedItemsContainer.innerHTML += productHTML;
        });
    }
}

