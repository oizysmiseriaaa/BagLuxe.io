// Cart state
let cart = [];
let cartTotal = 0;

// DOM Elements
const cartToggle = document.getElementById('cart-toggle');
const cartSection = document.getElementById('cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const notification = document.getElementById('notification');

// Summary Elements
const subtotalElement = document.getElementById('subtotal');
const discountInput = document.getElementById('discount');
const paymentInput = document.getElementById('payment');
const changeElement = document.getElementById('change');
const totalItemsElement = document.getElementById('total-items');
const finalSubtotalElement = document.getElementById('final-subtotal');
const finalDiscountElement = document.getElementById('final-discount');
const finalTotalElement = document.getElementById('final-total');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    cartToggle.addEventListener('click', toggleCart);
    discountInput.addEventListener('input', calculate);
    paymentInput.addEventListener('input', calculate);

    // Add event listener for shop now button
    const shopNowBtn = document.querySelector('.cta-button');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', scrollToProducts);
    }
});

function toggleCart() {
    cartSection.classList.toggle('active');
}

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
        showNotification('Item quantity updated in cart');
    } else {
        cart.push({
            id,
            name,
            price,
            image,
            quantity: 1
        });
        showNotification('Item added to cart');
    }
    
    updateCart();
    updateOrderSummary();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    updateOrderSummary();
    showNotification('Item removed from cart');
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = Math.max(0, item.quantity + change);
        if (item.quantity === 0) {
            removeFromCart(id);
        } else {
            updateCart();
            updateOrderSummary();
        }
    }
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = formatPrice(cartTotal);

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
        </div>
    `).join('');
}

function updateOrderSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    totalItemsElement.textContent = totalItems;
    subtotalElement.textContent = formatPrice(subtotal);
    finalSubtotalElement.textContent = formatPrice(subtotal);
    
    calculate();
}

function calculate() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(discountInput.value) || 0;
    const payment = parseFloat(paymentInput.value) || 0;
    
    const finalTotal = Math.max(subtotal - discount, 0);
    const change = Math.max(payment - finalTotal, 0);
    
    finalDiscountElement.textContent = formatPrice(discount);
    finalTotalElement.textContent = formatPrice(finalTotal);
    changeElement.textContent = formatPrice(change);
}

function formatPrice(amount) {
    return `₱${amount.toLocaleString()}`;
}

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    const finalTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(discountInput.value) || 0;
    const total = Math.max(finalTotal - discount, 0);
    
    alert(`Thank you for your purchase!\nTotal: ${formatPrice(total)}`);
    cart = [];
    updateCart();
    updateOrderSummary();
    toggleCart();
    
    // Reset inputs
    discountInput.value = '';
    paymentInput.value = '';
    
    showNotification('Purchase completed successfully!');
}

function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function viewOrder() {
    if (cart.length === 0) {
        showNotification('No items in cart');
        return;
    }

    let orderDetails = 'Current Order:\n\n';
    cart.forEach(item => {
        orderDetails += `${item.name}\n`;
        orderDetails += `Quantity: ${item.quantity}\n`;
        orderDetails += `Price: ${formatPrice(item.price)}\n`;
        orderDetails += `Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(discountInput.value) || 0;
    const finalTotal = Math.max(subtotal - discount, 0);

    orderDetails += `\nOrder Summary:\n`;
    orderDetails += `Subtotal: ${formatPrice(subtotal)}\n`;
    orderDetails += `Discount: ${formatPrice(discount)}\n`;
    orderDetails += `Final Total: ${formatPrice(finalTotal)}`;

    alert(orderDetails);
}

function clearOrder() {
    if (cart.length === 0) {
        showNotification('Cart is already empty');
        return;
    }

    if (confirm('Are you sure you want to clear your order?')) {
        cart = [];
        updateCart();
        updateOrderSummary();
        
        // Reset inputs
        discountInput.value = '';
        paymentInput.value = '';
        
        showNotification('Order cleared successfully');
    }
}

// Reviews functionality
function submitReview(event) {
    event.preventDefault();
    
    const name = document.getElementById('reviewer-name').value;
    const rating = document.getElementById('rating').value;
    const content = document.getElementById('review-content').value;
    
    // Create new review card
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <h4>${name}</h4>
                <div class="stars">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
            </div>
        </div>
        <p class="review-text">"${content}"</p>
    `;
    
    // Add the new review to the grid
    const reviewsGrid = document.querySelector('.reviews-grid');
    reviewsGrid.insertBefore(reviewCard, reviewsGrid.firstChild);
    
    // Clear form
    document.getElementById('review-form').reset();
    
    // Show success message
    showNotification('Review submitted successfully!');
    
    // Animate the new review card
    reviewCard.style.opacity = '0';
    reviewCard.style.transform = 'translateY(20px)';
    setTimeout(() => {
        reviewCard.style.transition = 'all 0.5s ease';
        reviewCard.style.opacity = '1';
        reviewCard.style.transform = 'translateY(0)';
    }, 100);
}