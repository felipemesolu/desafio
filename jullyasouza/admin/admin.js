let adminProducts = [];
let currentFilter = 'all';
let pendingImageBlob = null;

// CONFIGURAÇÃO
const ADMIN_PASS = "jullya2026";
const IMGBB_API_KEY = "52f67476a2dffc4f391f30e9112da4ba"; // Cole sua chave aqui: https://imgbb.com/api

async function checkAuth() {
    const input = document.getElementById('admin-pass').value;
    const error = document.getElementById('login-error');
    if (input === ADMIN_PASS) {
        document.getElementById('login-overlay').classList.add('opacity-0', 'pointer-events-none');
        document.getElementById('admin-panel').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('admin-panel').classList.add('opacity-100');
            loadAdminProducts();
        }, 100);
    } else {
        error.classList.remove('hidden');
        setTimeout(() => error.classList.add('hidden'), 2000);
    }
}

function logout() {
    window.location.reload(); // Forma mais segura de limpar o estado e voltar ao login
}

async function loadAdminProducts() {
    let data = [];
    try {
        const response = await fetch('/api/jullya');
        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            }
        }
    } catch (apiError) {
        console.warn("API offline, tentando carregar dados estáticos...");
    }

    if (!data || data.length === 0) {
        try {
            const staticRes = await fetch('../products.json');
            if (staticRes.ok) {
                data = await staticRes.json();
            }
        } catch (staticError) {
            console.error("Falha ao carregar produtos:", staticError);
        }
    }

    adminProducts = data;
    renderAdminList();
}

