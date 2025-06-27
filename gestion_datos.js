// Enhanced Data Management with Objects, Sets, and Maps in JavaScript

// Step 1: Product array with multiple categories using Sets
const productArray = [
  { id: 1, name: 'Gaming Laptop', price: 3500000, categories: new Set(['Technology', 'Gaming', 'Portable']) },
  { id: 2, name: 'Smartphone', price: 1800000, categories: new Set(['Phones', 'Technology']) },
  { id: 3, name: 'Mechanical Keyboard', price: 250000, categories: new Set(['Accessories', 'Gaming']) }
];

// Step 2: Convert the array into an object with dynamic keys
const products = {};
productArray.forEach((product, index) => {
  products[`product${index + 1}`] = product;
});

// Step 3: Validate product data before adding it to the Set
function isValidProduct(product) {
  return product.id && product.name && product.price && product.categories instanceof Set;
}

// Step 4: Create a Set to store unique products (by ID)
const productSet = new Set();
Object.values(products).forEach(product => {
  if (isValidProduct(product)) {
    if (productSet.has(product.id)) {
      console.warn(`Duplicate product ID found: ${product.id}`);
    } else {
      productSet.add(product.id);
    }
  } else {
    console.error('Product with incomplete data:', product);
  }
});

// Step 5: Create a Map to associate categories with product names
const categoryMap = new Map();
Object.values(products).forEach(product => {
  product.categories.forEach(category => {
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category).push(product.name);
  });
});

// Display the product list
function showProducts() {
  let html = '';
  for (const key in products) {
    if (products.hasOwnProperty(key)) {
      const p = products[key];
      html += `<b>${p.name}</b> (ID: ${p.id})<br>Price: $${p.price}<br>Categories: ${Array.from(p.categories).join(', ')}<hr>`;
    }
  }
  Swal.fire({
    title: '📋 Product List',
    html,
    width: 600,
    confirmButtonText: 'Close',
  });
}

// Display product table
function showProductTable() {
  let html = `<table style='width:100%;border-collapse:collapse;'>`;
  html += `<tr><th>ID</th><th>Name</th><th>Price</th><th>Categories</th></tr>`;
  Object.values(products).forEach(p => {
    html += `<tr><td>${p.id}</td><td>${p.name}</td><td>$${p.price}</td><td>${Array.from(p.categories).join(', ')}</td></tr>`;
  });
  html += `</table>`;
  Swal.fire({
    title: '📊 Product Table',
    html,
    width: 700,
    confirmButtonText: 'Close',
  });
}

// Display unique IDs from Set
function showUniqueIDs() {
  let html = '';
  for (const id of productSet) {
    html += `Product ID: <b>${id}</b><br>`;
  }
  Swal.fire({
    title: '📋 Unique IDs (Set)',
    html,
    width: 400,
    confirmButtonText: 'Close',
  });
}

// Display categories and associated products from Map
function showCategories() {
  let html = '';
  categoryMap.forEach((productNames, category) => {
    html += `<b>${category}</b>: ${productNames.join(', ')}<br>`;
  });
  Swal.fire({
    title: '📋 Categories and Products',
    html,
    width: 500,
    confirmButtonText: 'Close',
  });
}

// Display summary counts
function showSummary() {
  Swal.fire({
    title: '✅ Summary',
    html: `Total unique IDs: <b>${productSet.size}</b><br>Total categories: <b>${categoryMap.size}</b>` ,
    width: 400,
    confirmButtonText: 'Close',
  });
}

// Update productSet and categoryMap based on current products
function updateStructures() {
  productSet.clear();
  categoryMap.clear();
  Object.values(products).forEach(product => {
    if (isValidProduct(product)) {
      productSet.add(product.id);
      product.categories.forEach(category => {
        if (!categoryMap.has(category)) categoryMap.set(category, []);
        categoryMap.get(category).push(product.name);
      });
    }
  });
}

// Add Product to the list
function addProduct() {
  Swal.fire({
    title: 'Add New Product',
    html:
      `<input id="swal-input1" class="swal2-input" placeholder="Name">
       <input id="swal-input2" class="swal2-input" placeholder="Price" type="number" min="1">
       <input id="swal-input3" class="swal2-input" placeholder="Categories (comma separated)">`,
    focusConfirm: false,
    preConfirm: () => {
      const name = document.getElementById('swal-input1').value.trim();
      const price = parseInt(document.getElementById('swal-input2').value);
      const categories = document.getElementById('swal-input3').value.split(',').map(c => c.trim()).filter(Boolean);
      if (!name || !price || categories.length === 0) {
        Swal.showValidationMessage('All fields are required.');
        return false;
      }
      return { name, price, categories };
    }
  }).then(result => {
    if (result.isConfirmed && result.value) {
      const ids = Object.values(products).map(p => p.id);
      const newId = ids.length ? Math.max(...ids) + 1 : 1;
      products[`product${newId}`] = {
        id: newId,
        name: result.value.name,
        price: result.value.price,
        categories: new Set(result.value.categories)
      };
      updateStructures();
      Swal.fire('Product added!', '', 'success');
    }
  });
}

// Delete Product from the list
function deleteProduct() {
  const options = Object.values(products).map(p => ({ id: p.id, name: p.name }));
  if (options.length === 0) {
    Swal.fire('There are no products to delete.', '', 'info');
    return;
  }
  Swal.fire({
    title: 'Delete Product',
    input: 'select',
    inputOptions: options.reduce((acc, p) => { acc[p.id] = `${p.name} (ID: ${p.id})`; return acc; }, {}),
    inputPlaceholder: 'Select a product',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    inputValidator: value => !value && 'You must select a product.'
  }).then(result => {
  if (result.isConfirmed && result.value) {
    const selectedId = Number(result.value); // <-- conversión a número
    const key = Object.keys(products).find(k => products[k].id === selectedId);
    if (key) {
      delete products[key];
      updateStructures();
      Swal.fire('Product deleted!', '', 'success');
    }
  }
});

}

// Initialize structures on load
updateStructures();
