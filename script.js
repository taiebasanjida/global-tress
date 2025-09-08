
 // Global variables
  let cart = [];
  let trees = [];
  let categories = [];
  let activeCategory = "all";

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
  function toggleSpinner(show){
    if(show){
      spinner.classList.remove('hidden');
      treeCards.classList.add('hidden');
    } else {
      spinner.classList.add('hidden');
      treeCards.classList.remove('hidden');
    }
  }

  // Fetch all trees
  async function fetchTrees(){
    try{
      toggleSpinner(true);
      const res = await fetch('https://openapi.programming-hero.com/api/plants');
      const data = await res.json();
      trees = data.plants;
      // Extract unique categories
      categories = [...new Set(trees.map(t => t.category))];
      renderCategories();
      renderTrees();
      toggleSpinner(false);
    } catch(e){
      console.error(e);
      toggleSpinner(false);
    }
  }

  // Render categories
  function renderCategories(){
    categoryList.innerHTML = '';
    // Add "All" button
    const allBtn = document.createElement('button');
    allBtn.textContent = "All";
    allBtn.className = activeCategory==="all" ? 'btn btn-block bg-green-600 text-white' : 'btn btn-block';
    allBtn.onclick = ()=>{
      activeCategory = "all";
      renderCategories();
      renderTrees();
    };
    categoryList.appendChild(allBtn);

    categories.forEach(cat=>{
      const btn = document.createElement('button');
      btn.textContent = cat;
      btn.className = activeCategory===cat ? 'btn btn-block bg-green-600 text-white' : 'btn btn-block';
      btn.onclick = ()=>{
        activeCategory = cat;
        renderCategories();
        renderTrees();
      };
      categoryList.appendChild(btn);
    });
  }

  // Render trees
  function renderTrees(){
    treeCards.innerHTML = '';
    let filteredTrees = activeCategory==="all" ? trees : trees.filter(t=>t.category===activeCategory);
    if(filteredTrees.length===0){
      treeCards.innerHTML = '<div class="col-span-3 text-center">No trees found.</div>';
      return;
    }
    filteredTrees.forEach(tree=>{
      const card = document.createElement('div');
      card.className = 'card bg-white shadow-lg p-4';
      card.innerHTML = `
        <img src="${tree.image}" alt="${tree.name}" class="w-full h-48 object-cover mb-4">
        <h3 class="font-bold text-lg">${tree.name}</h3>
        <p class="text-sm">${tree.description.substring(0,100)}...</p>
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
  function addToCart(id){
    const tree = trees.find(t=>t.id===id);
    if(tree){
      cart.push(tree);
      renderCart();
    }
  }

  function removeFromCart(index){
    cart.splice(index,1);
    renderCart();
  }

  function renderCart(){
    cartItems.innerHTML = '';
    let total=0;
    cart.forEach((item,i)=>{
      const div = document.createElement('div');
      div.className = 'flex justify-between items-center p-2 border-b';
      div.innerHTML = `<span>${item.name} - $${item.price}</span>
        <button class="btn btn-sm btn-error" onclick="removeFromCart(${i})"><i class="fa-solid fa-xmark"></i></button>`;
      cartItems.appendChild(div);
      total+=item.price;
    });
    cartTotal.textContent = total;
  }

  // Modal (fetch single plant details)
  async function openTreeModal(id){
    try{
      const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
      const data = await res.json();
      const tree = data.plant;
      modalTitle.textContent = tree.name;
      modalImage.src = tree.image;
      modalDescription.textContent = tree.description;
      modalCategory.textContent = `Category: ${tree.category}`;
      modalPrice.textContent = `Price: $${tree.price}`;
      treeModal.showModal();
    } catch(e){
      console.error(e);
    }
  }

  
  fetchTrees();