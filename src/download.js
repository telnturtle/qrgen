// Download Manager for QR Code PNG files
export class DownloadManager {
    constructor() {
        this.currentQRData = null
    }

    downloadPNG(qrData) {
        if (!qrData || !qrData.qrString) {
            throw new Error('다운로드할 QR 데이터가 없습니다.')
        }

        this.currentQRData = qrData
        
        // Generate QR code as canvas
        if (typeof QRCode !== 'undefined') {
            QRCode.toCanvas(qrData.qrString, {
                width: 400,
                height: 400,
                margin: 4,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, (error, canvas) => {
                if (error) {
                    console.error('QR Code generation error:', error)
                    throw new Error('QR 코드 생성에 실패했습니다.')
                } else {
                    this.downloadCanvasAsPNG(canvas)
                }
            })
        } else {
            throw new Error('QR 라이브러리가 로드되지 않았습니다.')
        }
    }

    downloadCanvasAsPNG(canvas) {
        try {
            // Create download link
            const link = document.createElement('a')
            link.download = this.generateFileName()
            link.href = canvas.toDataURL('image/png')
            
            // Trigger download
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            console.log('QR Code downloaded:', link.download)
        } catch (error) {
            console.error('Download failed:', error)
            throw new Error('다운로드에 실패했습니다.')
        }
    }

    generateFileName() {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        const seconds = String(now.getSeconds()).padStart(2, '0')
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.png`
    }

    getCurrentQRData() {
        return this.currentQRData
    }
}
