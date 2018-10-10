export const ESCAPE_KEY = 27
export const ENTER_KEY = 13

export function classNames(...args: any[]) {
  let classes = ''
  args.forEach( arg => {
    let argType = typeof arg

    if (argType === 'string' || argType === 'number') {
      classes += ' ' + arg
    } else if (Array.isArray(arg)) {
      classes += ' ' + classNames.apply(null, arg);
    } else if (argType === 'object') {
      for (let key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
          classes += ' ' + key
        }
      }
    }
  })
  return classes.trimLeft()
}

export function pluralize(count:number, word:string) {
  return count === 1 ? word : word + 's'
}