<template>
  <div class="min-h-screen bg-dark-gradient">
    <!-- Hero Section with Particle Background -->
    <div class="mesh-gradient particle-bg min-h-screen flex flex-col">
      <!-- Navigation -->
      <nav class="glass-dark-modern backdrop-blur-xl p-6 border-b border-white/10">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-purple rounded-xl flex items-center justify-center neon-glow">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-3xl font-black text-white gradient-text">RAG Platform</span>
          </div>

          <div class="flex gap-4">
            <router-link
              to="/login"
              class="px-6 py-2.5 text-white font-semibold hover:bg-white/10 rounded-lg transition-all duration-300 border border-white/20"
            >
              Sign In
            </router-link>
            <router-link
              to="/register"
              class="btn-modern"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="flex-1 flex items-center justify-center px-4 py-20">
        <div class="max-w-5xl text-center fade-in">
          <div class="inline-block mb-6 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full">
            <span class="text-primary-300 font-semibold text-sm">✨ Powered by Advanced AI</span>
          </div>

          <h1 class="text-7xl md:text-8xl font-black text-white mb-8 leading-tight">
            Chat with Your
            <span class="block mt-3 gradient-text text-glow">Documents</span>
          </h1>

          <p class="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload PDFs, ask questions, and get instant AI-powered answers.
            Transform your documents into an intelligent knowledge base.
          </p>

          <div class="flex gap-6 justify-center mb-20">
            <router-link
              to="/register"
              class="btn-modern text-lg px-10 py-4"
            >
              Start Free Trial →
            </router-link>
            <a
              href="#features"
              class="px-10 py-4 border-2 border-white/30 text-white rounded-xl text-lg font-bold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
            >
              Learn More
            </a>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-12 max-w-3xl mx-auto">
            <div class="scale-in glass-dark-modern p-6 rounded-2xl neon-border" style="animation-delay: 0.1s">
              <div class="text-5xl font-black gradient-text mb-2">10K+</div>
              <div class="text-gray-400 font-medium">Documents Processed</div>
            </div>
            <div class="scale-in glass-dark-modern p-6 rounded-2xl neon-border" style="animation-delay: 0.2s">
              <div class="text-5xl font-black gradient-text mb-2">99.9%</div>
              <div class="text-gray-400 font-medium">Accuracy Rate</div>
            </div>
            <div class="scale-in glass-dark-modern p-6 rounded-2xl neon-border" style="animation-delay: 0.3s">
              <div class="text-5xl font-black gradient-text mb-2">5K+</div>
              <div class="text-gray-400 font-medium">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section id="features" class="py-28 bg-dark-100 border-t border-white/10">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-20">
          <div class="inline-block mb-4 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full">
            <span class="text-primary-300 font-semibold text-sm">FEATURES</span>
          </div>
          <h2 class="text-5xl font-black text-white mb-6 gradient-text">Powerful Features</h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to work smarter with your documents</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="glass-dark-modern p-8 rounded-3xl card-hover neon-border">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6 neon-glow">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white">AI-Powered Chat</h3>
            <p class="text-gray-400 leading-relaxed">Ask questions in natural language and get instant, accurate answers from your documents.</p>
          </div>

          <div class="glass-dark-modern p-8 rounded-3xl card-hover neon-border">
            <div class="w-16 h-16 bg-gradient-to-br from-accent-pink to-accent-purple rounded-2xl flex items-center justify-center mb-6 neon-glow">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white">Document Upload</h3>
            <p class="text-gray-400 leading-relaxed">Upload PDFs, Word docs, and text files. We'll process them instantly and make them searchable.</p>
          </div>

          <div class="glass-dark-modern p-8 rounded-3xl card-hover neon-border">
            <div class="w-16 h-16 bg-gradient-to-br from-accent-cyan to-primary-500 rounded-2xl flex items-center justify-center mb-6 neon-glow">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white">Lightning Fast</h3>
            <p class="text-gray-400 leading-relaxed">Get answers in seconds with our optimized vector search and caching technology.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-28 bg-dark-gradient particle-bg border-t border-white/10">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-20">
          <div class="inline-block mb-4 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full">
            <span class="text-primary-300 font-semibold text-sm">HOW IT WORKS</span>
          </div>
          <h2 class="text-5xl font-black text-white mb-6 gradient-text">Get Started in 3 Steps</h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Simple, fast, and powerful</p>
        </div>

        <div class="grid md:grid-cols-3 gap-16">
          <div class="text-center fade-in">
            <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-purple text-white rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-8 neon-glow">
              1
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white">Upload Documents</h3>
            <p class="text-gray-400 leading-relaxed">Upload your PDFs, Word docs, or text files to the platform in seconds.</p>
          </div>

          <div class="text-center fade-in" style="animation-delay: 0.1s">
            <div class="w-24 h-24 bg-gradient-to-br from-accent-pink to-accent-purple text-white rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-8 neon-glow">
              2
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white">Ask Questions</h3>
            <p class="text-gray-400 leading-relaxed">Type your questions in natural language and get instant AI responses.</p>
          </div>

          <div class="text-center fade-in" style="animation-delay: 0.2s">
            <div class="w-24 h-24 bg-gradient-to-br from-accent-cyan to-primary-500 text-white rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-8 neon-glow">
              3
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white">Get Insights</h3>
            <p class="text-gray-400 leading-relaxed">Receive accurate answers with source citations from your documents.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-28 mesh-gradient border-t border-white/10">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-5xl md:text-6xl font-black text-white mb-8 gradient-text text-glow">Ready to Transform Your Workflow?</h2>
        <p class="text-2xl text-gray-300 mb-12 leading-relaxed">Join thousands of users who are already working smarter with RAG Platform.</p>
        <router-link
          to="/register"
          class="btn-modern text-xl px-12 py-5 inline-block"
        >
          Start Free Trial →
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark-50 border-t border-white/10 text-white py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-12">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-purple rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span class="text-xl font-bold gradient-text">RAG Platform</span>
            </div>
            <p class="text-gray-400">Making documents smarter with AI.</p>
          </div>
          <div>
            <h4 class="font-bold mb-4 text-lg">Product</h4>
            <ul class="space-y-3 text-gray-400">
              <li><a href="#" class="hover:text-primary-400 transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Pricing</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4 text-lg">Company</h4>
            <ul class="space-y-3 text-gray-400">
              <li><a href="#" class="hover:text-primary-400 transition-colors">About</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4 text-lg">Legal</h4>
            <ul class="space-y-3 text-gray-400">
              <li><a href="#" class="hover:text-primary-400 transition-colors">Privacy</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Terms</a></li>
              <li><a href="#" class="hover:text-primary-400 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-white/10 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2025 RAG Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Landing page - modern dark theme with interactive elements
</script>
