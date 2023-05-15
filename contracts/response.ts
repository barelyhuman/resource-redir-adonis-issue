declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    flash(messages: any): this
  }
}
