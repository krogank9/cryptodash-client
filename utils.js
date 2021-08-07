const Utils = {
    lerp(a, b, t) {
        return a + (b - a) * t
    },

    clamp(v, min, max) {
        return Math.max(Math.min(v, max), min)
    }
}

export default Utils