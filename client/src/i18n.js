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
          "First hint" : "First hint",
          "Second hint" : "Second hint",
          "Third hint" : "Third hint",
          "Example sentence" : "Example sentence",
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
          "Password is required" : "Password es requerido",
          "Password" : "Password",
          "Log in" : "Iniciar sesión",
          "Forgot your password" : "Olvidó su password",
          "Email or password is incorrect. Please try again" : "El correo electrónico o password son incorrectos. Vuelva a intentarlo",
          "Send a Reset" : "Enviar un reinicio",
          "No account? Register here!" : "¿No tiene cuenta? ¡Regístrate aquí!",
          "Passwords do not match! Please try again." : "¡Passwords no coinciden! Vuelva a intentarlo",
          "Password cannot be blank! Please try again." : "¡Password no puede ser vacio! Inténtalo de nuevo.",
          "Confirm Password cannot be blank! Please try again." : "¡Confirmar Password no puede ser vacio! Inténtalo de nuevo.",
          "Please provide your name." : "Por favor proporcione su nombre.",
          "Please provide your email." : "Por favor proporcione su correo electrónico.",
          "Name" : "Nombre", 
          "Confirm Password" : "Confirmar Password",
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
          "First hint" : "Primera pista",
          "Second hint" : "Segunda pista",
          "Third hint" : "Tercera pista",
          "Example sentence" : "Ejemplo de frase",
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
