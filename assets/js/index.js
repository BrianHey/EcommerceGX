$(document).ready(function() {
  //ShowTotal()
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
    if(page){
      console.log(page)
      apiUrl = `${apiUrl}&skip=${page}`
      $('.anterior').css('display', 'block')
  }
    else {
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
      <p class="card-text category"><strong>Categoría:</strong>  ${i} <a href="#">${category}</a></p>

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
 
$('#search').keypress(function(event){
  let keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    $('.product-list').html('');
    $.ajax({
           url: `https://vuvqioudotixkoy.form.io/productos/submission`,
           success: function(data){
            for (i in data){
              $('.product-list').append(`
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title titleOne" id="aqui"><label class="card-title">${data[i].data.name} </label></h5>
                <div id="cuerpo">
                  <img src="${data[i].data.imageSrc}" class="card-img-top" alt="...">
                  <p class="card-text"><label id = "price" value="${data[i].data.price}"> Valor: $${data[i].data.price}</label></p>
                  <p class="card-text"> Stock: ${data[i].data.stock}</p>
                 <p class="card-text"> Categoria: ${data[i].data.category}</p>

                 <p class="card-text"><strong>Cantidad:</strong> <input type="number" class="id-${i}" value="1" id="cantProducts">

                <button class="btn btn-success" onclick="addProduct('${data[i].data.name}','${data[i].data.imageSrc}','${data[i].data.price}','${data[i].data.stock}',' ${data[i].data.category}', $('.id-${i}').val())">Agregar al carro</button>
                </div>
              </div>
          </div>
            `)
            }
       }
       
      
  }).done(
    function() {
      let producto = $('.card-title');
      let buscando = document.getElementById('search').value
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
     }
   )
  }
})


$('.btnCategory').click(function() {
  let valor = this.value
  $('.product-list').html('');
    $.ajax({
           url: `https://vuvqioudotixkoy.form.io/productos/submission`,
           success: function(data){
            for (i in data){
              $('.product-list').append(`
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title titleOne" id="aqui"><label class="card-title">${data[i].data.name} </label></h5>
                <div id="cuerpo">
                  <img src="${data[i].data.imageSrc}" class="card-img-top" alt="...">
                  <p class="card-text"><label id = "price" value="${data[i].data.price}"> Valor: $${data[i].data.price}</label></p>
                  <p class="card-text"> Stock: ${data[i].data.stock}</p>
                 <p class="card-text category"> Categoria: ${data[i].data.category}</p>

                 <p class="card-text"><strong>Cantidad:</strong> <input type="number" class="id-${i}" value="1" id="cantProducts">

                <button class="btn btn-success" onclick="addProduct('${data[i].data.name}','${data[i].data.imageSrc}','${data[i].data.price}','${data[i].data.stock}',' ${data[i].data.category}', $('.id-${i}').val())">Agregar al carro</button>
                </div>
              </div>
          </div>
            `)
            }
       }  
  }).done(function(){
    
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

