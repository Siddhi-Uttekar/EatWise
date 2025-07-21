// API configuration
const API_BASE = "http://localhost:5000/api"

class FoodAnalyzer {
  constructor() {
    this.selectedFile = null
    this.extractedText = ""
    this.initElements()
    this.bindEvents()
  }

  // Initialize DOM elements
  initElements() {
    this.fileInput = document.getElementById("fileInput")
    this.preview = document.getElementById("preview")
    this.previewImg = document.getElementById("previewImg")
    this.analyzeBtn = document.getElementById("analyzeBtn")
    this.loading = document.getElementById("loading")
    this.error = document.getElementById("error")
    this.results = document.getElementById("results")
  }

  // Bind event listeners
  bindEvents() {
    this.fileInput.addEventListener("change", (e) => this.handleFileSelect(e))
    this.analyzeBtn.addEventListener("click", () => this.analyze())
  }

  // Handle file selection
  handleFileSelect(event) {
    const file = event.target.files[0]
    if (file) {
      this.selectedFile = file
      // Create preview URL and display image
      this.previewImg.src = URL.createObjectURL(file)
      this.preview.classList.remove("hidden")
      this.hideError()
      this.hideResults()
    }
  }

  // Main analysis function
  async analyze() {
    if (!this.selectedFile) return

    try {
      this.showLoading()

      // Step 1: Extract text from image
      const text = await this.extractText()

      // Step 2: Analyze ingredients
      const analysis = await this.analyzeIngredients(text)

      // Step 3: Display results
      this.displayResults(analysis)
    } catch (error) {
      this.showError(error.message)
    } finally {
      this.hideLoading()
    }
  }

  // Extract text using OCR API
  async extractText() {
    const formData = new FormData()
    formData.append("image", this.selectedFile)

    const response = await fetch(`${API_BASE}/ocr/extract`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to extract text")
    }

    const result = await response.json()
    return result.text
  }

  // Analyze ingredients using AI API
  async analyzeIngredients(text) {
    const response = await fetch(`${API_BASE}/analysis/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Analysis failed")
    }

    return response.json()
  }

  // Display analysis results
  displayResults(analysis) {
    const html = `
      <!-- Overall Rating Card -->
      <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">Overall Safety Rating</h2>
              <span class="px-3 py-1 bg-${this.getRatingColor(analysis.overallRating)}-100 text-${this.getRatingColor(analysis.overallRating)}-800 rounded font-medium">
                  ${analysis.overallRating.toUpperCase()}
              </span>
          </div>
          <div class="mb-4">
              <div class="flex justify-between text-sm mb-1">
                  <span>Safety Score</span>
                  <span>${analysis.overallScore}/100</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: ${analysis.overallScore}%"></div>
              </div>
          </div>
          <p class="text-gray-700">${analysis.summary}</p>
      </div>

      <!-- Risky Ingredients Alert -->
      ${analysis.topRiskyIngredients.length > 0 ? `
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 class="font-semibold text-red-800 mb-2">⚠️ Risky Ingredients:</h3>
              <ul class="text-red-700">
                  ${analysis.topRiskyIngredients.map(ingredient => `<li>• ${ingredient}</li>`).join('')}
              </ul>
          </div>
      ` : ''}

      <!-- Detailed Ingredient Analysis -->
      <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">🧪 Ingredient Analysis</h2>
          <div class="space-y-4">
              ${analysis.ingredients.map(ingredient => `
                  <div class="border-l-4 border-${this.getRiskColor(ingredient.riskLevel)}-400 pl-4">
                      <div class="flex justify-between items-center">
                          <h3 class="font-medium">${ingredient.name}</h3>
                          <span class="text-sm text-${this.getRiskColor(ingredient.riskLevel)}-600">
                              ${this.getRiskEmoji(ingredient.riskLevel)} ${ingredient.safetyScore}/100
                          </span>
                      </div>
                      ${ingredient.allergenInfo.isAllergen ? `
                          <p class="text-sm text-yellow-600 mt-1">⚠️ Allergen: ${ingredient.allergenInfo.allergenType}</p>
                      ` : ''}
                      ${ingredient.concerns.length > 0 ? `
                          <ul class="text-sm text-red-600 mt-2">
                              ${ingredient.concerns.map(concern => `<li>• ${concern}</li>`).join('')}
                          </ul>
                      ` : ''}
                  </div>
              `).join('')}
          </div>
      </div>

      <!-- Recommendations -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-semibold text-blue-800 mb-2">💡 Recommendations:</h3>
          <ul class="text-blue-700">
              ${analysis.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
      </div>
    `

    this.results.innerHTML = html
    this.results.classList.remove("hidden")
  }

  // Utility functions for styling
  getRatingColor(rating) {
    const colors = {
      excellent: "green",
      good: "green",
      fair: "yellow",
      poor: "orange",
      dangerous: "red"
    }
    return colors[rating] || "gray"
  }

  getRiskColor(risk) {
    const colors = {
      safe: "green",
      moderate: "yellow",
      risky: "red"
    }
    return colors[risk] || "gray"
  }

  getRiskEmoji(risk) {
    const emojis = {
      safe: "✅",
      moderate: "⚠️",
      risky: "❌"
    }
    return emojis[risk] || "ℹ️"
  }

  // UI state management functions
  showLoading() {
    this.loading.classList.remove("hidden")
    this.analyzeBtn.disabled = true
  }

  hideLoading() {
    this.loading.classList.add("hidden")
    this.analyzeBtn.disabled = false
  }

  showError(message) {
    this.error.textContent = message
    this.error.classList.remove("hidden")
  }

  hideError() {
    this.error.classList.add("hidden")
  }

  hideResults() {
    this.results.classList.add("hidden")
  }
}

// Initialize the application
new FoodAnalyzer()