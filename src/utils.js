// Utility functions for QR Generator
export class Utils {
    static validateURL(url) {
        try {
            new URL(url)
            return true
        } catch (_) {
            return false
        }
    }

    static validateWiFiData(data) {
        const { ssid, password, security } = data
        
        if (!ssid || ssid.trim().length === 0) {
            return { valid: false, message: 'WiFi 네트워크 이름을 입력해주세요.' }
        }
        
        if (security !== 'nopass' && (!password || password.trim().length === 0)) {
            return { valid: false, message: 'WiFi 비밀번호를 입력해주세요.' }
        }
        
        if (ssid.length > 32) {
            return { valid: false, message: 'WiFi 네트워크 이름은 32자 이하로 입력해주세요.' }
        }
        
        if (password && password.length > 63) {
            return { valid: false, message: 'WiFi 비밀번호는 63자 이하로 입력해주세요.' }
        }
        
        return { valid: true }
    }

    static validateText(text) {
        if (!text || text.trim().length === 0) {
            return { valid: false, message: '텍스트를 입력해주세요.' }
        }
        
        if (text.length > 1000) {
            return { valid: false, message: '텍스트는 1000자 이하로 입력해주세요.' }
        }
        
        return { valid: true }
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') {
            return ''
        }
        
        return input.trim().replace(/[<>]/g, '')
    }

    static formatDateTime(date = new Date()) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    static debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }
}
