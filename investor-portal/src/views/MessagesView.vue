<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Messages List -->
    <div class="lg:col-span-2">
      <div class="card">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="font-heading font-bold text-lg">Your Messages</h3>
            <button @click="showNewMessage = true" class="btn-primary btn-sm">
              <PlusIcon class="w-4 h-4 mr-1" />
              New Message
            </button>
          </div>
        </div>
        
        <div v-if="messagesStore.loading" class="p-6 text-center text-gray-500">
          Loading messages...
        </div>
        
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="message in messagesStore.messages"
            :key="message.id"
            class="p-6"
          >
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-medium">{{ message.subject }}</h4>
                <p class="text-gray-500 text-sm">{{ formatDate(message.createdAt) }}</p>
              </div>
              <span
                class="inline-flex px-2 py-1 text-xs rounded-full"
                :class="getStatusClass(message.status)"
              >
                {{ message.status }}
              </span>
            </div>
            
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <p class="text-gray-700">{{ message.message }}</p>
            </div>
            
            <div v-if="message.response" class="mt-4 p-4 bg-forest-50 rounded-lg border border-forest-100">
              <div class="flex items-center mb-2">
                <span class="text-sm font-medium text-forest-700">Response from {{ message.respondedBy?.name || 'Team' }}</span>
                <span class="text-xs text-gray-500 ml-2">{{ formatDate(message.respondedAt) }}</span>
              </div>
              <p class="text-gray-700">{{ message.response }}</p>
            </div>
          </div>
          
          <div v-if="messagesStore.messages.length === 0" class="p-12 text-center">
            <ChatBubbleLeftRightIcon class="w-12 h-12 text-gray-300 mx-auto" />
            <h3 class="mt-4 text-lg font-medium text-gray-900">No messages</h3>
            <p class="mt-2 text-gray-500">Send a message to get in touch with our team.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- New Message Form -->
    <div class="lg:col-span-1">
      <div class="card p-6">
        <h3 class="font-heading font-bold text-lg mb-4">Send a Message</h3>
        
        <form @submit.prevent="handleSendMessage" class="space-y-4">
          <div>
            <label class="label">Subject</label>
            <input
              v-model="newMessage.subject"
              type="text"
              class="input"
              placeholder="What is your question about?"
              required
            />
          </div>
          
          <div>
            <label class="label">Message</label>
            <textarea
              v-model="newMessage.message"
              rows="6"
              class="input"
              placeholder="Type your message here..."
              required
            ></textarea>
          </div>
          
          <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-md">
            <p class="text-green-700 text-sm">{{ successMessage }}</p>
          </div>
          
          <div v-if="messagesStore.error" class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-700 text-sm">{{ messagesStore.error }}</p>
          </div>
          
          <button
            type="submit"
            :disabled="messagesStore.loading"
            class="btn-primary w-full"
          >
            <span v-if="messagesStore.loading">Sending...</span>
            <span v-else>Send Message</span>
          </button>
        </form>
        
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h4 class="font-medium text-sm mb-2">Other ways to reach us</h4>
          <p class="text-gray-600 text-sm">
            <strong>Email:</strong> investors@lchd.com<br />
            <strong>Phone:</strong> (541) 555-0123
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useMessagesStore } from '../stores/portal'
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/vue/24/outline'

const messagesStore = useMessagesStore()

const showNewMessage = ref(false)
const successMessage = ref('')
const newMessage = reactive({
  subject: '',
  message: ''
})

onMounted(() => {
  messagesStore.fetchMessages()
})

async function handleSendMessage() {
  successMessage.value = ''
  const success = await messagesStore.sendMessage(newMessage.subject, newMessage.message)
  
  if (success) {
    successMessage.value = 'Message sent successfully! We\'ll respond shortly.'
    newMessage.subject = ''
    newMessage.message = ''
    showNewMessage.value = false
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function getStatusClass(status) {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    READ: 'bg-blue-100 text-blue-800',
    RESPONDED: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
