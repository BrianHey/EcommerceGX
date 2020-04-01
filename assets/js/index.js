$(document).ready(function() {
  ShowTotal()
  // Llamado a la lista de productos
  getProducts()
    .then(res => {
      res.data ? renderProductList(res.data) : alert()
    })
    .catch(e => console.log(e))
})

// Funciones Lógicas para la lista de productos
const getProducts = async page => {
  let apiUrl = 'https://vuvqioudotixkoy.form.io/productos/submission?limit=4'
  if (page) {
    apiUrl = `${apiUrl}&skip=${page}`
    $('.anterior').css('display', 'block')
  } else {
    $('.anterior').css('display', 'none')
  }
  let response = await axios.get(apiUrl)
  return response
}

const renderProductList = productArray => {
  $('.product-list').html('')
  let arrayLength = productArray.length
  let pages = Math.ceil(arrayLength / 4)

  if (arrayLength <= 0) {
    $('.product-list').append(`
    <div class>
      <h1>Error</h1>
      <p>Su búsqueda no arrojó datos :(</p>
    </div>
  `)
  } else if (arrayLength <= 4) {
    productArray.forEach((entry, i) => {
      let product = entry.data
      let { name, price, stock, category, imageSrc } = product

      $('.product-list').append(createProductTemplate(name, price, stock, category, imageSrc, i))
    })
  } else {
    for (let i = 0; i <= 4; i++) {
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
  <h6 class="card-title titleOne"> <label class ="card-title">${name}</label> </h6>
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
//falta entonces que navegue entre las paginas

$('#search').keyup(function(){
  let productoTitle = $('.card-title');
  let buscando = $(this).val();
  let item='';
  for( let i = 0; i < productoTitle.length; i++ ){
      item = $(productoTitle[i]).html().toLowerCase();
       for(let x = 0; x < item.length; x++ ){
           if( buscando.length == 0 || item.indexOf( buscando ) > -1 ){
               $(productoTitle[i]).parents('.card-title').show(); 
           }else{
                $(productoTitle[i]).parents('.card-title').hide();
           }
       }
  }  
  })

// Fin de la logica para la busqueda general

//  Lógica para agregar productos al carrito

function addProduct(name, imageSrc, price, stock, category, cantProduct) {
  if (cantProduct > 0) {
    let detalleAlCarro = []
    if (!localStorage.getItem('carrito')) {
      detalleAlCarro.push({
        data: { name, price, stock, imageSrc, category, cantProduct: cantProduct },
      })

      localStorage.setItem('carrito', JSON.stringify(detalleAlCarro))
    } else {
      detalleAlCarro = JSON.parse(localStorage.getItem('carrito'))
      detalleAlCarro.push({
        data: { name, price, stock, imageSrc, category, cantProduct: cantProduct },
      })
      localStorage.setItem('carrito', JSON.stringify(detalleAlCarro))
    }

    alert('Producto Guardado en el carrito')
  } else {
    alert('Ingrese una cantidad lógica')
  }

  ShowTotal()
}

// function verificarProdYaSelected(name, imageSrc, price, stock, category, cantProduct, detalleAlCarro){
//   detalleAlCarro.forEach(element => {
//     if((name + imageSrc + price + stock + category) == (element.data.name + element.data.imageSrc + element.data.price + element.data.stock + element.data.category)){
//       Swal.fire({
//         showClass: {
//           popup: 'animated fadeInDown faster'
//         },
//         hideClass: {
//           popup: 'animated fadeOutUp faster'
//         },
//         title: 'Aviso, contenido del carrito',
//         text: `El producto seleccionado "${name}" ya tiene ${element.data.cantProduct} unidades en el carrito.`,
//         icon: 'warning',
//         showCancelButton: true,
//         cancelButtonText: 'Cancelar',
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Agregar'
//       }).then((result) => {
//         if (result.value) {
//           element.data.cantProduct = parseInt(element.data.cantProduct) + parseInt(cantProduct);
//           localStorage.setItem('carrito', JSON.stringify(detalleAlCarro))
//           alert('Producto Guardado en el carrito')
//         }





let page = 0

function despuesPage() {
  page += 4
  getProducts(page)
    .then(res => {
      renderProductList(res.data)

      if (res.data[res.data.length - 1].data.send) {
        $('.despues').css('display', 'none')
      }
    })
    .catch(e => {
      page -= 4
      $('.despues').css('display', 'none')
    })
}

function atrasPage() {
  if (page <= 0) {
  } else {
    page -= 4
    getProducts(page)
      .then(res => {
        renderProductList(res.data)
        $('.despues').css('display', 'block')
      })
      .catch(e => {
        $('.anterior').css('display', 'none')
      })
  }
}

const ShowTotal = () => {
  let localsito = JSON.parse(localStorage.getItem('carrito'))

  let total = 0
  localsito.forEach(p => {
    total += parseInt(p.data.price) * parseInt(p.data.cantProduct)
  })

  $('#total').html(total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'))
}
