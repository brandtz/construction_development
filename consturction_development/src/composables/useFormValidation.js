import { ref } from 'vue'

export function useFormValidation() {
  const errors = ref({})
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }
  
  const validateRequired = (value) => {
    return value && value.trim().length > 0
  }
  
  const validatePhone = (phone) => {
    if (!phone) return true // Optional field
    const re = /^[\d\s\-\(\)\+]+$/
    return re.test(phone)
  }
  
  const validate = (form) => {
    errors.value = {}
    
    if (!validateRequired(form.firstName)) {
      errors.value.firstName = 'First name is required'
    }
    
    if (!validateRequired(form.lastName)) {
      errors.value.lastName = 'Last name is required'
    }
    
    if (!validateRequired(form.email)) {
      errors.value.email = 'Email is required'
    } else if (!validateEmail(form.email)) {
      errors.value.email = 'Please enter a valid email address'
    }
    
    if (!validatePhone(form.phone)) {
      errors.value.phone = 'Please enter a valid phone number'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  const clearErrors = () => {
    errors.value = {}
  }
  
  return { errors, validate, clearErrors }
}
