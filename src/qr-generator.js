// QR Code Generator Core Logic
export class QRGenerator {
    constructor() {
        this.currentQRData = null
    }

    generate(data) {
        const { type, content } = data
        
        let qrString = ''
        
        switch (type) {
            case 'url':
                qrString = this.generateURLQR(content)
                break
            case 'wifi':
                qrString = this.generateWiFiQR(content)
                break
            case 'text':
                qrString = this.generateTextQR(content)
                break
            default:
                throw new Error('지원하지 않는 QR 타입입니다.')
        }
        
        this.currentQRData = {
            type,
            content,
            qrString,
            timestamp: new Date()
        }
        
        return this.currentQRData
    }

    generateURLQR(urlData) {
        const { url } = urlData
        
        if (!url || !this.isValidURL(url)) {
            throw new Error('유효한 URL을 입력해주세요.')
        }
        
        return url
    }

    generateWiFiQR(wifiData) {
        const { ssid, password, security } = wifiData
        
        if (!ssid) {
            throw new Error('WiFi 네트워크 이름을 입력해주세요.')
        }
        
        // WiFi QR format: WIFI:T:WPA;S:SSID;P:password;H:false;
        let wifiString = `WIFI:T:${security};S:${ssid};`
        
        if (password && security !== 'nopass') {
            wifiString += `P:${password};`
        }
        
        wifiString += 'H:false;'
        
        return wifiString
    }

    generateTextQR(textData) {
        const { text } = textData
        
        if (!text || text.trim().length === 0) {
            throw new Error('텍스트를 입력해주세요.')
        }
        
        if (text.length > 1000) {
            throw new Error('텍스트는 1000자 이하로 입력해주세요.')
        }
        
        return text.trim()
    }

    isValidURL(string) {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    getCurrentQRData() {
        return this.currentQRData
    }
}
