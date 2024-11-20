import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translations: {
          "English" : "English",
          "Spanish" : "Spanish",
          "Welcome" : "Welcome",
          "Finding latest products..." : "Finding latest products...",
          "Your Account" : "Your Account",
          "guest" : "guest",
          "Account" : "Account",
          "Administer" : "Administer",
          "Back to Site" : "Back to Site",
          "Log In" : "Log In",
          "Log Out" : "Log Out",
          "Email is required" : "Email is required",
          "Password is required" : "Password is required",
          "Password" : "Password",
          "Forgot your password" : "Forgot your password",
          "Email or password is incorrect. Please try again" : "Email or password is incorrect. Please try again",
          "Send a Reset" : "Send a Reset",
          "No account? Register here!" : "No account? Register here!",
          "Passwords do not match! Please try again.": "Passwords do not match! Please try again.",
          "Password cannot be blank! Please try again." : "Password cannot be blank! Please try again.",
          "Confirm Password cannot be blank! Please try again." : "Confirm Password cannot be blank! Please try again.",
          "Please provide your name." : "Please provide your name.",
          "Please provide your email." : "Please provide your email.",
          "Name" : "Name",
          "Confirm Password" : "Confirm Password",
          "Register" : "Register",
          "Back to Log In": "Back to Log In",
          "You do not have permission to view this page" : "You do not have permission to view this page",
          "ID" : "ID",
          "Loading... please wait" : "Loading... please wait",
          "Please log in to view this page" : "Please log in to view this page",
          "Update Your Account" : "Update Your Account",
          "Update" : "Update",
          "Email" : "Email",
          "Phone" : "Phone",
          "Socials": "Socials",
          "Information": "Information",
          "Legal": "Legal",
          "Privacy Policy": "Privacy Policy",
          "Terms of Use": "Terms of Use",
          "Created by" : "Created by",
          "Site Administration" : "Site Administration" ,
          "Your Content" : "Your Content",
          "Home" : "Home",
          "Account" : "Account",
          "Log Out" : "Log Out",
          "Administer" : "Administer",
          "Add" : "Add",
          "title" : "Title",
          "description" : "Description",
          "Add Content" : "Add Content",
          "Edit Content" : "Edit Content",
          "Edit" : "Edit",
          "Update Content" : "Update Content",
          "Delete Content" : "Delete Content",
          "Deleting content failed. Please try again." : "Deleting content failed. Please try again.",
          "Finding latest content..." : "Finding latest content...",
          "Search..." : "Search...",
          "Register a New Account" : "Register a New Account",
          "Edit" : "Edit",
          "Select a country" : "Select a country",
          "Colombia" : "Colombia",
          "Mexico" : "Mexico",
          "Peru" : "Peru",
          "Argentina" : "Argentina",
          "Spain" : "Spain",
          "Chile" : "Chile",
          "Ecuador" : "Ecuador",
          "Paraguay" : "Paraguay",
          "Uruguay" : "Uruguay",
          "Venezuela" : "Venezuela",
          "Bolivia" : "Bolivia",
          "Costa Rica" : "Costa Rica",
          "Cuba" : "Cuba",
          "Dominican Republic" : "Dominican Republic",
          "Equatorial Guinea" : "Equatorial Guinea",
          "Guatemala" : "Guatemala",
          "Honduras" : "Honduras",
          "Nicaragua" : "Nicaragua",
          "Panama" : "Panama",
          "Puerto Rico" : "Puerto Rico",
          "El Salvador" : "El Salvador",
          "Hint" : "Hint",
          "Example sentence" : "Example sentence",
          "Your Flashcards" : "Your Flashcards",
          "Flashcards" : "Flashcards",
          "Added to flashcards successfully!" : "Added to flashcards successfully!",
          "Failed to add to flashcards. Please try again." : "Failed to add to flashcards. Please try again.",
          "Add to Flashcards" : "Add to Flashcards",
          "Next" : "Next",
          "of" : "of",
          "Flashcard" : "Flashcard",
          "You don't have any flashcards yet." : "You don't have any flashcards yet.",
          "Created with" : "Created with",
          "No account? Register here!" : "No account? Register here!",
          "Login failed. Please try again." : "Login failed. Please try again.",
          "Email" : "Email",
          "Password" : "Password",
          "Log in" : "Log in",
          "Please select a country" : "Please select a country",
          "Logged in successfully!" : "Logged in successfully!",
          "Show hint" : "Show hint",
          "Please enter a title." : "Please enter a title.",
          "Please enter a description." : "Please enter a description.",
          "Please select a country." : "Please select a country.",
          "Title" : "Title",
          "Description" : "Description",
          "Hint" : "Hint",
          "Example sentence" : "Example sentence",
          "Current Streak" : "Current Streak",
          "Longest Streak" : "Longest Streak",  
          "No streak recorded. Start a streak today!" : "No streak recorded. Start a streak today!",
          "No current streak. Start a streak today!" : "No current streak. Start a streak today!",
          "{{count}} day(s)" : "{{count}} day(s)",
          "Again": "Again",
          "Hard": "Hard",
          "Good": "Good",
          "Easy": "Easy",
          "Streak updated to {{streak}}!" : "Streak updated to {{streak}}!",
          "You've completed all your flashcards for today. Please come back tomorrow.": "You've completed all your flashcards for today. Please come back tomorrow.",
          "No hint provided": "No hint provided",
          "Streak started! Current streak: {{streak}}": "Streak started! Current streak: {{streak}}",
          "Streak extended! Current streak: {{streak}}": "Streak extended! Current streak: {{streak}}",
          "Feedback" : "Feedback",
          "Submit" : "Submit",
          "Message" : "Message",
          "Logged out successfully!" : "Logged out successfully!",  
          "Feedback submitted successfully!" : "Feedback submitted successfully!",
          "Feedback submission failed. Please try again." : "Feedback submission failed. Please try again.",
          "Streak updated! Current streak: {{streak}}": "Streak updated! Current streak: {{streak}}",
          "You've completed all your flashcards for today. Please come back tomorrow.": "You've completed all your flashcards for today. Please come back tomorrow.",
          "Author" : "Author",
          "Please enter an author." : "Please enter an author.",
          "created by": "created by",
          "Loading..." : "Loading...",
          "Entry Details" : "Entry Details",
          "Add a comment" : "Add a comment",
          "Add a comment..." : "Add a comment...",
          "Failed to add comment" : "Failed to add comment",
          "Comment added successfully!" : "Comment added successfully!",
          "Comments" : "Comments",
          "Show Comments" : "Show Comments",
          "Vote recorded successfully!" : "Vote recorded successfully!",
          "Failed to record vote. Please try again." : "Failed to record vote. Please try again.",
          "Vote already recorded for this user on this content." : "Vote already recorded for this user on this content.",
          "Please log in to vote" : "Please log in to vote",
          "Add Tag" : "Add Tag",
          "name" : "name",
          "Please log in to add tags": "Please log in to add tags",
          "Please enter a name." : "Please enter a name.",
          "Added successfully" : "Added successfully",
          "Add Feedback" : "Add Feedback",
          "Please log in to add a tag" : "Please log in to add a tag",
          "tag" : "tag",
          "Select countries..." : "Select countries...",
          "+ Add Tag" : "+ Add Tag",
          "Select tags..." : "Select tags...",
          "No results found. Please try another search." : "No results found. Please try another search.",
          "Registration successful!" : "Registration successful!",
          "Registration failed. Please try again." : "Registration failed. Please try again.",
          "Password must be at least 8 characters long." : "Password must be at least 8 characters long.",
          "Password cannot be blank." : "Password cannot be blank.",
          "Password or username is incorrect" : "Password or username is incorrect",
        }
      },
      es: {
        translations: {
          "English" : "Inglés",
          "Spanish" : "Español",
          "Welcome" : "Bienvenido",
          "Register a New Account" : "Registre una Nueva Cuenta",
          "Your Account" : "Su Cuenta",
          "guest" : "invitado",
          "Account" : "Cuenta",
          "Administer" : "Administrar",
          "Back to Site" : "Volver a Sitio",
          "Log In" : "Iniciar Sesión",
          "Log Out" : "Cerrar Sesión",
          "Subtotal" : "Total Parcial",
          "Total" : "Total",
          "First Name" : "Nombre de Pila",
          "Last Name" : "Apellido",
          "Email is required" : "Correo electronico es requerido",
          "Password is required" : "Contraseña es requerido",
          "Password" : "Contraseña",
          "Log in" : "Iniciar sesión",
          "Forgot your password" : "Olvidó su contraseña",
          "Email or password is incorrect. Please try again" : "El correo electrónico o contraseña son incorrectos. Vuelva a intentarlo",
          "Send a Reset" : "Enviar un reinicio",
          "No account? Register here!" : "¿No tiene cuenta? ¡Regístrate aquí!",
          "Passwords do not match! Please try again." : "Contraseñas no coinciden! Vuelva a intentarlo",
          "Password cannot be blank! Please try again." : "Contraseña no puede ser vacio! Inténtalo de nuevo.",
          "Confirm Password cannot be blank! Please try again." : "¡Confirmar Contraseña no puede ser vacio! Inténtalo de nuevo.",
          "Please provide your name." : "Por favor proporcione su nombre.",
          "Please provide your email." : "Por favor proporcione su correo electrónico.",
          "Name" : "Nombre", 
          "Confirm Password" : "Confirmar Contraseña",
          "Register" : "Registrarse",
          "Back to Log In": "Volver a Iniciar Sesión",
          "You do not have permission to view this page" : "No tiene permiso para ver esta página",
          "Loading... please wait" : "Cargando... espere por favor",
          "Please log in to view this page" : "Inicie sesión para ver esta página",
          "Update Your Account" : "Actualizar Cuenta",
          "Update" : "Actualizar",
          "Email" : "Email",
          "Phone" : "Teléfono",
          "Socials": "Socials",
          "Information": "Información",
          "Shipping": "Envío",
          "Returns": "Devoluciones",
          "Legal": "Legal",
          "Privacy Policy": "Política de Privacidad",
          "Terms of Use": "Términos de Uso",
          "Created by" : "Creado por",
          "Site Administration" : "Administración del sitio",
          "Your Content" : "Su Contenido",
          "Home" : "Inicio",
          "Account" : "Cuenta",
          "Log Out" : "Cerrar Sesión",
          "Administer" : "Administrar",
          "Add" : "Agregar",
          "Add Content" : "Agregar Contenido",
          "title" : "Título",
          "description" : "Descripción",
          "Edit Content" : "Editar Contenido",
          "Edit" : "Editar",
          "Update Content" : "Actualizar Contenido",
          "Delete Content" : "Eliminar Contenido",
          "Deleting content failed. Please try again." : "Eliminación de contenido fallida. Inténtalo de nuevo.",
          "Finding latest content..." : "Buscando contenido reciente...",
          "Search..." : "Buscar...",
          "Register a New Account" : "Registrar una nueva cuenta",
          "Edit" : "Editar",
          "Select a country" : "Selecciona un país",
          "Colombia" : "Colombia",
          "Mexico" : "México",
          "Peru" : "Perú",
          "Argentina" : "Argentina",
          "Spain" : "España",
          "Chile" : "Chile",
          "Ecuador" : "Ecuador",
          "Paraguay" : "Paraguay",
          "Uruguay" : "Uruguay",
          "Venezuela" : "Venezuela",
          "Bolivia" : "Bolivia",
          "Costa Rica" : "Costa Rica",
          "Cuba" : "Cuba",
          "Dominican Republic" : "República Dominicana",
          "Equatorial Guinea" : "Guinea Ecuatorial",
          "Guatemala" : "Guatemala",
          "Honduras" : "Honduras",
          "Nicaragua" : "Nicaragua",
          "Panama" : "Panamá",
          "Puerto Rico" : "Puerto Rico",
          "Select a country" : "Selecciona un país",
          "El Salvador" : "El Salvador",
          "Hint" : "Pista",
          "Example sentence" : "Ejemplo de frase",
          "Your Flashcards" : "Tus Tarjetas de Flashcard",
          "Flashcards" : "Tarjetas de Flashcard",
          "Added to flashcards successfully!" : "¡Agregado a tarjetas de flashcard con éxito!",
          "Failed to add to flashcards. Please try again." : "¡Fallo al agregar a tarjetas de flashcard. Inténtalo de nuevo.",
          "Add to Flashcards" : "Agregar a Flashcards", 
          "Next" : "Siguiente",
          "of" : "de",
          "Flashcard" : "Tarjeta de Flashcard",
          "You don't have any flashcards yet." : "No tienes ninguna tarjeta de flashcard todavía.",
          "Created with" : "Creado con",
          "No account? Register here!" : "¿No tienes cuenta? ¡Regístrate aquí!",
          "Login failed. Please try again." : "¡Inicio de sesión fallado. Inténtalo de nuevo.",
          "Email" : "Correo electrónico",
          "Password" : "Contraseña",
          "Please select a country" : "Por favor selecciona un país",
          "Logged in successfully!" : "¡Inicié sesión exitosamente!",
          "Show hint" : "Mostrar pista",
          "Please enter a title." : "Por favor ingresa un título.",
          "Please enter a description." : "Por favor ingresa una descripción.",
          "Please select a country." : "Por favor selecciona un país.",
          "Please enter a hint." : "Por favor ingresa una pista.",
          "Please enter an example sentence." : "Por favor ingresa una frase de ejemplo.",
          "Current Streak" : "Racha Actual",
          "Longest Streak" : "Racha Más Larga",
          "No streak recorded. Start a streak today!" : "No se ha registrado ninguna racha. ¡Comienza tu racha hoy!",
          "No current streak. Start a streak today!" : "No se ha registrado ninguna racha actual. ¡Comienza tu racha hoy!",
          "{{count}} day(s)" : "{{count}} día(s)",
          "Again": "De nuevo",
          "Hard": "Difícil",
          "Good": "Bueno",
          "Easy": "Fácil",
          "Streak updated to {{streak}}!" : "Racha actualizada a {{streak}}!",
          "You've completed all your flashcards for today. Please come back tomorrow.": "You've completed all your flashcards for today. Please come back tomorrow.",
          "No hint provided": "No hint provided",
          "Streak started! Current streak: {{streak}}": "¡Racha iniciada! Racha actual: {{streak}}",
          "Streak extended! Current streak: {{streak}}": "¡Racha extendida! Racha actual: {{streak}}",
          "Feedback" : "Feedback",
          "Submit" : "Enviar",
          "Message" : "Mensaje",
          "Logged out successfully!" : "¡Cerró sesión exitosamente!",  
          "Feedback submitted successfully!" : "¡Feedback enviado exitosamente!",
          "Feedback submission failed. Please try again." : "¡Envío de feedback fallado. Inténtalo de nuevo.",
          "Streak updated to {{streak}}!" : "¡Racha actualizada a {{streak}}!",
          "You've completed all your flashcards for today. Please come back tomorrow.": "¡Completaste todas tus tarjetas de flashcard para hoy. Por favor regresa mañana!",
          "Author" : "Autor",
          "Please enter an author." : "Por favor ingresa un autor.",
          "created by": "creado por",
          "Loading..." : "Cargando...",
          "Entry Details" : "Detalles del contenido",
          "Add a comment" : "Agregar un comentario",
          "Add a comment..." : "Agregar un comentario...",
          "Failed to add comment" : "¡Fallo al agregar comentario",
          "Comment added successfully!" : "¡Comentario agregado exitosamente!",
          "Comments" : "Comentarios",
          "Show Comments" : "Mostrar Comentarios",
          "Vote recorded successfully!" : "¡Voto registrado exitosamente!",
          "Failed to record vote. Please try again." : "¡Fallo al registrar voto. Inténtalo de nuevo!",
          "Vote already recorded for this user on this content." : "¡Voto ya registrado para este usuario en este contenido!",
          "Please log in to vote" : "¡Inicie sesión para votar!",
          "Add Tag" : "Agregar Etiqueta",
          "name": "nombre",
          "Please enter a name." : "Por favor ingresa un nombre.",
          "Please log in to add tags": "¡Inicie sesión para agregar etiquetas!",
          "Added successfully" : "¡Agregado exitosamente!",
          "Add Feedback" : "Agregar Feedback",
          "tag" : "etiqueta",
          "Please log in to add a tag" : "¡Inicie sesión para agregar una etiqueta!",
          "Select countries..." : "Selecciona países...",
          "+ Add Tag" : "+ Agregar Etiqueta",
          "Select tags..." : "Selecciona etiquetas...",
          "No results found. Please try another search." : "No se encontraron resultados. Intente con otra búsqueda.",
          "Registration successful!" : "¡Registro exitoso!",
          "Registration failed. Please try again." : "¡Registro fallado. Inténtalo de nuevo.",
          "Password must be at least 8 characters long." : "La contraseña debe tener al menos 8 caracteres.",
          "Password cannot be blank." : "La contraseña no puede estar en blanco.",
          "Password or username is incorrect" : "Contraseña o nombre de usuario incorrecto",
        }
      }
    },
    fallbackLng: "en",
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
