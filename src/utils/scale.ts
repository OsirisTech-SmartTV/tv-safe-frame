import { PlatformInstance } from '@osiris-smarttv/platform'

/**
 * Các hằng số liên quan đến tỷ lệ màn hình tham chiếu
 */
const CONSTANTS = {
  REFERENCE_WIDTH: 1920,
  REFERENCE_HEIGHT: 1080,
  FONT_SCALE_MULTIPLIER: 150,
  DEFAULT_PIXEL_RATIO: 1,
}

/**
 * Safe Frame insets - distances from safe frame to viewport edges
 */
export interface SafeFrameInsets {
  top: number
  bottom: number
  left: number
  right: number
}

/**
 * Interface kết quả của scale
 */
export interface ScaleResult {
  width: number
  height: number
  scaleRatio: number
  insets: SafeFrameInsets
}

/**
 * Scale Utility class cung cấp các hàm hỗ trợ tính toán
 * tỷ lệ kích thước và scale cho các màn hình khác nhau
 */
class ScaleUtility {
  private cachedWidth: number | null = null
  private cachedHeight: number | null = null
  private resizeTimer: number | null = null
  private resizeListeners: Set<() => void> = new Set()
  private htmlElement: HTMLElement
  private boundHandleResize: () => void // Store bound function reference
  public scaleRatio: number
  private isDestroyed: boolean = false

  constructor() {
    this.htmlElement = document.documentElement
    this.scaleRatio = this.calculateScaleRatio()

    // Store reference to bound function for proper cleanup
    this.boundHandleResize = this.handleResize.bind(this)

    // Đăng ký lắng nghe sự kiện resize
    window.addEventListener('resize', this.boundHandleResize)
  }

  /**
   * Lấy chiều rộng thực của màn hình
   */
  public getRealWidth(): number {
    if (this.cachedWidth !== null) return this.cachedWidth

    let width: number
    if (PlatformInstance.isSmartTV() || PlatformInstance.isChrome()) {
      width = window.innerWidth
    } else {
      width =
        Math.min(window.outerWidth, window.innerWidth) *
        CONSTANTS.DEFAULT_PIXEL_RATIO
    }

    this.cachedWidth = width
    return width
  }

  /**
   * Lấy chiều cao thực của màn hình
   */
  public getRealHeight(): number {
    if (this.cachedHeight !== null) return this.cachedHeight

    let height: number
    if (PlatformInstance.isSmartTV() || PlatformInstance.isChrome()) {
      height = window.innerHeight
    } else {
      height =
        Math.min(window.outerHeight, window.innerHeight) *
        CONSTANTS.DEFAULT_PIXEL_RATIO
    }

    this.cachedHeight = height
    return height
  }

  /**
   * Xử lý sự kiện thay đổi kích thước màn hình với debounce
   */
  private handleResize(): void {
    // Skip if already destroyed
    if (this.isDestroyed) return

    // Xóa cache khi kích thước thay đổi
    this.cachedWidth = null
    this.cachedHeight = null

    // Debounce resize handler
    if (this.resizeTimer !== null) {
      window.clearTimeout(this.resizeTimer)
      this.resizeTimer = null
    }

    this.resizeTimer = window.setTimeout(() => {
      // Check if destroyed before proceeding
      if (!this.isDestroyed) {
        this.updateScaleRatio()
        this.notifyListeners()
      }
      this.resizeTimer = null
    }, 150) // Độ trễ 150ms để tránh tính toán quá nhiều
  }

  /**
   * Cập nhật tỷ lệ scale và áp dụng vào font-size
   */
  public updateScaleRatio(): ScaleResult {
    if (this.isDestroyed) return this.getScaleInfo()

    this.scaleRatio = this.calculateScaleRatio()
    this.applyFontScale()
    return this.getScaleInfo()
  }

  /**
   * Áp dụng font-scale vào HTML element
   */
  private applyFontScale(): void {
    if (this.isDestroyed) return

    const fontScalePercent = this.calculateFontScale()
    if (this.htmlElement) {
      this.htmlElement.style.fontSize = `${fontScalePercent}%`
    }
  }

  /**
   * Tính toán tỷ lệ scale
   */
  private calculateScaleRatio(): number {
    const { REFERENCE_WIDTH, REFERENCE_HEIGHT } = CONSTANTS
    const referenceRatio = REFERENCE_WIDTH / REFERENCE_HEIGHT
    const currentRatio = this.getRealWidth() / this.getRealHeight()

    return currentRatio < referenceRatio
      ? this.getRealWidth() / REFERENCE_WIDTH
      : this.getRealHeight() / REFERENCE_HEIGHT
  }

