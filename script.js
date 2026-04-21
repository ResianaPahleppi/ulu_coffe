// Database Menu Statis (Dengan Foto yang sudah diperbarui)
const menus = [
    { id: 1, name: "Ice Kopsuren", price: 24000, image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&q=80" },
    { id: 2, name: "Ice Kopsushu", price: 24000, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80" },
    { id: 3, name: "Japanese V60", price: 32000, image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80" },
    { id: 4, name: "Ice Chocoffee", price: 26000, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80" },
    { id: 5, name: "Nasi Goreng Ulu", price: 30000, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80" },
    { id: 6, name: "Tahu Cabai Garam", price: 18000, image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
    { id: 7, name: "Mix Platter", price: 25000, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80" },
    { id: 8, name: "Lemon Tea Refresh", price: 15000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80" }
];

let cart = [];

// Fungsi Format Rupiah
const formatRp = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// Render Menu ke HTML
const menuContainer = document.getElementById('menu-container');
menus.forEach(item => {
    menuContainer.innerHTML += `
        <div class="menu-card">
            <img src="${item.image}" alt="${item.name}" class="menu-image">
            <h3 class="menu-title">${item.name}</h3>
            <p class="menu-price">${formatRp(item.price)}</p>
            <button class="btn-add" onclick="addToCart(${item.id})">+ Tambah</button>
        </div>
    `;
});

// Tambah item ke keranjang
function addToCart(id) {
    const product = menus.find(m => m.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) { existing.qty += 1; } else { cart.push({ ...product, qty: 1 }); }
    renderCart();
}

// Render isi keranjang
function renderCart() {
    const cartContainer = document.getElementById('cart-container');
    const cartTotal = document.getElementById('cart-total');
    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="empty-state"><p>Belum ada pesanan.</p><span>Silakan pilih menu di samping.</span></div>`;
        cartTotal.innerText = 'Rp 0';
        return;
    }
    cartContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        cartContainer.innerHTML += `
            <div class="cart-item">
                <div><strong>${item.name}</strong><br><small>${item.qty}x @ ${formatRp(item.price)}</small></div>
                <strong>${formatRp(subtotal)}</strong>
            </div>
        `;
    });
    cartTotal.innerText = formatRp(total);
}

// Tangani Form Submit (Tampilkan Struk & Kirim ke WhatsApp)
document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (cart.length === 0) { alert("Keranjang masih kosong! Silakan pilih menu terlebih dahulu."); return; }

    const name = document.getElementById('cust-name').value;
    let phone = document.getElementById('cust-phone').value;
    const delivery = document.getElementById('delivery-method').value;
    const address = document.getElementById('cust-address').value;
    const payment = document.getElementById('payment-method').value;

    if (phone.startsWith('0')) { phone = '62' + phone.substring(1); }

    document.getElementById('r-name').innerText = name;
    document.getElementById('r-phone').innerText = phone;
    document.getElementById('r-delivery').innerText = delivery;
    document.getElementById('r-address').innerText = address;
    document.getElementById('r-payment').innerText = payment;

    const rItems = document.getElementById('r-items');
    rItems.innerHTML = '';
    let total = 0;
    let waItemsText = '';

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        rItems.innerHTML += `<div class="r-row" style="margin-bottom: 4px;"><span>${item.qty}x ${item.name}</span><span>${formatRp(subtotal)}</span></div>`;
        waItemsText += `- ${item.qty}x ${item.name} (${formatRp(subtotal)})\n`;
    });

    const finalTotal = formatRp(total);
    document.getElementById('r-total').innerText = finalTotal;

    // Tampilkan Modal
    document.getElementById('receipt-modal').style.display = 'flex';

    // Kirim WA
    const waMessage = `*STRUK PEMESANAN ULU COFFE* ☕\n--------------------------------------\n*Nama:* ${name}\n*Pengantaran:* ${delivery}\n*Alamat/Meja:* ${address}\n*Pembayaran:* ${payment}\n--------------------------------------\n*PESANAN:*\n${waItemsText}--------------------------------------\n*TOTAL PEMBAYARAN:* *${finalTotal}*\n\nTerima kasih sudah memesan!`;
    const encodedMessage = encodeURIComponent(waMessage);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
});

// Tutup Modal dan Bersihkan
function closeModal() {
    document.getElementById('receipt-modal').style.display = 'none';
    cart = [];
    renderCart();
    document.getElementById('checkout-form').reset();
}

// FUNGSI BARU: Download PDF Struk (Sudah Diperbaiki Anti-Blank)
function downloadPDF() {
    // Ambil elemen HTML yang ingin dijadikan PDF (Hanya area struk)
    const element = document.getElementById('receipt-printable');

    // Opsi konfigurasi PDF
    const opt = {
        margin: 0.5,
        filename: 'Struk_Ulu_Coffe.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0, // Kunci utama agar PDF tidak blank saat di-scroll
            scrollX: 0,
            backgroundColor: '#ffffff' // Pastikan background putih murni
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Eksekusi pembuatan PDF
    html2pdf().set(opt).from(element).save();
}