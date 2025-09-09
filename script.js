// Global variables
  let cart = [];
  let categories = [];
  let trees = [];
  let activeCategory = null;

  // DOM elements
  const categoryList = document.getElementById('category-list');
  const treeCards = document.getElementById('tree-cards');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const treeModal = document.getElementById('tree-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalDescription = document.getElementById('modal-description');
  const modalCategory = document.getElementById('modal-category');
  const modalPrice = document.getElementById('modal-price');
  const spinner = document.getElementById('spinner');

  // Spinner toggle
   function toggleSpinner(show) {
     if (show) {
       spinner.classList.remove('hidden');
       treeCards.classList.add('hidden');
     } else {
      spinner.classList.add('hidden');
       treeCards.classList.remove('hidden');
    }
   }



  // Fetch categories
  async function fetchCategories() {
    try {
      toggleSpinner(true);
      const res = await fetch('https://openapi.programming-hero.com/api/categories');
      const data = await res.json();
      categories = data.categories;
      renderCategories();
      toggleSpinner(false);
    } catch (e) {
      console.error(e);
      toggleSpinner(false);
    }
  }

  // Fetch trees (by category or all)
  async function fetchTreesByCategory(id) {
    try {
      toggleSpinner(true);
      let url = id
        ? `https://openapi.programming-hero.com/api/category/${id}`
        : 'https://openapi.programming-hero.com/api/plants';
      const res = await fetch(url);
      const data = await res.json();
      trees = data.plants;
      renderTrees();
      toggleSpinner(false);
    } catch (e) {
      console.error(e);
      toggleSpinner(false);
    }
  }

  // Render categories
  function renderCategories() {
    categoryList.innerHTML = '';
    // Add "All Trees" button
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All Trees';
    allBtn.className = activeCategory === null ? 'btn btn-block bg-green-600 text-white' : 'btn btn-block';
    allBtn.onclick = () => {
      activeCategory = null;
      renderCategories();
      fetchTreesByCategory(null);
    };
    categoryList.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.textContent = cat.category_name;
      btn.className = activeCategory === cat.id ? 'btn btn-block bg-green-600 text-white' : 'btn btn-block';
      btn.onclick = () => {
        activeCategory = cat.id;
        renderCategories();
        fetchTreesByCategory(cat.id);
      };
      categoryList.appendChild(btn);
    });
  }

  // Render trees
  function renderTrees() {
    treeCards.innerHTML = '';
    if (!trees || trees.length === 0) {
      treeCards.innerHTML = '<div class="col-span-3 text-center">No trees found.</div>';
      return;
    }
    trees.forEach(tree => {
      const card = document.createElement('div');
      card.className = 'card bg-white shadow-lg p-4';
      card.innerHTML = `
        <img src="${tree.image}" alt="${tree.name}" class="w-full h-48 object-cover mb-4">
        <h3 class="font-bold text-lg">${tree.name}</h3>
        <p class="text-sm">${tree.description.substring(0, 100)}...</p>
        <p class="text-sm">Category: ${tree.category}</p>
        <div class="flex justify-between mt-4 mb-4">
          <button class="btn btn-sm btn-info bg-[#DCFCE7] rounded-3xl" onclick="openTreeModal(${tree.id})">Details</button>
          <p class="text-sm font-bold">$${tree.price}</p>
        </div>
        <button class="btn btn-sm bg-[#15803D] rounded-2xl text-white w-full" onclick="addToCart(${tree.id})">Add to Cart</button>
      `;
      treeCards.appendChild(card);
    });
  }

  // Cart functions
  function addToCart(id) {
    const tree = trees.find(t => t.id === id);
    cart.push(tree);
    renderCart();
    alert(`${tree.name} added to cart!`);
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
  }

  function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'flex justify-between items-center p-2 border-b';
      div.innerHTML = `<span>${item.name} - $${item.price}</span>
        <button class="btn btn-sm btn-error" onclick="removeFromCart(${i})"><i class="fa-solid fa-xmark"></i></button>`;
      cartItems.appendChild(div);
      total += item.price;
    });
    cartTotal.textContent = total;
  }

  // Modal
  function openTreeModal(id) {
    const tree = trees.find(t => t.id === id);
    modalTitle.textContent = tree.name;
    modalImage.src = tree.image;
    modalDescription.textContent = tree.description;
    modalCategory.textContent = `Category: ${tree.category}`;
    modalPrice.textContent = `Price: $${tree.price}`;
    treeModal.showModal();
  }

  // Initialize
  fetchCategories();
  fetchTreesByCategory(1);