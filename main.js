var arrayUsuarios=[];
//******** MAPA ********
function initMap(latitud, longitud) {
	var mapDiv = $('#mapa');
	var map = new google.maps.Map(mapDiv[0], {
		center: {lat: latitud+1, lng: longitud-1.5},
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	});
	var marker = new google.maps.Marker({
		position: {lat: latitud, lng: longitud},
		map: map
	});
	return map;
}
//******** FILA ********
function fFila(usuario, valor){
	$("#tabla tbody").append(
		$('<tr>').append(
				$('<td>').html('<input type="checkbox" class="check" value="'+valor+'">')
			).append(
				$('<td>').text(usuario.nombre).click(function(){fMostrarUsuario(usuario);})
			).append(
				$('<td>').text(usuario.nUsuario)
			).append(
				$('<td>').text(usuario.email)
			).append(
				$('<td>').text(usuario.calle+", "+usuario.piso+", "+usuario.ciudad+","+usuario.cp)
			).append(
				$('<td>').text(usuario.tlfno)
			).append(
				$('<td>').text(usuario.web)
			).append(
				$('<td>').text(usuario.nombreCompania)
			).append(
				$('<td>').html("<input type='button' value='X' class='btn btn-warning'></input>").click(function(){fModificar(usuario);})
			).append(
				$('<td>').html("<input type='button' value='X' class='btn btn-danger'></input>").click(function(){fEliminar(usuario.id);})
			)
		);
}
//******** TABLA ********
function fTabla(){
	$("#divtabla").empty();
	$("#divtabla").append("<table id='tabla' class='table' data-page-length='3'>");
	$("table").append("<thead><tr><th><input type='checkbox' id='selectTodos'></th><th>NOMBRE</th><th>USUARIO</th><th>EMAIL</th><th>DIRECCION</th><th>TELEFONO</th><th>SITIO WEB</th><th>COMPAÑIA</th><th>MODIFICAR</th><th>ELIMINAR</th></tr></thead>");
	$("table").append("<tbody>");
	for(var i=0; i<arrayUsuarios.length; i++){		
		fFila(arrayUsuarios[i], i);
	}
	$('#tabla').dataTable({
		"order": [],
		"pagingType": "simple",
		"language": {
			"info": "Mostrando _START_ de _MAX_ usuarios",
			"paginate": {
				"previous": "Anterior",
				"next": "Siguiente"
			},
			"search": "Buscar:",
			"emptyTable": "No hay datos disponibles para mostrar en la tabla",
			"infoEmpty": "No existen entradas",
			"infoFiltered": "(filtrado de _MAX_ registros)",
			"lengthMenu": "Mostrar _MENU_"		
		},
		"lengthMenu": [[1, 2, 3, 4, 5, 6, 7, 8, 9,-1], [1, 2, 3, 4, 5, 6, 7, 8, 9,"Todos"]]
	});
}
//******** CREACION DE UN USUARIO ********
function fUsuario(){
	var user=new Object();
	user.id=$("#id").val();
	user.nombre=$("#nombre").val();
	user.nUsuario=$("#usuario").val();
	user.email=$("#email").val();
	user.calle=$("#calle").val();
	user.piso=$("#piso").val();
	user.ciudad=$("#ciudad").val();
	user.cp=$("#cp").val();
	user.lat=$("#lat").val();
	user.lng=$("#lng").val();
	user.tlfno=$("#tlfno").val();
	user.web=$("#web").val();
	user.nombreCompania=$("#nCompania").val();
	user.eslogan=$("#eslogan").val();
	user.cargos=$("#cargos").val();
	return user;
}
//******** INFO USUARIO ********
function fMostrarUsuario(usuario){
	var fuente = $('#pModalInfo').html();  
	var plantilla = Handlebars.compile(fuente); 
	$("#myModal .modal-body").append(plantilla(usuario));	
	$("#myModal").modal("show");
	var map = initMap(parseFloat(usuario.lat),parseFloat(usuario.lng));
	$('#myModal').on('hidden.bs.modal', function (e) {
		$("#myModal .modal-body").empty();
	});
	setTimeout(function(){
		google.maps.event.trigger(map, "resize");
	}, 500);
	/*$.get("file:///C:/Users/angela.arce/Documents/Listado%20Megapro++/plantillas/modalInfo.html", function(html){
		var plantilla = Handlebars.compile(html);
		$("#myModal .modal-body").append(plantilla(usuario));
		alert("hola");
	});*/
	
}
//******** AÑADIR USUARIO ********
function fAnadir(){
	$("#myModal2 .modal-header").text("AÑADIR DATOS DEL USUARIO");
	$("#myModal2 .modal-footer #cancelar").before("<input type='button' value='Añadir' class='btn btn-warning' id='ok'></input>");
	var fuente = $('#pModalModificar').html();  
	var plantilla = Handlebars.compile(fuente);	
	$("#myModal2 .modal-body").append(plantilla());
	$(":text").val("");
	$("#myModal2").modal("show");
	$("#ok").click(function(){			
			arrayUsuarios.push(fUsuario());
			fTabla();
			$(":text").val("");
			$("#myModal2").modal("hide");
	});
	$('#myModal2').on('hidden.bs.modal', function (e) {
		$("#myModal2 .modal-body").empty();
		$("#myModal2 #ok").remove();
	});
	$("#myModal2 .modal-body input").prop("disabled", false);
}
//******** ELIMINAR USUARIO ********
function fEliminar(id){
	arrayUsuarios=$.grep(arrayUsuarios, function(u){
		return u.id != id;
	});	
	fTabla();
}
//******** MODIFICAR USUARIO ********
function fModificar(usuario){
	var rex = new RegExp('applications', 'i');
	if(usuario.cargos.search(rex)!=-1){
		$("#myModal2 .modal-header").text("*********");
		$("#myModal2 .modal-body").text("EL USUARIO "+usuario.nombre+" NO SE PUEDE MODIFICAR");
		$('#myModal2').on('hidden.bs.modal', function (e) {
			$("#myModal2 .modal-body").empty();
			$("#myModal2 .modal-body").empty();
		});
		$("#myModal2").modal("show");
	}else{
		$("#myModal2 .modal-header").text("MODIFICAR DATOS DEL USUARIO");
		$("#myModal2 .modal-footer #cancelar").before("<input type='button' value='Modificar' class='btn btn-warning' id='modificar'></input>");
		var fuente = $('#pModalModificar').html();  
		var plantilla = Handlebars.compile(fuente); 
		$("#myModal2 .modal-body").append(plantilla(usuario));
		$("#myModal2").modal("show");
		$("#modificar").click(function(){
			for(var i=0; i<arrayUsuarios.length; i++){
				if(arrayUsuarios[i].id==$("#id").val()){
					arrayUsuarios[i]=fUsuario();
				}
			}
			fTabla();
			$(":text").val("");
			$("#myModal2").modal("hide");
		});
		$('#myModal2').on('hidden.bs.modal', function (e) {
			$("#myModal2 .modal-body").empty();
			$("#myModal2 #modificar").remove();
		});
	}
}
//******** ELIMINAR ELEMENTOS SELECCIONADOS ********
function fEliminarSeleccionados(){
	$("#myModal3").modal("show");
	$("#si").click(function(){	
		$('.check:checked').each(function() {
			fEliminar($(this).val());
		});
    });
}
//******** READY ********
$(document).ready(function() {
	$.getJSON("http://jsonplaceholder.typicode.com/users", function(data) {
		/*var data = [
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  },
  {
    "id": 2,
    "name": "Ervin Howell",
    "username": "Antonette",
    "email": "Shanna@melissa.tv",
    "address": {
      "street": "Victor Plains",
      "suite": "Suite 879",
      "city": "Wisokyburgh",
      "zipcode": "90566-7771",
      "geo": {
        "lat": "-43.9509",
        "lng": "-34.4618"
      }
    },
    "phone": "010-692-6593 x09125",
    "website": "anastasia.net",
    "company": {
      "name": "Deckow-Crist",
      "catchPhrase": "Proactive didactic contingency",
      "bs": "synergize scalable supply-chains"
    }
  },
  {
    "id": 3,
    "name": "Clementine Bauch",
    "username": "Samantha",
    "email": "Nathan@yesenia.net",
    "address": {
      "street": "Douglas Extension",
      "suite": "Suite 847",
      "city": "McKenziehaven",
      "zipcode": "59590-4157",
      "geo": {
        "lat": "-68.6102",
        "lng": "-47.0653"
      }
    },
    "phone": "1-463-123-4447",
    "website": "ramiro.info",
    "company": {
      "name": "Romaguera-Jacobson",
      "catchPhrase": "Face to face bifurcated interface",
      "bs": "e-enable strategic applications"
    }
  },
  {
    "id": 4,
    "name": "Patricia Lebsack",
    "username": "Karianne",
    "email": "Julianne.OConner@kory.org",
    "address": {
      "street": "Hoeger Mall",
      "suite": "Apt. 692",
      "city": "South Elvis",
      "zipcode": "53919-4257",
      "geo": {
        "lat": "29.4572",
        "lng": "-164.2990"
      }
    },
    "phone": "493-170-9623 x156",
    "website": "kale.biz",
    "company": {
      "name": "Robel-Corkery",
      "catchPhrase": "Multi-tiered zero tolerance productivity",
      "bs": "transition cutting-edge web services"
    }
  },
  {
    "id": 5,
    "name": "Chelsey Dietrich",
    "username": "Kamren",
    "email": "Lucio_Hettinger@annie.ca",
    "address": {
      "street": "Skiles Walks",
      "suite": "Suite 351",
      "city": "Roscoeview",
      "zipcode": "33263",
      "geo": {
        "lat": "-31.8129",
        "lng": "62.5342"
      }
    },
    "phone": "(254)954-1289",
    "website": "demarco.info",
    "company": {
      "name": "Keebler LLC",
      "catchPhrase": "User-centric fault-tolerant solution",
      "bs": "revolutionize end-to-end systems"
    }
  },
  {
    "id": 6,
    "name": "Mrs. Dennis Schulist",
    "username": "Leopoldo_Corkery",
    "email": "Karley_Dach@jasper.info",
    "address": {
      "street": "Norberto Crossing",
      "suite": "Apt. 950",
      "city": "South Christy",
      "zipcode": "23505-1337",
      "geo": {
        "lat": "-71.4197",
        "lng": "71.7478"
      }
    },
    "phone": "1-477-935-8478 x6430",
    "website": "ola.org",
    "company": {
      "name": "Considine-Lockman",
      "catchPhrase": "Synchronised bottom-line interface",
      "bs": "e-enable innovative applications"
    }
  },
  {
    "id": 7,
    "name": "Kurtis Weissnat",
    "username": "Elwyn.Skiles",
    "email": "Telly.Hoeger@billy.biz",
    "address": {
      "street": "Rex Trail",
      "suite": "Suite 280",
      "city": "Howemouth",
      "zipcode": "58804-1099",
      "geo": {
        "lat": "24.8918",
        "lng": "21.8984"
      }
    },
    "phone": "210.067.6132",
    "website": "elvis.io",
    "company": {
      "name": "Johns Group",
      "catchPhrase": "Configurable multimedia task-force",
      "bs": "generate enterprise e-tailers"
    }
  },
  {
    "id": 8,
    "name": "Nicholas Runolfsdottir V",
    "username": "Maxime_Nienow",
    "email": "Sherwood@rosamond.me",
    "address": {
      "street": "Ellsworth Summit",
      "suite": "Suite 729",
      "city": "Aliyaview",
      "zipcode": "45169",
      "geo": {
        "lat": "-14.3990",
        "lng": "-120.7677"
      }
    },
    "phone": "586.493.6943 x140",
    "website": "jacynthe.com",
    "company": {
      "name": "Abernathy Group",
      "catchPhrase": "Implemented secondary concept",
      "bs": "e-enable extensible e-tailers"
    }
  },
  {
    "id": 9,
    "name": "Glenna Reichert",
    "username": "Delphine",
    "email": "Chaim_McDermott@dana.io",
    "address": {
      "street": "Dayna Park",
      "suite": "Suite 449",
      "city": "Bartholomebury",
      "zipcode": "76495-3109",
      "geo": {
        "lat": "24.6463",
        "lng": "-168.8889"
      }
    },
    "phone": "(775)976-6794 x41206",
    "website": "conrad.com",
    "company": {
      "name": "Yost and Sons",
      "catchPhrase": "Switchable contextually-based project",
      "bs": "aggregate real-time technologies"
    }
  },
  {
    "id": 10,
    "name": "Clementina DuBuque",
    "username": "Moriah.Stanton",
    "email": "Rey.Padberg@karina.biz",
    "address": {
      "street": "Kattie Turnpike",
      "suite": "Suite 198",
      "city": "Lebsackbury",
      "zipcode": "31428-2261",
      "geo": {
        "lat": "-38.2386",
        "lng": "57.2232"
      }
    },
    "phone": "024-648-3804",
    "website": "ambrose.net",
    "company": {
      "name": "Hoeger LLC",
      "catchPhrase": "Centralized empowering task-force",
      "bs": "target end-to-end models"
    }
  }
];*/
	
		$.each(data, function(i,item) {
			var user=new Object();
			user.id=item.id;
			user.nombre=item.name;
			user.nUsuario=item.username;
			user.email=item.email;
			user.calle=item.address.street;
			user.piso=item.address.suite;
			user.ciudad=item.address.city;
			user.cp=item.address.zipcode;
			user.lat=item.address.geo.lat;
			user.lng=item.address.geo.lng;
			user.tlfno=item.phone;
			user.web=item.website;
			user.nombreCompania=item.company.name;
			user.eslogan=item.company.catchPhrase;
			user.cargos=item.company.bs;
			arrayUsuarios.push(user);
		});
		fTabla();
		
	});
	$("#anadir").click(function(){fAnadir();});
	$("#deleteAll").click(function(){fEliminarSeleccionados();});
	
	//selecionar todos
	$(document).on("change", "#selectTodos", function() {
		if($("#selectTodos").is(':checked')){
			var reg=$("select[name='tabla_length']").val();
			if (reg==-1){
				$("input[type='checkbox']").prop("checked", true);
			}else{
				$(".check").each(function(){
					if(parseInt($(this).val())<reg){
						$(this).prop("checked", true);
					}
				});
			}
		}else{
			$("input[type='checkbox']").prop("checked", false);
		}
	});
});