export const log = {
    green: (msg) => console.log('\x1b[32m%s\x1b[0m', msg),
    grey: (msg) => console.log('\x1b[32m%s\x1b[47m', msg),
    error: (msg, e) => console.error(msg, e),
    info: (msg) => console.log(msg)
  }
