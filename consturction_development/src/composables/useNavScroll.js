import { ref, onMounted, onUnmounted } from 'vue'

export function useNavScroll(scrollThreshold = 50) {
  const isScrolled = ref(false)
  
  const handleScroll = () => {
    isScrolled.value = window.scrollY > scrollThreshold
  }
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  
  return { isScrolled }
}
