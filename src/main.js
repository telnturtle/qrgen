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
        // Initialize UI event listeners
        this.ui.init()
        
        // Bind QR generation to UI events
        this.ui.onInputChange((data) => {
            this.generateQR(data)
        })
        
        // Bind download functionality
        this.ui.onDownloadClick(() => {
            this.downloadQR()
        })
        
        console.log('QR Generator App initialized')
    }

    generateQR(data) {
        try {
            const qrData = this.qrGenerator.generate(data)
            this.ui.updatePreview(qrData)
            this.ui.enableDownload()
        } catch (error) {
            console.error('QR generation failed:', error)
            this.ui.showError('QR 코드 생성에 실패했습니다.')
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
