// UI Management and Event Handling
export class UI {
    constructor() {
        this.currentTab = 'url'
        this.currentQRData = null
        this.inputCallbacks = []
        this.downloadCallbacks = []
    }

    init() {
        this.setupTabNavigation()
        this.setupInputListeners()
        this.setupDownloadButton()
    }

    setupTabNavigation() {
        const tabs = ['url', 'wifi', 'text']
        
        tabs.forEach(tab => {
            const tabButton = document.getElementById(`${tab}-tab`)
            const tabContent = document.getElementById(`${tab}-form`)
            
            if (tabButton && tabContent) {
                tabButton.addEventListener('click', () => {
                    this.switchTab(tab)
                })
            }
        })
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white')
            btn.classList.add('bg-gray-200', 'text-gray-700')
        })
        
        const activeTab = document.getElementById(`${tabName}-tab`)
        if (activeTab) {
            activeTab.classList.add('active', 'bg-blue-500', 'text-white')
            activeTab.classList.remove('bg-gray-200', 'text-gray-700')
        }
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden')
        })
        
        const activeContent = document.getElementById(`${tabName}-form`)
        if (activeContent) {
            activeContent.classList.remove('hidden')
        }
        
        this.currentTab = tabName
        this.clearPreview()
    }

    setupInputListeners() {
        // URL form submission
        const urlForm = document.getElementById('url-form-element')
        if (urlForm) {
            console.log('URL form found, adding submit listener')
            urlForm.addEventListener('submit', (e) => {
                e.preventDefault()
                console.log('URL form submitted')
                const urlInput = document.getElementById('url-input')
                if (urlInput && urlInput.value.trim()) {
                    console.log('URL input value:', urlInput.value.trim())
                    this.handleInputChange('url', { url: urlInput.value.trim() })
                } else {
                    console.log('URL input is empty or not found')
                }
            })
        } else {
            console.error('URL form not found')
        }

        // URL input (for real-time updates)
        const urlInput = document.getElementById('url-input')
        if (urlInput) {
            urlInput.addEventListener('input', () => {
                this.handleInputChange('url', { url: urlInput.value })
            })
        }
        
        // WiFi form submission
        const wifiForm = document.getElementById('wifi-form-element')
        if (wifiForm) {
            wifiForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const ssid = document.getElementById('wifi-ssid')?.value || ''
                const password = document.getElementById('wifi-password')?.value || ''
                const security = document.getElementById('wifi-security')?.value || 'WPA'
                
                if (ssid.trim()) {
                    this.handleInputChange('wifi', { ssid: ssid.trim(), password, security })
                }
            })
        }

        // WiFi inputs (for real-time updates)
        const wifiInputs = ['wifi-ssid', 'wifi-password', 'wifi-security']
        wifiInputs.forEach(id => {
            const input = document.getElementById(id)
            if (input) {
                input.addEventListener('input', () => {
                    this.handleWiFiInputChange()
                })
            }
        })
        
        // Text form submission
        const textForm = document.getElementById('text-form-element')
        if (textForm) {
            textForm.addEventListener('submit', (e) => {
                e.preventDefault()
                const textInput = document.getElementById('text-input')
                if (textInput && textInput.value.trim()) {
                    this.handleInputChange('text', { text: textInput.value.trim() })
                }
            })
        }

        // Text input (for real-time updates)
        const textInput = document.getElementById('text-input')
        if (textInput) {
            textInput.addEventListener('input', () => {
                this.handleInputChange('text', { text: textInput.value })
            })
        }
    }

    handleWiFiInputChange() {
        const ssid = document.getElementById('wifi-ssid')?.value || ''
        const password = document.getElementById('wifi-password')?.value || ''
        const security = document.getElementById('wifi-security')?.value || 'WPA'
        
        this.handleInputChange('wifi', { ssid, password, security })
    }

    handleInputChange(type, data) {
        console.log('UI: handleInputChange called with:', { type, data })
        console.log('UI: Number of input callbacks:', this.inputCallbacks.length)
        this.inputCallbacks.forEach(callback => {
            callback({ type, content: data })
        })
    }

    setupDownloadButton() {
        const downloadBtn = document.getElementById('download-btn')
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadCallbacks.forEach(callback => {
                    callback()
                })
            })
        }
    }

    updatePreview(qrData) {
        this.currentQRData = qrData
        
        const preview = document.getElementById('qr-preview')
        if (!preview) {
            console.error('QR preview element not found')
            return
        }

        // Check if QRCode library is available with detailed error info
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library not loaded - checking for network issues')
            preview.innerHTML = '<p class="text-red-500">QR 라이브러리를 로드할 수 없습니다. 네트워크 연결을 확인해주세요.</p>'
            return
        }

        // Additional check for QRCode.toCanvas method
        if (typeof QRCode.toCanvas !== 'function') {
            console.error('QRCode.toCanvas method not available')
            preview.innerHTML = '<p class="text-red-500">QR 라이브러리 메서드를 사용할 수 없습니다</p>'
            return
        }

        console.log('QRCode library verified, generating QR code for:', qrData.qrString)
        preview.innerHTML = ''
        
        try {
            QRCode.toCanvas(qrData.qrString, {
                width: 200,
                height: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, (error, canvas) => {
                if (error) {
                    console.error('QR Code generation error:', error)
                    preview.innerHTML = '<p class="text-red-500">QR 코드 생성 실패: ' + error.message + '</p>'
                } else {
                    preview.appendChild(canvas)
                    console.log('QR Code generated successfully')
                }
            })
        } catch (error) {
            console.error('QR Code generation failed:', error)
            preview.innerHTML = '<p class="text-red-500">QR 코드 생성 실패: ' + error.message + '</p>'
        }
    }

    clearPreview() {
        const preview = document.getElementById('qr-preview')
        if (preview) {
            preview.innerHTML = '<p class="text-gray-500">QR 코드가 여기에 표시됩니다</p>'
        }
        this.currentQRData = null
        this.disableDownload()
    }

    enableDownload() {
        const downloadBtn = document.getElementById('download-btn')
        if (downloadBtn) {
            downloadBtn.disabled = false
            downloadBtn.classList.remove('bg-gray-300', 'cursor-not-allowed')
            downloadBtn.classList.add('bg-green-500', 'hover:bg-green-600')
        }
    }

    disableDownload() {
        const downloadBtn = document.getElementById('download-btn')
        if (downloadBtn) {
            downloadBtn.disabled = true
            downloadBtn.classList.add('bg-gray-300', 'cursor-not-allowed')
            downloadBtn.classList.remove('bg-green-500', 'hover:bg-green-600')
        }
    }

    showError(message) {
        // Simple error display - could be enhanced with toast notifications
        alert(message)
    }

    getCurrentQRData() {
        return this.currentQRData
    }

    onInputChange(callback) {
        this.inputCallbacks.push(callback)
    }

    onDownloadClick(callback) {
        this.downloadCallbacks.push(callback)
    }
}
