const expEntero = /^([0-9])*$/

$('#FormularioSetProducts').submit(e => {
  e.preventDefault()
  let Data = {}

  Data.name = $('#nombre').val()
  Data.price = $('#precio').val()
  Data.stock = $('#stock').val()
  Data.category = $('#categoria').val()
  Data.imageSrc = $('#imageSrc').val()

  existe(Data)
})

const existe = Data => {
  // Validar que exista valor en cada input
  let camposFaltantes = ''
  Object.keys(Data).forEach(elemento => {
    if (Data[elemento] === '') {
      camposFaltantes += ` <li> ${elemento} </li> `
      $('#mensaje').html('Faltan los siguientes campos: ' + camposFaltantes)

    }
  })
  if (expEntero.test(Data.stock) && expEntero.test(Data.price)) {

    let datos = {
      data: {
        ...Data
      }
    }
    console.log(datos);

    $.post('https://vuvqioudotixkoy.form.io/productos/submission', datos)
    $('#ModalRespuesta').modal('show')
    
  } else {
    alert('Ingrese correctamente los datos solicitados');

  }
}