  /**
   * Tính toán giá trị font-scale theo phần trăm
   */
  private calculateFontScale(): number {
    const { REFERENCE_WIDTH, REFERENCE_HEIGHT, FONT_SCALE_MULTIPLIER } =
      CONSTANTS
    const referenceRatio = REFERENCE_WIDTH / REFERENCE_HEIGHT
    const currentRatio = this.getRealWidth() / this.getRealHeight()

    return currentRatio < referenceRatio
      ? (this.getRealWidth() * FONT_SCALE_MULTIPLIER) / REFERENCE_WIDTH
      : (this.getRealHeight() * FONT_SCALE_MULTIPLIER) / REFERENCE_HEIGHT
  }

  /**
   * Tính toán insets - khoảng cách từ safe frame đến các cạnh viewport
   */
  private calculateInsets(
    safeFrameWidth: number,
    safeFrameHeight: number
  ): SafeFrameInsets {
    const viewportWidth = this.getRealWidth()
    const viewportHeight = this.getRealHeight()

    // Calculate horizontal and vertical centering offsets
    const horizontalOffset = Math.max(0, (viewportWidth - safeFrameWidth) / 2)
    const verticalOffset = Math.max(0, (viewportHeight - safeFrameHeight) / 2)

    return {
      top: verticalOffset,
      bottom: verticalOffset,
      left: horizontalOffset,
      right: horizontalOffset,
    }
  }

  /**
   * Lấy thông tin về kích thước và tỷ lệ scale
   */
  public getScaleInfo(): ScaleResult {
    const referenceRatio =
      CONSTANTS.REFERENCE_WIDTH / CONSTANTS.REFERENCE_HEIGHT
    const currentRatio = this.getRealWidth() / this.getRealHeight()

    const safeFrameWidth =
      currentRatio < referenceRatio
        ? this.getRealWidth()
        : this.getRealHeight() * referenceRatio

    const safeFrameHeight =
      currentRatio < referenceRatio
        ? this.getRealWidth() / referenceRatio
        : this.getRealHeight()

    const insets = this.calculateInsets(safeFrameWidth, safeFrameHeight)

    return {
      width: safeFrameWidth,
      height: safeFrameHeight,
      scaleRatio: this.calculateFontScale(),
      insets,
    }
  }

  /**
   * Đăng ký callback khi có thay đổi kích thước
   * Trả về hàm để hủy đăng ký
   */
  public addResizeListener(callback: () => void): () => void {
    if (this.isDestroyed) {
      // Return a no-op if already destroyed
      return () => {}
    }

    // Ensure callback is a function
    if (typeof callback !== 'function') {
      console.warn('addResizeListener requires a function parameter')
      return () => {}
    }

    // Check for duplicate (extra safety)
    if (this.resizeListeners.has(callback)) {
      console.warn('Listener already registered, avoiding duplicate')
      return () => this.resizeListeners.delete(callback)
    }

    this.resizeListeners.add(callback)

    // Trả về hàm để hủy đăng ký
    return () => {
      this.resizeListeners.delete(callback)
    }
  }

  /**
   * Thông báo cho các listeners khi có thay đổi
   */
  private notifyListeners(): void {
    if (this.isDestroyed) return

    // Create a temporary array to allow for listeners to remove themselves during iteration
    const listeners = Array.from(this.resizeListeners)

    listeners.forEach(listener => {
      if (this.resizeListeners.has(listener)) {
        try {
          listener()
        } catch (error) {
          console.error('Error in resize listener:', error)
          // Remove problematic listeners to prevent further errors
          this.resizeListeners.delete(listener)
        }
      }
    })
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.isDestroyed) return

    // Mark as destroyed
    this.isDestroyed = true

    if (this.resizeTimer !== null) {
      window.clearTimeout(this.resizeTimer)
      this.resizeTimer = null
    }

    // Remove event listener with the exact same function reference
    window.removeEventListener('resize', this.boundHandleResize)

    this.resizeListeners.clear()
    this.cachedWidth = null
    this.cachedHeight = null
  }
}

// Singleton instance
const ScaleUtil = new ScaleUtility()

// Áp dụng font-scale ngay lập tức khi module được import
ScaleUtil.updateScaleRatio()

// Các hàm tiện ích giữ lại API cũ
export const getRealWidth = (): number => ScaleUtil.getRealWidth()
export const getRealHeight = (): number => ScaleUtil.getRealHeight()
export const scaleFont = (): ScaleResult => ScaleUtil.updateScaleRatio()

export const toPx = (size: number): number => {
  return size * ScaleUtil.scaleRatio
}

// Export instance
export { ScaleUtil }
