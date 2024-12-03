<script setup lang="ts">
import { reactive, watch } from 'vue';
import BaseInput from '../../../components/vue/BaseInput.vue';
import { validateRut } from 'rutlib';

defineExpose({
  getFormStatus,
  forceValidate
});

function getFormStatus(): { isValid: boolean, form: { [key: string]: string } } {
  // Verificar si todos los campos son válidos
  const isValidForm = [name, email, rut, phone, address, city, department].every(field => field.isValid);

  // Crear el objeto form con los valores actuales de los campos
  const formValues = {
    rut: rut.value,
    name: name.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    city: city.value,
    department: department.value,
  };

  // Retornar el objeto con isValid y el objeto form
  return {
    isValid: isValidForm,
    form: formValues
  };
}

function forceValidate() {
  validateName();
  validateEmail();
  validateRutInput();
  validatePhone();
  validateAddress();
  validateCity();
}


interface Input {
  value: string,
  isValid: boolean,
  errorMessage?: string
}
// Estado reactivo para cada campo
const name = reactive<Input>({
  value: '',
  isValid: false,
  errorMessage: undefined
});

const email = reactive<Input>({
  value: '',
  isValid: false,
  errorMessage: undefined
});

const rut = reactive<Input>({
  value: '',
  isValid: false,
  errorMessage: undefined
});

const phone = reactive<Input>({
  value: '',
  isValid: false,
  errorMessage: undefined
});

const address = reactive<Input>({
  value: '',
  isValid: false,
  errorMessage: undefined
});

const city = reactive<Input>({
  value: '',
  isValid: false,
  errorMessage: undefined
});

const department = reactive<Input>({
  value: '',
  isValid: true,
  errorMessage: undefined
});

// Función para formatear el RUT
function formatRutInput(rut: string) {
  rut = rut.replace(/\D/g, ''); // Eliminar caracteres no numéricos
  if (rut.length < 2) return rut;

  const rutWithoutVerifier = rut.slice(0, -1); // Todo menos el último dígito
  const verifier = rut.slice(-1); // El último dígito (verificador)

  const formatted = rutWithoutVerifier.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${verifier}`;
}

// Validación del RUT
function validateRutInput() {
  const isValid = validateRut(rut.value);
  if (!isValid) {
    rut.isValid = false;
    rut.errorMessage = 'El RUT ingresado no es válido';
  } else {
    rut.isValid = true;
    rut.errorMessage = undefined;
  }
}

// Validación del nombre
function validateName() {
  name.isValid = true;
  name.errorMessage = undefined;

  if (!name.value) {
    name.isValid = false;
    name.errorMessage = 'El nombre es obligatorio';
    return;
  }

  if (/\d/.test(name.value)) {
    name.isValid = false;
    name.errorMessage = 'El nombre no puede contener números';
    return;
  }

  const words = name.value.trim().split(/\s+/);
  if (words.length < 3) {
    name.isValid = false;
    name.errorMessage = 'El nombre debe contener al menos 3 palabras';
    return;
  }
}

// Validación de email
function validateEmail() {
  email.isValid = true;
  email.errorMessage = undefined;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email.value || !emailRegex.test(email.value)) {
    email.isValid = false;
    email.errorMessage = 'El email ingresado no es válido';
  }
}

// Validación de teléfono
function validatePhone() {
  phone.isValid = true;
  phone.errorMessage = undefined;

  const phoneRegex = /^[0-9]{9}$/;
  if (!phone.value || !phoneRegex.test(phone.value)) {
    phone.isValid = false;
    phone.errorMessage = 'El teléfono debe tener 9 dígitos';
  }
}

// Validación de dirección
function validateAddress() {
  address.isValid = true;
  address.errorMessage = undefined;

  if (!address.value) {
    address.isValid = false;
    address.errorMessage = 'La dirección es obligatoria';
    return;
  }

  const parts = address.value.trim().split(/\s+/);
  if (parts.length < 2) {
    address.isValid = false;
    address.errorMessage = 'La dirección debe tener al menos una palabra y un número';
    return;
  }

  const hasWord = parts.some(part => /^[a-zA-Z]+$/.test(part));
  const hasNumber = parts.some(part => /^\d+$/.test(part));

  if (!hasWord || !hasNumber) {
    address.isValid = false;
    address.errorMessage = 'La dirección debe contener al menos una palabra y un número separados';
  }
}

// Validación de ciudad
function validateCity() {
  city.isValid = true;
  city.errorMessage = undefined;

  if (!city.value) {
    city.isValid = false;
    city.errorMessage = 'La ciudad es obligatoria';
  }
}

// Observadores para cada campo
watch(() => name.value, validateName);
watch(() => email.value, validateEmail);
watch(() => rut.value, validateRutInput);
watch(() => phone.value, validatePhone);
watch(() => address.value, validateAddress);
watch(() => city.value, validateCity);

</script>

<template>
  <form class="p-4 bg-slate-50 w-full max-w-screen-md rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Información de envío</h2>
    <div class="grid grid-cols-12 gap-2">
      <!-- Nombre -->
      <div class="col-span-12">
        <BaseInput :value="name.value" :error-message="name.errorMessage" @on-input="(i) => { name.value = i }" :type="'text'" :label="'Nombre completo'" :place-holder="'Tu nombre completo'"></BaseInput>
      </div>
      
      <!-- Email -->
      <div class="col-span-12 md:col-span-6">
        <BaseInput :value="email.value" :error-message="email.errorMessage" @on-input="(i) => { email.value = i }" :type="'text'" :label="'Email'" :place-holder="'tu@email.com'"></BaseInput>
      </div>
      
      <!-- RUT -->
      <div class="col-span-12 md:col-span-6">
        <BaseInput :value="rut.value" :error-message="rut.errorMessage" @on-input="(i) => { rut.value = formatRutInput(i) }" :type="'text'" :label="'RUT'" :place-holder="'12.345.678-2'"></BaseInput>
      </div>
      
      <!-- Teléfono -->
      <div class="col-span-12 md:col-span-6">
        <BaseInput :value="phone.value" :error-message="phone.errorMessage" @on-input="(i) => { phone.value = i }" :type="'text'" :label="'Teléfono'" :place-holder="'Tu número de teléfono'"></BaseInput>
      </div>
      
      <!-- Dirección -->
      <div class="col-span-12 md:col-span-6">
        <BaseInput :value="address.value" :error-message="address.errorMessage" @on-input="(i) => { address.value = i }" :type="'text'" :label="'Dirección'" :place-holder="'Tu dirección 1234'"></BaseInput>
      </div>
      
      <!-- Ciudad -->
      <div class="col-span-12 md:col-span-6">
        <BaseInput :value="city.value" :error-message="city.errorMessage" @on-input="(i) => { city.value = i }" :type="'text'" :label="'Comuna'" :place-holder="'Tu ciudad'"></BaseInput>
      </div>
      
      <!-- Departamento -->
      <div class="col-span-12 md:col-span-6">
        <BaseInput :value="department.value" @on-input="(i) => { department.value = i }" :type="'text'" :label="'Departamento (opcional)'" :place-holder="'Número de apartamento'"></BaseInput>
      </div>
    </div>
  </form>
</template>
