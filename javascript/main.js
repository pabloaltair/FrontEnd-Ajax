// Función para registrar un usuario mediante AJAX con validación de campos y duplicados
$(document).ready(function() {
  // Maneja el evento submit del formulario
  $('#registerForm').on('submit', function(event) {
      event.preventDefault();  // Previene el envío tradicional del formulario
      registerUser();  // Llama a la función de registro
  });
});

// Función para registrar un usuario mediante AJAX
// Función para registrar un usuario mediante AJAX
function registerUser() {
    const username = $('#registerUsername').val().trim();
    const email = $('#registerEmail').val().trim();
    const password = $('#registerPassword').val().trim();
    const confirmPassword = $('#registerConfirmPassword').val().trim();

    // Validación de campos vacíos
    if (!username || !email || !password || !confirmPassword) {
        $('#result').text('Por favor, complete todos los campos.');
        return;
    }

    // Validación de contraseña: longitud, mayúscula y símbolo
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{7,}$/;
    if (!passwordRegex.test(password)) {
        $('#result').text('El formato no es correcto. La contraseña necesita mínimo 7 caracteres, una mayúscula y un símbolo.').css('color', 'red');
        return;
    }

    // Verificar coincidencia de contraseñas
    if (password !== confirmPassword) {
        $('#result').text('Las contraseñas no coinciden.').css('color', 'red');
        return;
    }

    // Comprobar usuario y correo electrónico duplicados
    $.ajax({
        url: 'http://localhost:3000/users',
        type: 'GET',
        success: function(users) {
            const userExists = users.some(u => u.username === username || u.email === email);

            if (userExists) {
                $('#result').text('El nombre de usuario o correo electrónico ya están registrados. Por favor, elija otros.').css('color', 'red');
            } else {
                // Registrar nuevo usuario si no hay duplicados
                $.ajax({
                    url: 'http://localhost:3000/users',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ username, email, password }),
                    success: function(response) {
                        $('#result').text('Usuario registrado exitosamente. ID: ' + response.id).css('color', 'green');
                        $('#registerForm')[0].reset();
                    },
                    error: function(error) {
                        $('#result').text('Error al registrar el usuario.').css('color', 'red');
                    }
                });
            }
        },
        error: function(error) {
            $('#result').text('Error al verificar el usuario.').css('color', 'red');
        }
    });
}

  
$(document).ready(function() {
  // Asignar evento de submit para el formulario de inicio de sesión
  $('#loginForm').on('submit', function(event) {
      event.preventDefault(); // Previene el envío del formulario
      loginUser(); // Llama a la función de inicio de sesión
  });
});

// Función de inicio de sesión mediante AJAX
function loginUser() {
  const identifier = $('#loginUsername').val().trim();
  const password = $('#loginPassword').val().trim();

  if (!identifier || !password) {
      $('#result').text('Por favor, complete todos los campos.');
      return;
  }

  $.ajax({
      url: 'http://localhost:3000/users',
      type: 'GET',
      success: function(users) {
          // Busca el usuario en la lista de usuarios
          const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);

          if (user) {
              $('#result').text(`Inicio de sesión exitoso. Bienvenido, ${user.username}!`).css('color', 'green');
              $('#loginForm')[0].reset();
          } else {
              $('#result').text('Nombre de usuario/correo o contraseña incorrectos.');
          }
      },
      error: function(error) {
          console.error('Error al intentar iniciar sesión:', error);
          $('#result').text('Error al intentar iniciar sesión.');
      }
  });
}

$(document).ready(function() {
  // Asignar evento de submit para el formulario de eliminación de usuario
  $('#deleteForm').on('submit', function(event) {
      event.preventDefault();  // Previene el envío tradicional del formulario
      deleteUser();  // Llama a la función de eliminación de usuario
  });
});

// Función para eliminar un usuario con confirmación
// Función para eliminar un usuario con confirmación
function deleteUser() {
    const identifier = $('#deleteUsername').val().trim();
    const password = $('#deletePassword').val().trim();
  
    if (!identifier || !password) {
        $('#result').text('Por favor, complete todos los campos.');
        return;
    }
  
    $.ajax({
        url: 'http://localhost:3000/users',
        type: 'GET',
        success: function(users) {
            // Busca el usuario que coincida con el nombre de usuario/correo y la contraseña
            const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);
  
            if (user) {
                // Mostrar un mensaje de confirmación con prompt
                const confirmation = prompt(`Para confirmar la baja, escriba: ${user.username}BORRAME`);
                
                // Verificar que el usuario haya ingresado correctamente la confirmación
                if (confirmation === `${user.username}BORRAME`) {
                    // Si se confirma, realizar la eliminación del usuario
                    $.ajax({
                        url: `http://localhost:3000/users/${user.id}`,
                        type: 'DELETE',
                        success: function() {
                            $('#result').text('Usuario eliminado exitosamente.').css('color', 'green');
                            $('#deleteForm')[0].reset();
                        },
                        error: function(error) {
                            console.error('Error al eliminar el usuario:', error);
                            $('#result').text('Error al eliminar el usuario.');
                        }
                    });
                } else {
                    $('#result').text('Confirmación incorrecta. La eliminación fue cancelada.');
                }
            } else {
                $('#result').text('Nombre de usuario/correo o contraseña incorrectos.');
            }
        },
        error: function(error) {
            console.error('Error al intentar eliminar el usuario:', error);
            $('#result').text('Error al intentar eliminar el usuario.');
        }
    });
  }
  
