<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="animated-gradient min-h-screen flex flex-col">
      <!-- Navigation -->
      <nav class="glass p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-2xl font-bold text-white">RAG Platform</span>
          </div>
          
          <div class="flex gap-4">
            <router-link
              to="/login"
              class="px-6 py-2 text-white hover:bg-white/20 rounded-lg transition-all"
            >
              Sign In
            </router-link>
            <router-link
              to="/register"
              class="px-6 py-2 bg-white text-primary-600 rounded-lg hover:shadow-lg transition-all btn-hover"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="flex-1 flex items-center justify-center px-4">
        <div class="max-w-4xl text-center fade-in">
          <h1 class="text-6xl font-bold text-white mb-6 leading-tight">
            Chat with Your
            <span class="block mt-2">Documents</span>
          </h1>
          <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Upload PDFs, ask questions, and get instant answers powered by AI. 
            Transform your documents into an intelligent knowledge base.
          </p>
          
          <div class="flex gap-4 justify-center">
            <router-link
              to="/register"
              class="px-8 py-4 bg-white text-primary-600 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all btn-hover"
            >
              Start Free Trial
            </router-link>
            <a
              href="#features"
              class="px-8 py-4 border-2 border-white text-white rounded-xl text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </div>

          <!-- Stats -->
          <div class="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div class="scale-in" style="animation-delay: 0.1s">
              <div class="text-4xl font-bold text-white">10K+</div>
              <div class="text-white/80">Documents Processed</div>
            </div>
            <div class="scale-in" style="animation-delay: 0.2s">
              <div class="text-4xl font-bold text-white">99.9%</div>
              <div class="text-white/80">Accuracy Rate</div>
            </div>
            <div class="scale-in" style="animation-delay: 0.3s">
              <div class="text-4xl font-bold text-white">5K+</div>
              <div class="text-white/80">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p class="text-xl text-gray-600">Everything you need to work smarter with your documents</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-lg card-hover">
            <div class="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-3">AI-Powered Chat</h3>
            <p class="text-gray-600">Ask questions in natural language and get instant, accurate answers from your documents.</p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg card-hover">
            <div class="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-3">Document Upload</h3>
            <p class="text-gray-600">Upload PDFs, Word docs, and text files. We'll process them instantly and make them searchable.</p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg card-hover">
            <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-3">Lightning Fast</h3>
            <p class="text-gray-600">Get answers in seconds with our optimized vector search and caching technology.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-xl text-gray-600">Get started in three simple steps</p>
        </div>

        <div class="grid md:grid-cols-3 gap-12">
          <div class="text-center">
            <div class="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 class="text-xl font-semibold mb-3">Upload Documents</h3>
            <p class="text-gray-600">Upload your PDFs, Word docs, or text files to the platform.</p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 class="text-xl font-semibold mb-3">Ask Questions</h3>
            <p class="text-gray-600">Type your questions in natural language and get instant answers.</p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 class="text-xl font-semibold mb-3">Get Insights</h3>
            <p class="text-gray-600">Receive accurate answers with source citations from your documents.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 gradient-primary">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">Ready to Transform Your Workflow?</h2>
        <p class="text-xl text-white/90 mb-8">Join thousands of users who are already working smarter with RAG Platform.</p>
        <router-link
          to="/register"
          class="inline-block px-8 py-4 bg-white text-primary-600 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all btn-hover"
        >
          Start Free Trial →
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">RAG Platform</h3>
            <p class="text-gray-400">Making documents smarter with AI.</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Product</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Features</a></li>
              <li><a href="#" class="hover:text-white">Pricing</a></li>
              <li><a href="#" class="hover:text-white">API</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Company</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">About</a></li>
              <li><a href="#" class="hover:text-white">Blog</a></li>
              <li><a href="#" class="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Privacy</a></li>
              <li><a href="#" class="hover:text-white">Terms</a></li>
              <li><a href="#" class="hover:text-white">Security</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 RAG Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Landing page - no logic needed
</script>