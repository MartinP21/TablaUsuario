fetch("http://localhost:3000/users")
    .then(response => response.json())
    .then(data => {
        const cabecero = document.querySelector("#cabecero");
        const filaCabecera = document.createElement("tr");
        const encabezados = ["ID", "Nombre", "Email", "Ciudad", "Telefono", "Accion"];

        encabezados.forEach(titulo => {
            const celdaCabecera = document.createElement("th");
            celdaCabecera.textContent = titulo;
            filaCabecera.appendChild(celdaCabecera);
        });
        cabecero.appendChild(filaCabecera);

        const tbody = document.querySelector("tbody");
        const template = document.querySelector("#productrow");

        const renderUsuario = (usuarios) => {
            tbody.textContent = "";
            usuarios.forEach(user => {
                const clone = template.content.cloneNode(true);

                //Boton eliminar
                const botonElim = document.createElement("button");
                botonElim.classList.add("btn", "btn-danger", "btn-sm");
                const iconoEliminar = document.createElement("i");
                iconoEliminar.classList.add("bi", "bi-x-circle");
                botonElim.appendChild(iconoEliminar);
                
                //Boton editar
                const botonEditar = document.createElement("button");
                botonEditar.classList.add("btn", "btn-primary", "btn-sm");
                const iconoEditar = document.createElement("i");
                iconoEditar.classList.add("bi", "bi-pencil-square");
                botonEditar.appendChild(iconoEditar);

                const td = clone.querySelectorAll("td");
                td[0].textContent = user.id;
                td[1].textContent = user.name;
                td[2].textContent = user.email;
                td[3].textContent = user.address;
                td[4].textContent = user.phone;
                td[5].appendChild(botonElim);
                td[5].appendChild(botonEditar);

                botonElim.onclick = () => eliminarUsuario(user.id);

                botonEditar.onclick = () => editarUsuario(user);

                tbody.appendChild(clone);
            });
        };

        renderUsuario(data);

        //Funcion para volver a pagina principal
        // Prevenir el envío del formulario al presionar "Volver"
        document.querySelector("#btnVolver").onclick = (event) => {
            event.preventDefault(); // Evita que el formulario se envíe
            window.location.href = "index.html"; // Redirige a la página principal (ajusta si el nombre es diferente)
        };

        //Funcion para eliminar usuario
        const eliminarUsuario = (id) => {
            fetch(`http://localhost:3000/users/${id}`, {
                method: "DELETE",
            })
        }

        //Funcion para editar usuario
        const editarUsuario = (usuario) => {
            const form = document.querySelector("#userForm");
            const modal = document.querySelector("#myModal");
            const btnGuardar = document.querySelector("#btnGuardar");
            const botonEditar = document.querySelector("#btnEditar");

            form.name.value = usuario.name;
            form.email.value = usuario.email;
            form.address.value = usuario.address;
            form.phone.value = usuario.phone;

            //Configurar visibilidad de botones
            btnGuardar.style.display = "none";
            botonEditar.style.display = "inline";

            //Configurar visibilidad de titulos
            document.querySelector("#titleAgregar").style.display = "none";
            document.querySelector("#titleEditar").style.display = "block";

            //Mostrar modal
            modal.style.display = "block";

            //Evento click para el boton editar
            botonEditar.onclick = () => {
                const formData = new FormData(form);

                //Crear nuevo objeto de usuarioActualizado
                const usuarioActualizado = {
                    name: formData.get("name"),
                    email: formData.get("email"),
                    address: formData.get("address"),
                    phone: formData.get("phone"),
                }

                //Uso de fetch para llamar el metodo y actualizar los cambios
                fetch(`http://localhost:3000/users/${usuario.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usuarioActualizado),
            })
                .then(respuesta => respuesta.json())
                .then(actualizado => {
                    alert("Usuario editado exitosamente");

                    // Actualiza el usuario en el array 'data' y vuelve a renderizar
                    const index = data.findIndex(user => user.id === usuario.id);
                    data[index] = actualizado;
                    renderUsuario(data);

                    // Cierra el modal
                    modal.style.display = "none";
                })
                .catch((error) => {
                    console.error("Error al editar usuario:", error);
                    alert("Error al editar usuario: " + error.message);
                });
            }
        }
        
        // Get the modal
        var modal = document.getElementById("myModal");

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks the button, open the modal 
        btn.onclick = function() {
            modal.style.display = "block";
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        const buscarInput = document.querySelector("#buscarInput");
        buscarInput.addEventListener("input", (e) => {
            const buscarText = e.target.value.toLowerCase();
            const filteredUsers = data.filter(user =>
                user.name.toLowerCase().includes(buscarText)
            );
            renderUsuario(filteredUsers);
        });

        btnGuardar.addEventListener("click", (e) => {
            e.preventDefault();
            
            const form = document.querySelector("#userForm");
            const formData = new FormData(form);

            //Validacion para que si se elimina un usuario no se agregue el mismo id a un nuevo usuario
              // Generar un nuevo ID único
            let nuevoId = data.length + 1; // Iniciar con el siguiente número secuencial
            while (data.some(user => user.id == nuevoId)) { // Validar si ya existe en el JSON
                nuevoId++; // Incrementar el ID hasta encontrar uno único
            }

            const nuevoUsuario = {
                id: nuevoId + '',
                name: formData.get("name"),
                email: formData.get("email"),
                address: formData.get("address"),
                phone: formData.get("phone"),
            };

            fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoUsuario),
            })
                .then(response => response.json())
                .then(usuario => {
                    alert("Usuario agregado exitosamente");
                    data.push(usuario);
                    modal.style.display = "none";
                })
                .catch((error) => console.error("Error al agregar usuario", error));
        });
    });

    

    //  // Evento para eliminar usuario
    //  botonElim.onclick = () => eliminarUsuario(user.id);

    //  // Evento para editar usuario
    //  botonEditar.onclick = () => editarUsuario(user);