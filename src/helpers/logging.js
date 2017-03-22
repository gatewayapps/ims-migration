import clc from 'cli-colors'

export default {
  error,
  log,
  status,
  success
}

const errorText = clc.red.bold
const dateText = clc.blue
const successText = clc.green

export function error (...args) {
  const errorArgs = args.map((a) => errorText(a))
  console.log(errorText(new Date().toISOString()), ':', ...errorArgs)
}

export function log (...args) {
  console.log(...args)
}

export function status (...args) {
  console.log(dateText(new Date().toISOString()), ':', ...args)
}

export function success (...args) {
  const successArgs = args.map((a) => successText(a))
  console.log(successText(new Date().toISOString()), ':', ...successArgs)
}
