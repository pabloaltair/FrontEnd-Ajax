// Función para registrar un club mediante AJAX con validación de campos y duplicados
$(document).ready(function() {
  // Maneja el evento submit del formulario
  $('#registerForm').on('submit', function(event) {
      event.preventDefault();  // Previene el envío tradicional del formulario
      registerClub();  // Llama a la función de registro
  });
});

// Función para registrar un club mediante AJAX
function registerClub() {
    const clubUsername = $('#registerClubUsername').val().trim();
    const email = $('#registerEmail').val().trim();
    const password = $('#registerPassword').val().trim();
    const confirmPassword = $('#registerConfirmPassword').val().trim();

    // Validación de campos vacíos
    if (!clubUsername || !email || !password || !confirmPassword) {
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

    // Comprobar nombre club y correo electrónico duplicados
    $.ajax({
        url: 'http://localhost:3000/clubs',
        type: 'GET',
        success: function(clubs) {
            const clubExists = clubs.some(c => c.clubUsername === clubUsername || c.email === email);

            if (clubExists) {
                $('#result').text('El nombre de club o correo electrónico ya están registrados. Por favor, elija otros.').css('color', 'red');
            } else {
                // Registrar nuevo club si no hay duplicados
                $.ajax({
                    url: 'http://localhost:3000/clubs',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ clubUsername, email, password }),
                    success: function(response) {
                        $('#result').text('Club registrado exitosamente. ID: ' + response.id).css('color', 'green');
                        $('#registerForm')[0].reset();
                    },
                    error: function(error) {
                        $('#result').text('Error al registrar el usuario.').css('color', 'red');
                    }
                });
            }
        },
        error: function(error) {
            $('#result').text('Error al verificar el club.').css('color', 'red');
        }
    });
}

  
$(document).ready(function() {
  // Asignar evento de submit para el formulario de inicio de sesión
  $('#loginForm').on('submit', function(event) {
      event.preventDefault(); // Previene el envío del formulario
      loginClub(); // Llama a la función de inicio de sesión
  });
});

// Función de inicio de sesión mediante AJAX
function loginClub() {
  const identifier = $('#loginClubUsername').val().trim();
  const password = $('#loginPassword').val().trim();

  if (!identifier || !password) {
      $('#result').text('Por favor, complete todos los campos.');
      return;
  }

  $.ajax({
      url: 'http://localhost:3000/clubs',
      type: 'GET',
      success: function(clubs) {
          // Busca el club en la lista de clubes
          const club = clubs.find(c => (c.clubUsername === identifier || c.email === identifier) && c.password === password);

          if (club) {
              $('#result').text(`Inicio de sesión exitoso. Bienvenido, ${club.clubUsername}!`).css('color', 'green');
              $('#loginForm')[0].reset();
          } else {
              $('#result').text('Nombre de club/correo o contraseña incorrectos.');
          }
      },
      error: function(error) {
          console.error('Error al intentar iniciar sesión:', error);
          $('#result').text('Error al intentar iniciar sesión.');
      }
  });
}

$(document).ready(function() {
  // Asignar evento de submit para el formulario de eliminación de club
  $('#deleteForm').on('submit', function(event) {
      event.preventDefault();  // Previene el envío tradicional del formulario
      deleteClub();  // Llama a la función de eliminación de club
  });
});

// Función para eliminar un club con confirmación
function deleteClub() {
    const identifier = $('#deleteClubUsername').val().trim();
    const password = $('#deletePassword').val().trim();
  
    if (!identifier || !password) {
        $('#result').text('Por favor, complete todos los campos.');
        return;
    }
  
    $.ajax({
        url: 'http://localhost:3000/clubs',
        type: 'GET',
        success: function(clubs) {
            // Busca el club que coincida con el nombre de club/correo y la contraseña
            const club = clubs.find(c => (c.clubUsername === identifier || c.email === identifier) && c.password === password);
  
            if (club) {
                // Mostrar un mensaje de confirmación con prompt
                const confirmation = prompt(`Para confirmar la baja, escriba: ${club.clubUsername}BORRAME`);
                
                // Verificar que el club haya ingresado correctamente la confirmación
                if (confirmation === `${club.clubUsername}BORRAME`) {
                    // Si se confirma, realizar la eliminación del club
                    $.ajax({
                        url: `http://localhost:3000/clubs/${club.id}`,
                        type: 'DELETE',
                        success: function() {
                            $('#result').text('Club eliminado exitosamente.').css('color', 'green');
                            $('#deleteForm')[0].reset();
                        },
                        error: function(error) {
                            console.error('Error al eliminar el club:', error);
                            $('#result').text('Error al eliminar el club.');
                        }
                    });
                } else {
                    $('#result').text('Confirmación incorrecta. La eliminación fue cancelada.');
                }
            } else {
                $('#result').text('Nombre de club/correo o contraseña incorrectos.');
            }
        },
        error: function(error) {
            console.error('Error al intentar eliminar el club:', error);
            $('#result').text('Error al intentar eliminar el club.');
        }
    });
  }
  
