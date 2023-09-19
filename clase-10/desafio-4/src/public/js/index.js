const socket = io();
    // Escucha los eventos de Socket.io y actualiza la vista
    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar la recarga de la página
    
        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;

        // Enviar los datos a través de Socket.io
        socket.emit('add-product', { name, price });
    
        // Limpia los campos del formulario
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';
    });


    socket.on('add-product', ( { name, price }) => {
        // Agrega el nuevo producto a la vista
        const newItem = document.createElement('li');
        newItem.textContent = `${name} - $${price}`;
        productList.appendChild(newItem);
        alert(`${name} - $${price}`)
    });

socket.on('error-product', (data) =>
    alert(data)
);
