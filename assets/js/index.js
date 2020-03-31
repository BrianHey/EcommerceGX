$(document).ready(function() {
  // Llamado a la lista de productos
  getProducts()
    .then(res => renderProductList(res.data))
    .catch(e => console.log(e))
})

// Funciones Lógicas para la lista de productos
const getProducts = async () => {
  const apiUrl = 'https://vuvqioudotixkoy.form.io/productos/submission'
  let response = await axios.get(apiUrl)
  return response
}

const renderProductList = productArray => {
  let arrayLength = productArray.length
  let pages = Math.ceil(arrayLength / 10)

  if (arrayLength <= 0) {
    $('.product-list').append(`
    <div class>
      <h1>Error</h1>
      <p>Su búsqueda no arrojó datos :(</p>
    </div>
  `)
  } else if (arrayLength <= 10) {
    productArray.forEach((entry, i) => {
      let product = entry.data
      let { name, price, stock, category, imageSrc } = product

      $('.product-list').append(createProductTemplate(name, price, stock, category, imageSrc, i))
    })
  } else {
    for (let i = 0; i <= 10; i++) {
      let product = productArray[i].data
      let { name, price, stock, category, imageSrc } = product
      $('.product-list').append(createProductTemplate(name, price, stock, category, imageSrc, i))
    }
    $('.pagination').append(createPaginationTemplate(pages))
  }
}

const createProductTemplate = (name, price, stock, category, imageSrc, i) => {
  let template = `
  
  <div class="card col-3 my-2 py-3">
  <h6 class="card-title titleOne">${name} </h6>
    <div id="imagenesCards" style="background-image: url(${imageSrc})" ></div>  
    <p class="card-text"> Valor: $ ${price}</p>      
    <p class="product__stock card-text"><strong>Stock:</strong> ${stock}</p>
    <p class="card-text"><strong>Categoría:</strong>  ${i} <a href="#">${category}</a></p>

    <p class="card-text"><strong>Cantidad:</strong> <input type="number" class="id-${i}" value="1" id="cantProducts">

    <button class="btn btn-success" onclick="addProduct('${name}','${imageSrc}','${price}','${stock}','${category}', $('.id-${i}').val())">Agregar al carro</button>
  </div>
  
`
  return template
}

const createPaginationTemplate = pages => {
  let prevButton = `<li class="page-item"><a class="page-link" href="#">Previous</a></li>`
  let nextButton = `<li class="page-item"><a class="page-link" href="#">Next</a></li>`
  let pageButtons = ''
  for (let i = 1; i <= pages; i++) {
    pageButtons += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
  }
  let template = prevButton + pageButtons + nextButton
  return template
}

//  Fin de las funciones para la lista de productos

// Lógica para la busqueda general

$('#search').on('keyup', function() {
  let value = $(this)
    .val()
    .toLowerCase()
  $('.row div').filter(function(i) {
    $(this).toggle(
      $(this)
        .text()
        .toLowerCase()
        .indexOf(value) > -1
    )
  })
})

// Fin de la logica para la busqueda general

//  Lógica para agregar productos al carrito

function addProduct(name, imageSrc, price, stock, category, cantProduct) {
  console.log(cantProduct)

  if (cantProduct > 0) {
    let detalleAlCarro = []
    if (!localStorage.getItem('carrito')) {
      detalleAlCarro.push({
        data: { name, price, stock, imageSrc, category, cantProduct: cantProduct },
      })
      
      localStorage.setItem('carrito', JSON.stringify(detalleAlCarro))
      alert('Producto Guardado en el carrito')
    } else {
      detalleAlCarro = JSON.parse(localStorage.getItem('carrito'))
      verificarProdYaSelected(name, imageSrc, price, stock, category, cantProduct, detalleAlCarro);
    }
    console.log(detalleAlCarro)
  }else{
    alert('Ingrese una cantidad lógica')
  }
}

function verificarProdYaSelected(name, imageSrc, price, stock, category, cantProduct, detalleAlCarro){
  detalleAlCarro.forEach(element => {
    if((name + imageSrc + price + stock + category) == (element.data.name + element.data.imageSrc + element.data.price + element.data.stock + element.data.category)){
      Swal.fire({
        title: 'Aviso, contenido del carrito',
        text: `El producto seleccionado "${name}" ya tiene ${element.data.cantProduct} unidades en el carrito.`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Agregar'
      }).then((result) => {
        if (result.value) {
          element.data.cantProduct = parseInt(element.data.cantProduct) + parseInt(cantProduct);
          localStorage.setItem('carrito', JSON.stringify(detalleAlCarro))
          alert('Producto Guardado en el carrito')
        }
      })
    }
  });
}
