module.exports = class ColorResolver {
  /**
     * @param color {string}
     * @returns {string | Error}
     */
  static resolve (color) {
    if (typeof (color) !== 'string') throw new Error(`Tipo ${typeof color} não era esperado ao construir o embed`)
    color = color.toUpperCase()
    const defaultColors = {
      DEFAULT: 0xF895FB,
      ERROR: 0xFA704D,
      CONNECTED: 0x28D23B,
      RESUMED: 0x3D9958,
      RESTARTING: 0xFAFA29, 
      MINECRAFT: 0x7BE37B,
      TRANSACTION: 0x66ff66,
      MODERATION: 0xFF4A4A,
      ACTION: 0xC68AFF,
      SUGGESTION: 0x3D9958,
      BUG: 0xFF4A4A,
    }

    if (!color) color = null
    if (defaultColors[color]) {
      return defaultColors[color]
    }

    return parseInt(color.replace('#', ''), 16)
  }
}
