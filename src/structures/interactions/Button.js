module.exports = class Button {
	constructor() {
		this.emoji = null
		this.label = null
		this.style = 0
		this.disabled = false
		this.url = ''
		this.id = null
	}

	setEmoji(emoji) {
		this.emoji = null
		return this
	}

	setLabel(label) {
		this.label = label
		return this
	}

	customID(id) {
		this.id = id
		return this
	}

	setURL(url) {
		this.url = url
		return this
	}

	setStatus(status) {
		this.disabled = status
		return this
	}

	/**
     * 
     * @param {*} id 
     * @returns 
     */
	setStyle(id) {
		this.style = id
		return this
	}

	build() {
		return this
	}

	data() {
		let a = {}
		a.type = 2
		if (typeof this.emoji === 'string') {
			a.emoji = this.emoji
		}

		if (typeof this.id === 'string') {
			a.custom_id = this.id
		}

		if (typeof this.label === 'string') {
			a.label = this.label
		}

		if (typeof this.style === 'number') {
			a.style = this.style
		}

		if (typeof this.disabled === 'boolean') {
			a.disabled = this.disabled
		}

		if (typeof this.url === 'string') {
			a.url = this.url
		}

		return a
	}
}
