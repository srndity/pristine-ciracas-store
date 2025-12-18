const products = [
    {
        id: 1,
        name: "Pristine 8.6+ 400ml",
        price: 65000,
        image: "pristine.jpg",
        description: "Air minum alkali Pristine pH 8.6+ dalam kemasan 400ml, praktis dibawa kemana-mana untuk hidrasi optimal sepanjang hari.",
        benefits: [
            "pH alkali 8.6+ untuk keseimbangan tubuh",
            "Ukuran 400ml praktis dibawa",
            "Membantu detoksifikasi tubuh",
            "Menyegarkan dan menghidrasi"
        ]
    },
    {
        id: 2,
        name: "Pristine 8.6+ 600ml",
        price: 85000,
        image: "pristine.jpg",
        description: "Air minum alkali Pristine pH 8.6+ ukuran 600ml, pas untuk aktivitas olahraga dan perjalanan jauh dengan hidrasi maksimal.",
        benefits: [
            "pH alkali 8.6+ tinggi",
            "Kapasitas 600ml lebih awet",
            "Cocok untuk olahraga",
            "Menjaga keseimbangan pH tubuh"
        ]
    },
    {
        id: 3,
        name: "Pristine 8.6+ 1500ml",
        price: 85000,
        image: "pristine.jpg",
        description: "Air minum alkali Pristine pH 8.6+ kemasan 1.5 liter, hemat dan ekonomis untuk kebutuhan keluarga di rumah.",
        benefits: [
            "pH alkali 8.6+ berkualitas",
            "Ukuran 1.5L hemat untuk keluarga",
            "Membantu metabolisme tubuh",
            "Harga ekonomis"
        ]
    },
    {
        id: 4,
        name: "Pristine Galon 8.6+ 19l (New)",
        price: 62000,
        image: "galon.jpg",
        description: "Air minum alkali Pristine pH 8.6+ galon 19 liter dengan galon baru. Solusi lengkap untuk kebutuhan air minum berkualitas di rumah atau kantor.",
        benefits: [
            "pH alkali 8.6+ premium",
            "Galon baru bersih & higienis",
            "Kapasitas 19L tahan lama",
            "Cocok untuk rumah & kantor"
        ]
    },
    {
        id: 5,
        name: "Pristine Galon 8.6+ 19l (Refill)",
        price: 22000,
        image: "galon.jpg",
        description: "Isi ulang air minum alkali Pristine pH 8.6+ galon 19 liter. Lebih hemat dan ramah lingkungan dengan sistem refill.",
        benefits: [
            "pH alkali 8.6+ berkualitas sama",
            "Harga refill lebih terjangkau",
            "Ramah lingkungan",
            "Hemat hingga 65%"
        ]
    }
];

let cart = [];
const DISCOUNT_THRESHOLD = 10;
const DISCOUNT_AMOUNT = 3000;

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadCart();
});

function displayProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x300/0891b2/ffffff?text=${encodeURIComponent(product.name)}'">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description.substring(0, 80)}...</div>
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                <button class="btn-add-to-cart" onclick="addToCart(${product.id}, event)">Tambah ke Keranjang</button>
            </div>
        </div>
    `).join('');
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalImage').innerHTML = `
        <img src="${product.image}" 
             alt="${product.name}" 
             style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;"
             onerror="this.onerror=null; this.src='https://via.placeholder.com/400x400/0891b2/ffffff?text=${encodeURIComponent(product.name)}'">
    `;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `Rp ${product.price.toLocaleString('id-ID')}`;
    document.getElementById('modalDescription').textContent = product.description;
    
    const benefitsList = document.getElementById('modalBenefits');
    benefitsList.innerHTML = product.benefits.map(b => `<li>${b}</li>`).join('');
    
    document.getElementById('modalQuantity').value = 1;
    document.getElementById('productModal').style.display = 'block';
    
    window.currentModalProduct = productId;
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function increaseQuantity() {
    const input = document.getElementById('modalQuantity');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('modalQuantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addToCartFromModal() {
    const quantity = parseInt(document.getElementById('modalQuantity').value);
    addToCart(window.currentModalProduct, null, quantity);
    closeModal();
}

function addToCart(productId, event, quantity = 1) {
    if (event) {
        event.stopPropagation();
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartDisplay();
    
    alert(`${product.name} ditambahkan ke keranjang!`);
}

function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function isDiscountApplicable() {
    return getTotalItems() >= DISCOUNT_THRESHOLD;
}

function calculateTotal() {
    let total = 0;
    const isDiscount = isDiscountApplicable();
    
    cart.forEach(item => {
        const itemPrice = isDiscount ? (item.price - DISCOUNT_AMOUNT) : item.price;
        total += itemPrice * item.quantity;
    });
    
    return total;
}

function calculateDiscount() {
    if (!isDiscountApplicable()) return 0;
    
    const totalItems = getTotalItems();
    return DISCOUNT_AMOUNT * totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = getTotalItems();
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Keranjang belanja kosong</div>';
        cartTotal.textContent = 'Rp 0';
        return;
    }
    
    const isDiscount = isDiscountApplicable();
    
    cartItems.innerHTML = cart.map(item => {
        const itemPrice = isDiscount ? (item.price - DISCOUNT_AMOUNT) : item.price;
        const originalPrice = item.price;
        
        return `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/60x60/0891b2/ffffff?text=P'">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">
                    ${isDiscount ? `<span style="text-decoration: line-through; color: #999; font-size: 0.9em;">Rp ${originalPrice.toLocaleString('id-ID')}</span> ` : ''}
                    <span style="${isDiscount ? 'color: #e74c3c; font-weight: bold;' : ''}">Rp ${itemPrice.toLocaleString('id-ID')}</span>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Hapus</button>
                </div>
            </div>
        </div>
    `;
    }).join('');
    

    if (isDiscount) {
        const discountAmount = calculateDiscount();
        cartItems.innerHTML += `
            <div style="background: #d4edda; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #c3e6cb;">
                <div style="color: #155724; font-weight: bold; margin-bottom: 5px;">🎉 Diskon 10+ Item Aktif!</div>
                <div style="color: #155724; font-size: 0.9em;">Hemat Rp ${discountAmount.toLocaleString('id-ID')}</div>
            </div>
        `;
    } else if (totalItems >= 5) {
        const itemsNeeded = DISCOUNT_THRESHOLD - totalItems;
        cartItems.innerHTML += `
            <div style="background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #ffeaa7;">
                <div style="color: #856404; font-weight: bold; margin-bottom: 5px;">💡 Hampir dapat diskon!</div>
                <div style="color: #856404; font-size: 0.9em;">Tambah ${itemsNeeded} item lagi untuk diskon Rp ${DISCOUNT_AMOUNT.toLocaleString('id-ID')}/item</div>
            </div>
        `;
    }
    
    const total = calculateTotal();
    cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    saveCart();
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) {
        alert('Keranjang belanja kosong!');
        return;
    }
    
    const isDiscount = isDiscountApplicable();
    let message = '*PESANAN PRISTINE*\n\n';
    
    cart.forEach(item => {
        const itemPrice = isDiscount ? (item.price - DISCOUNT_AMOUNT) : item.price;
        message += `${item.name}\n`;
        message += `Jumlah: ${item.quantity}\n`;
        
        if (isDiscount) {
            message += `Harga Normal: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
            message += `Harga Diskon: Rp ${(itemPrice * item.quantity).toLocaleString('id-ID')}\n\n`;
        } else {
            message += `Harga: Rp ${(itemPrice * item.quantity).toLocaleString('id-ID')}\n\n`;
        }
    });
    
    if (isDiscount) {
        const discountAmount = calculateDiscount();
        message += `💰 Diskon 10+ Item: -Rp ${discountAmount.toLocaleString('id-ID')}\n`;
    }
    
    const total = calculateTotal();
    message += `*TOTAL: Rp ${total.toLocaleString('id-ID')}*\n\n`;
    message += 'Mohon konfirmasi pesanan saya. Terima kasih!';
    
    const whatsappNumber = '6289637374182'; 
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
}

function saveCart() {
    updateCartDisplay();
}

function loadCart() {
    updateCartDisplay();
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function handleSubmit(event) {
    event.preventDefault();
    alert('Terima kasih! Pesan Anda akan segera kami respon.');
    event.target.reset();
}

window.onclick = (event) => {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
}