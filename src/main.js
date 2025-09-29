// QR Generator Main Application
import { QRGenerator } from './qr-generator.js'
import { UI } from './ui.js'
import { DownloadManager } from './download.js'

class App {
    constructor() {
        this.qrGenerator = new QRGenerator()
        this.ui = new UI()
        this.downloadManager = new DownloadManager()
        
        this.init()
    }

    init() {
        console.log('App: Starting initialization')
        
        // Initialize UI event listeners
        this.ui.init()
        console.log('App: UI initialized')
        
        // Bind QR generation to UI events
        this.ui.onInputChange((data) => {
            console.log('App: Input change callback triggered with:', data)
            this.generateQR(data)
        })
        console.log('App: Input change callback registered')
        
        // Bind download functionality
        this.ui.onDownloadClick(() => {
            this.downloadQR()
        })
        console.log('App: Download callback registered')
        
        console.log('QR Generator App initialized')
    }

    generateQR(data) {
        try {
            console.log('Generating QR for data:', data)
            const qrData = this.qrGenerator.generate(data)
            console.log('Generated QR data:', qrData)
            this.ui.updatePreview(qrData)
            this.ui.enableDownload()
        } catch (error) {
            console.error('QR generation failed:', error)
            // this.ui.showError('QR 코드 생성에 실패했습니다: ' + error.message)
        }
    }

    downloadQR() {
        try {
            const qrData = this.ui.getCurrentQRData()
            if (qrData) {
                this.downloadManager.downloadPNG(qrData)
            }
        } catch (error) {
            console.error('Download failed:', error)
            this.ui.showError('다운로드에 실패했습니다.')
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App()
})