function renderAdminList() {
    const container = document.getElementById('admin-product-list');
    const filtered = currentFilter === 'all' ? adminProducts : adminProducts.filter(p => p.brand === currentFilter);
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707.293l-2.414-2.414A1 1 0 006.586 13H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <h3 class="text-lg font-serif text-[#0B1320] italic mb-2">Nenhum produto encontrado</h3>
                <p class="text-xs text-zinc-400">Você ainda não cadastrou produtos nesta marca.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(p => {
        const isExternal = p.image.startsWith('http');
        const imgPath = isExternal ? p.image : `../images/produtos/${p.image}.webp`;

        return `
            <div class="admin-card rounded-[35px] p-5 md:p-6 flex flex-col gap-5">
                <div class="h-48 md:h-52 bg-white shadow-inner rounded-[30px] overflow-hidden flex items-center justify-center p-6 border border-slate-50 relative">
                    <img src="${imgPath}" class="h-full w-full object-contain" onerror="this.src='https://placehold.co/400x400/0B1320/rose-gold?text=Sem+Foto'">
                    <span class="absolute top-4 left-4 bg-slate-100/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest text-[#0B1320] font-black">${p.brand}</span>
                </div>
                <div class="px-2">
                    <h4 class="font-bold text-[15px] md:text-base text-slate-900 leading-tight mb-3 line-clamp-2 min-h-[3rem]">${p.name}</h4>
                    <div class="flex items-center gap-3">
                        <span class="text-lg font-black text-[#0B1320]">R$ ${p.price.toFixed(2)}</span>
                        ${p.oldPrice && p.oldPrice > p.price ? `<span class="text-[12px] text-zinc-400 line-through font-bold">R$ ${p.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                </div>
                <div class="flex gap-3 mt-auto">
                    <button onclick="openEditModal(${p.id})" class="flex-grow py-4 bg-slate-100 rounded-2xl text-[11px] uppercase font-black tracking-widest hover:bg-[#0B1320] hover:text-white transition-all text-slate-600 shadow-sm">Editar</button>
                    <button onclick="deleteProduct(${p.id})" class="px-6 py-4 bg-rose-50 rounded-2xl text-[11px] uppercase font-black tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">Excluir</button>
                </div>
            </div>
        `;
    }).join('');
}

// IMAGE UPLOAD TO IMGBB
async function uploadToImgBB(blob) {
    if (IMGBB_API_KEY === "SUA_CHAVE_IMGBB_AQUI" || !IMGBB_API_KEY) {
        throw new Error("Configuração Necessária: Você precisa colar sua chave da API do ImgBB no arquivo admin.js para enviar novas imagens.");
    }

    const formData = new FormData();
    formData.append("image", blob);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (data.success) {
        return data.data.url; // Retorna o link da imagem
    } else {
        throw new Error("Erro no upload para ImgBB: Verifique sua chave de API.");
    }
}

document.getElementById('field-file').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };

    try {
        const placeholder = document.getElementById('upload-placeholder');
        placeholder.innerHTML = `<span class="text-[8px] animate-pulse">Otimizando...</span>`;

        const compressedFile = await imageCompression(file, options);
        pendingImageBlob = compressedFile;

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
            const preview = document.getElementById('image-preview');
            preview.src = reader.result;
            preview.classList.remove('hidden');
            placeholder.classList.add('hidden');
        };
    } catch (error) {
        console.error("Erro na compressão:", error);
    }
});

async function saveChanges() {
    const btn = document.getElementById('btn-save');
    const originalText = btn.innerText;

    try {
        btn.innerText = "Salvando no Banco...";
        btn.classList.add('animate-pulse');

        const response = await fetch('/api/jullya', {
            method: 'POST',
            body: JSON.stringify(adminProducts),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            btn.innerText = "Salvo com Sucesso!";
            btn.classList.remove('bg-green-500', 'animate-pulse');
            btn.classList.add('bg-blue-500');
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.add('hidden');
                btn.classList.remove('bg-blue-500');
                btn.classList.add('bg-green-500');
            }, 2000);
        } else {
            const errorText = await response.text();
            console.error("Erro do servidor:", errorText);
            alert("Erro ao salvar: Verifique se o banco de dados KV está configurado no Cloudflare.");
            btn.innerText = originalText;
            btn.classList.remove('animate-pulse');
        }
    } catch (e) {
        console.error("Erro de rede:", e);
        alert("Erro ao salvar: Verifique a conexão com o banco de dados.");
        btn.innerText = originalText;
        btn.classList.remove('animate-pulse');
    }
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('field-id').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    try {
        submitBtn.innerText = "Processando Imagem...";
        submitBtn.disabled = true;

        let imageUrl = document.getElementById('field-image').value;

        // Se houver uma nova imagem, faz o upload para o ImgBB
        if (pendingImageBlob) {
            submitBtn.innerText = "Enviando para Nuvem...";
            imageUrl = await uploadToImgBB(pendingImageBlob);
        }

        const productData = {
            id: id ? parseInt(id) : Date.now(),
            name: document.getElementById('field-name').value,
            price: parseFloat(document.getElementById('field-price').value),
            oldPrice: document.getElementById('field-oldPrice').value ? parseFloat(document.getElementById('field-oldPrice').value) : null,
            brand: document.getElementById('field-brand').value,
            image: imageUrl,
            description: document.getElementById('field-desc').value
        };

        if (id) {
            const index = adminProducts.findIndex(x => x.id === parseInt(id));
            adminProducts[index] = productData;
        } else {
            adminProducts.push(productData);
        }

        renderAdminList();
        closeModal();
        document.getElementById('btn-save').classList.remove('hidden');
    } catch (error) {
        alert("Erro ao salvar produto. Verifique sua chave da API ImgBB.");
    } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
        pendingImageBlob = null;
    }
});

function openAddModal() {
    document.getElementById('product-form').reset();
    document.getElementById('field-id').value = '';
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('upload-placeholder').classList.remove('hidden');
    document.getElementById('upload-placeholder').innerHTML = `<svg class="w-5 h-5 mx-auto text-zinc-300 mb-1" ...><path d="M12 4v16m8-8H4" .../></svg><span class="text-[8px] uppercase font-bold text-zinc-400">Trocar Foto</span>`;
    pendingImageBlob = null;
    document.getElementById('modal-title').innerText = "Novo Produto";
    document.getElementById('product-modal').classList.remove('hidden');
}

function openEditModal(id) {
    const p = adminProducts.find(x => x.id === id);
    if (!p) return;
    openAddModal();
    document.getElementById('field-id').value = p.id;
    document.getElementById('field-name').value = p.name;
    document.getElementById('field-price').value = p.price;
    document.getElementById('field-oldPrice').value = p.oldPrice || '';
    document.getElementById('field-brand').value = p.brand;
    document.getElementById('field-image').value = p.image;
    document.getElementById('field-desc').value = p.description;

    const preview = document.getElementById('image-preview');
    const isExternal = p.image.startsWith('http');
    preview.src = isExternal ? p.image : `../images/produtos/${p.image}.webp`;
    preview.classList.remove('hidden');
    document.getElementById('upload-placeholder').classList.add('hidden');
    document.getElementById('modal-title').innerText = "Editar Produto";
}

let productIdToDelete = null;

function deleteProduct(id) {
    productIdToDelete = id;
    document.getElementById('delete-modal').classList.remove('hidden');
}

function closeDeleteModal() {
    productIdToDelete = null;
    document.getElementById('delete-modal').classList.add('hidden');
}

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if (productIdToDelete) {
        adminProducts = adminProducts.filter(x => x.id !== productIdToDelete);
        renderAdminList();
        document.getElementById('btn-save').classList.remove('hidden');
        closeDeleteModal();
    }
});

function closeModal() { document.getElementById('product-modal').classList.add('hidden'); }
function filterBrand(brand) { 
    currentFilter = brand; 
    renderAdminList(); 
    
    // Sync buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const isAll = brand === 'all' && btn.innerText.toLowerCase().includes('todas');
        const isMatch = btn.innerText.toLowerCase().includes(brand);
        btn.classList.toggle('active', isAll || isMatch);
    });

    // Sync select
    const mobileSelect = document.getElementById('brand-select-mobile');
    if (mobileSelect) mobileSelect.value = brand;
}
