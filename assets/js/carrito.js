$(window).on("load", function () {
  let detalleAlCarro = [];
//   localStorage.removeItem("carrito");

  let carrito = {
    data: [
      {
        name: 'Guitarra DEAN 350f',
        price: 350000,
        stock: 5,
        imageSrc: 'https://i.ebayimg.com/images/g/BX8AAOSwzvhd9BHN/s-l640.jpg',
        category: 'Music instruments'
      },
    ]
  };

  //para guardar:
  // localStorage.setItem("carrito", JSON.stringify(carrito));

  //para recuperar
 
    detalleAlCarro = JSON.parse(localStorage.getItem('carrito')).data;

  
  // detalleAlCarro = [
  //     {

  //     }
  // ];
  //ejemplo de detalleAlCarro:
  // detalleAlCarro = [
  //     {
  //         id_prod: 1,
  //         nombre: "Guitarra DEAN 350f Guitarra DEAN 350f Guitarra DEAN 350f Guitarra DEAN 350f",
  //         valor: 1000,
  //         cantidad: 2,
  //         categoria: "cat1",
  //         img: "https://i.ebayimg.com/images/g/BX8AAOSwzvhd9BHN/s-l640.jpg"
  //     },
  //     {
  //         id_prod: 10,
  //         nombre: "articulo2",
  //         valor: 500,
  //         cantidad: 15,
  //         categoria: "cat3",
  //         img: "https://i.ebayimg.com/images/g/BX8AAOSwzvhd9BHN/s-l640.jpg"
  //     },
  //     {
  //         id_prod: 7,
  //         nombre: "articulo3",
  //         valor: 100000,
  //         cantidad: 1,
  //         categoria: "cat2",
  //         img: "https://i.ebayimg.com/images/g/BX8AAOSwzvhd9BHN/s-l640.jpg"
  //     },
  //     {
  //         id_prod: 3,
  //         nombre: "articulo4",
  //         valor: 54000,
  //         cantidad: 1,
  //         categoria: "cat1",
  //         img: "https://i.ebayimg.com/images/g/BX8AAOSwzvhd9BHN/s-l640.jpg"
  //     }
  // ];

  function cargarEventoClick() {

    // $('button, [name="retirar"]').on("click", function () {

    //   let identi = $(this).attr("id");
    //   detalleAlCarro = detalleAlCarro.filter(function (element) {
    //     return `${element.data.name}${element.data.price}${element.data.stock}${element.data.category}` != identi;
    //   });
    //   cargarTabla();
    // });
  }

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }

  let respuesta = [];

  const cargarTabla = function () {
    $('#enviar').hide();
    respuesta = [];
    $("#table").html("");
    $("#total").html("0");
    let contBodyTable = "";
    let total = 0;

    let i = 1;

    detalleAlCarro = JSON.parse(localStorage.getItem('carrito'))

    console.log(detalleAlCarro);
    
    detalleAlCarro.forEach(element => {

      if (contBodyTable === "") {
        $('#enviar').show();
        contBodyTable += `<thead><tr><th>#</th><th>Descripción</th><th>Imagen</th><th>Val Unit</th><th>cantidadidad.</th><th>Total</th><th></th></tr></thead><tbody>`;
      }

      contBodyTable += `<tr><td>${i}</td><td>${element.data.name}</td><td><img src="${element.data.imageSrc}" alt="thumb" class="imagenThumb"></td><td class="numeros">${formatNumber(element.data.price)}</td><td class="numeros">${formatNumber(element.data.stock)}</td><td class="numeros">${formatNumber(parseInt(element.data.price) * parseInt(element.data.stock))}</td><td><button type="button" class="btn btn-primary" name="retirar" id="${element.data.name}${element.data.price}${element.data.stock}${element.data.category}">  X  </button></td>`;

      let item = {
        // id: element.data.id_prod,
        cantidadidadidad: element.stock
      };
      respuesta.push(item);

      contBodyTable += `</tr>`;
      i++;
      total += parseInt(element.data.price) * parseInt(element.data.stock);
    });

    contBodyTable += `</tbody>`;
    $("#table").html(contBodyTable);
    $("#total").html(`${formatNumber(total)}`);

    cargarEventoClick();


  };

  cargarTabla();



  $("#enviar").on("click", function () {
    // console.log("antes");
    let pdf = new jsPDF();

    let fecha = new Date();

    pdf.text(5, 5, "Boleta Electrónica -  LAVANDERIA JUANITO");
    pdf.text(5, 10, fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear());

    //GENERAR PDF
    let total = 0;
    let i = 1;
    let y = 30;
    let salto = 10;
    detalleAlCarro.forEach(element => {

      let maxLength = 40;
      if (element.data.name.length > maxLength) {
        pdf.text(150, y, '  :   $' + formatNumber(parseInt(element.data.price) * parseInt(element.data.stock)));
        let ArrayNomArt = element.data.name.split(" ");
        let firsLine = true;
        let acumulado = "";
        for (let w = 0; w < ArrayNomArt.length; w++) {

          if ((acumulado + " " + ArrayNomArt[w]).length > maxLength) {
            if (firsLine) {
              pdf.text(10, y, i + '.- ' + ' ' + formatNumber(element.data.stock) + '  *  ' + acumulado);
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
        // nombreArticulo = element.nombre;
        pdf.text(10, y, i + '.- ' + ' ' + formatNumber(element.data.stock) + '  *  ' + element.data.name);
        pdf.text(150, y, '  :   $' + formatNumber(parseInt(element.data.price) * parseInt(element.data.stock)));
        y = y + salto;
      }

      i++;
      total += parseInt(element.data.price) * parseInt(element.data.stock);
    });
    pdf.text(130, (y + 15), 'Total     ' + '  : $' + formatNumber(total));
    pdf.save("sample-file.pdf");
  });
});
