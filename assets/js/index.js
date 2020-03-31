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
    for (let entry of productArray) {
      let product = entry.data
      let { name, price, stock, category, imageSrc } = product

      $('.product-list').append(createProductTemplate(name, price, stock, category, imageSrc))
    }
  } else {
    for (let i = 0; i <= 10; i++) {
      let product = productArray[i].data
      let { name, price, stock, category, imageSrc } = product
      $('.product-list').append(createProductTemplate(name, price, stock, category, imageSrc))
    }
    $('.pagination').append(createPaginationTemplate(pages))
  }
}

const createProductTemplate = (name, price, stock, category, imageSrc) => {
  let template = `
  
  <div class="card col-lg-4 col-md-6 col-xs-10">
    <div class="card-body">
    <h6 class="card-title titleOne"><label class = "card-title">${name} </label></h6>
      <img src="${imageSrc}" class="card-img-top" alt="...">    
      <p class="card-text"> Valor: $ ${price}</p>      
      <p class="product__stock card-text"><strong>Stock:</strong> ${stock}</p>
      <p class="card-text category"><strong>Categoría:</strong> <a href="#">${category}</a></p>
      <button class="btn btn-success" onclick="addProduct('${name}','${imageSrc}','${price}','${stock}','${category}')">Agregar al carro</button>
    </div>
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
  $('#search').keyup(function(){
    let producto = $('.card-title');
    let buscando = $(this).val();
    let item='';
    for( let i = 0; i < producto.length; i++ ){
        item = $(producto[i]).html().toLowerCase();
         for(let x = 0; x < item.length; x++ ){
             if( buscando.length == 0 || item.indexOf( buscando ) > -1 ){
                 $(producto[i]).parents('.card-body').show(); 
             }else{
                  $(producto[i]).parents('.card-body').hide();
             }
         }
    }  
})
})

$('.btnCategory').click(function() {
  let valor = this.value
  let producto = $('.category');
  for( let i = 0; i < producto.length; i++ ){
    item = $(producto[i]).html().toLowerCase();
     for(let x = 0; x < item.length; x++ ){
         if( valor.length == 0 || item.indexOf( valor ) > -1 ){
             $(producto[i]).parents('.card-body').show(); 
         }else{
              $(producto[i]).parents('.card-body').hide();
         }
     }
}     
    
})

// Fin de la logica para la busqueda general

//  Lógica para agregar productos al carrito

function addProduct(name, imageSrc, price, stock, category) {
  console.log(localStorage.getItem('carrito'))
  let detalleAlCarro = []
  if (!localStorage.getItem('carrito')) {
    detalleAlCarro.push({
      data: { name, price, stock, imageSrc, category },
    })
    localStorage.setItem('carrito', JSON.stringify(detalleAlCarro))
  } else {
    detalleAlCarro = JSON.parse(localStorage.getItem('carrito'))
    detalleAlCarro.push({
      data: { name, price, stock, imageSrc, category },
    })
    localStorage.setItem('carrito', JSON.stringify(detalleAlCarro))
  }

  console.log(detalleAlCarro)


  alert('Producto Guardado en el carrito')
}

