export const log = {
    green: (msg) => console.log('\x1b[32m%s\x1b[0m', msg),
    error: (msg) => console.error(msg),
    info: (msg) => console.log(msg)
  }
