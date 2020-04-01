$(window).on("load", function () {

  let positionFooter = function(){
    let footerTop = $('#footer').position().top + $('#footer').height();
    if (footerTop < $(window).height()) {
      $('#footer').css('margin-top', 0 + ($(window).height() - footerTop) + 'px');
    }
  }
  
  let detalleAlCarro = []; //lista de productos
  let listaProdApi = [];//informacion base para hacer PUT en API

  if (localStorage.carrito) {
    detalleAlCarro = JSON.parse(localStorage.getItem('carrito'));
  }

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }

  function removerProd() {
    $('[name="retirar"]').on("click", function (e) {
      let identi = $(this).attr("id");
      removerProd2(identi);
      // detalleAlCarro = detalleAlCarro.filter(function (element) {
      //   return `${element.data.idTemp}` != identi;
      // });
      // localStorage.setItem('carrito', JSON.stringify(detalleAlCarro))
      // cargarTabla();
    });
  }
  function removerProd2(idProd) {
    detalleAlCarro = detalleAlCarro.filter(function (element) {

      if(`${element.data.idTemp}` != idProd){
        return true;
      }else{
        if(element.data.cantidadProd > 1){
          element.data.cantidadProd --;
          return true;
        }else{
          return false;
        }
      }
      // return element.data.cantidadProd > 1? element.data.cantidadProd -- : `${element.data.idTemp}` != idProd;
      // return `${element.data.idTemp}` != idProd;
    });
    localStorage.setItem('carrito', JSON.stringify(detalleAlCarro))
    cargarTabla();
  }

  const ordenarArray = function (a, b) {
    var aName = a.data.name.toLowerCase();
    var bName = b.data.name.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
  }

  const cargarTabla = function () {
    $('#enviar').hide();
    listaProdApi = [];
    $("#table").html("");
    $("#contTotalSi").hide();
    $("#contTotalNo").show();
    $("#total").html("0");
    let contBodyTable = "";
    let total = 0;
    let i = 1;
    let cantidadMostrar = 1;
    
    detalleAlCarro.sort(ordenarArray);
    detalleAlCarro.forEach(element => {

      cantidadMostrar = element.data.cantProduct;
      console.log(element.data);
      
      if (contBodyTable === "") {
        $('#enviar').show();
        $("#contTotalSi").show();
        $("#contTotalNo").hide();
        contBodyTable += `<thead><tr><th>#</th><th>Descripción</th><th>Imagen</th><th>Val. Unit.</th><th>Cant.</th><th>Total</th><th></th></tr></thead><tbody>`;
      }

      contBodyTable += `
      <tr>
      <td class="">${i}</td>
      <td class="">${element.data.name}</td>
      <td class=""><img src="${element.data.imageSrc}" alt="thumb" class="imagenThumb"></td>
      <td class="numeros ">${formatNumber(element.data.price)}</td>
      <td class="numeros ">${cantidadMostrar}</td>
      <td class="numeros ">${formatNumber(parseInt(element.data.price) * parseInt(cantidadMostrar))}</td>
      <td><button type="button" class="btn btn-light botonEliminar" name="retirar" id="${element.data.name}${element.data.price}${element.data.stock}${element.data.category}${i}" >x</button></td></tr>`;

      let item = {
        _id: `${element.data.name}${element.data.price}${element.data.stock}${element.data.category}`,
        name: element.data.name,
        price: element.data.price,
        stock: `${cantidadMostrar}`,
        category: element.data.category,
        imageSrc: element.data.imageSrc,
        numProd: `${i}`
      };
      listaProdApi.push(item);
      element.data.idTemp = `${element.data.name}${element.data.price}${element.data.stock}${element.data.category}${i}`;
      element.data.cantidadProd = `${cantidadMostrar}`;
      i++;
      total += parseInt(element.data.price) * parseInt(cantidadMostrar);

    });

    contBodyTable += `</tbody>`;
    $("#table").html(contBodyTable);
    $("#total").html(`${formatNumber(total)}`);
    removerProd();
    positionFooter();
  };

  cargarTabla();


  $("#enviar").on("click", function () {
    //verificar stock de todos los productos
    const getProds = async () => {
      const Url = 'https://vuvqioudotixkoy.form.io/productos/submission'
      let listaProds = await axios.get(Url)
      verificarStock(listaProds);
    }
    getProds();
  });


  let verificarStock = function (allProds) {
    let stockOk = true;
    let prodEncontrado = false;
    for (let prod of listaProdApi) {
      allProds.data.forEach(element => {
        if (prod._id == `${element.data.name}${element.data.price}${element.data.stock}${element.data.category}`) {
          prodEncontrado = true;
          if (element.data.stock < prod.stock) {
            stockOk = false;
            //mensaje - retirar producto - recargar tabla
            Swal.fire(`Producto "${element.data.name}" no registra stock suficiente`);
            removerProd2(`${element.data.name}${element.data.price}${element.data.stock}${element.data.category}${prod.numProd}`)
          } else {
            prod._id = element._id;
            prod.cantBoleta = prod.stock;
            prod.stock = element.data.stock - prod.stock;
          }
        }
      });
    }
    if (prodEncontrado && stockOk) {
      modificarApi(listaProdApi);
    }
  }

  let modificarApi = function (listaCompra) {
    listaCompra.forEach(element => {
      try {
        let datosUpdate = {
          data: {
            name: element.name,
            price: element.price,
            stock: element.stock,
            category: element.category,
            imageSrc: element.imageSrc
          }
        }
        let upDateProd = async () => {
          const apiUrl = 'https://vuvqioudotixkoy.form.io/productos/submission/'
          let response = await axios.put(`${apiUrl}${element._id}`, datosUpdate)
          //console.log(response);
        }
        upDateProd();
      } catch (error) {
        console.log(error);
      }
    });
    //todoBien?
    imprimirBoleta(listaCompra);
  }

  let imprimirBoleta = function (listaCompra) {
    let pdf = new jsPDF();
    let fecha = new Date();
    pdf.text(5, 5, "Boleta Electrónica");
    pdf.text(5, 12, fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear());

    //GENERAR PDF
    let total = 0;
    let i = 1;
    let y = 30;
    let salto = 10;
    listaCompra.forEach(element => {

      let maxLength = 40;
      if (element.name.length > maxLength) {
        pdf.text(150, y, '  :   $' + formatNumber(parseInt(element.price) * parseInt(element.cantBoleta)));
        let ArrayNomArt = element.name.split(" ");
        let firsLine = true;
        let acumulado = "";
        for (let w = 0; w < ArrayNomArt.length; w++) {

          if ((acumulado + " " + ArrayNomArt[w]).length > maxLength) {
            if (firsLine) {
              pdf.text(10, y, i + '.- ' + ' ' + formatNumber(element.cantBoleta) + '  *  ' + acumulado);
              firsLine = false;
            } else {
              pdf.text(30, y, acumulado);
            }

            acumulado = ArrayNomArt[w];
            y = y + salto;
          } else {
            acumulado += " " + ArrayNomArt[w];
          }

        }
        if (acumulado != '') {
          pdf.text(30, y, acumulado);
          acumulado = "";
          y = y + salto;
        }

      } else {
        pdf.text(10, y, i + '.- ' + ' ' + formatNumber(element.cantBoleta) + '  *  ' + element.name);
        pdf.text(150, y, '  :   $' + formatNumber(parseInt(element.price) * parseInt(element.cantBoleta)));
        y = y + salto;
      }

      i++;
      total += parseInt(element.price) * parseInt(element.cantBoleta);
    });
    pdf.text(130, (y + 15), 'Total     ' + '  : $' + formatNumber(total));
    pdf.save("sample-file.pdf");
    localStorage.removeItem("carrito");
    $('#ModalRespuesta').modal('show');
  }
  positionFooter();

});
