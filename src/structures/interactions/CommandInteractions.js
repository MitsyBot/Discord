module.exports = class CommandInteractions {
  constructor(message, commandContext) {
    this.message = message
    this.ctx = commandContext
    this.component = []
  }
  components(...components) {
    const buttons = []

    for (let data of components) {
      buttons.push(data.data())
    }

    this.component.push({
      type: 1,
      components: buttons
    })
    return this
  }

  actionRow(...action) { }

  returnCtx() {
    return this.ctx
  }
}
