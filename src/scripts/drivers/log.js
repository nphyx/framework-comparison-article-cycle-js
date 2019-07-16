/**
 * A simple log driver that uncritically dumps messages to the console.
 */
export function makeLogDriver() {
  return (msg$) => msg$.addListener({next: msg => console.log(msg)})
}
