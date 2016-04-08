var arrayUsuarios=[];
//funcion para añadir una fila
function fFila(usuario){
	$("#tabla tbody").append(
		$('<tr>').append(
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
//funcion para la creacion de la tabla
function fTabla(){
	$("#divtabla").empty();
	$("#divtabla").append("<table id='tabla' class='table'>");
	$("table").append("<thead><tr><th>NOMBRE</th><th>USUARIO</th><th>EMAIL</th><th>DIRECCION</th><th>TELEFONO</th><th>SITIO WEB</th><th>COMPAÑIA</th><th>MODIFICAR</th><th>ELIMINAR</th></tr></thead>");
	$("table").append("<tbody>");
	for(var i=0; i<arrayUsuarios.length; i++){		
		fFila(arrayUsuarios[i]);
	}
}
//funcion para mostrar datos usuario
function fMostrarUsuario(usuario){
	var fuente = $('#pModalInfo').html();  
	var plantilla = Handlebars.compile(fuente); 
	$("#myModal .modal-body").append(plantilla(usuario));
	
	/*var mapDiv = $('#mapa');
	var map = new google.maps.Map(mapDiv, {
		center: {lat: parseFloat(usuario.lat), lng: parseFloat(usuario.lng)},
		zoom: 17
	});
	var marker = new google.maps.Marker({
		position: {lat: parseFloat(usuario.lat), lng: parseFloat(usuario.lng)},
		map: map
	});*/
	
	$("#myModal").modal("show");
	
	$('#myModal').on('hidden.bs.modal', function (e) {
		$("#myModal .modal-body").empty();
	});
	/*$.ajax({
        type: "GET",
        url: "../plantillas/modalInfo",
		success: function(html){
            var plantilla = Handlebars.compile(html);
			$("#myModal .modal-body").append(plantilla(usuario));
			alert("hola");
		}
	});*/
}
//funcion para eliminar
function fEliminar(id){
	arrayUsuarios=$.grep(arrayUsuarios, function(u){
		return u.id != id;
	});	
	fTabla();
}
//funcion para modificar
function fModificar(usuario){
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
//funcion para añadir
function fAnadir(usuario){
	$("#myModal2 .modal-header").text("AÑADIR DATOS DEL USUARIO");
	$("#myModal2 .modal-footer #cancelar").before("<input type='button' value='Añadir' class='btn btn-warning' id='ok'></input>");
	var fuente = $('#pModalModificar').html();  
	var plantilla = Handlebars.compile(fuente); 
	$("#myModal2 .modal-body").append(plantilla(usuario));
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
}
//funcion nuevo usuario
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
//
$(document).ready(function() {
	$.getJSON("http://jsonplaceholder.typicode.com/users", function(data) {
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
			user.lat=item.address.lat;
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
	var user=new Object();
	$("#anadir").click(function(user){fAnadir();});
});