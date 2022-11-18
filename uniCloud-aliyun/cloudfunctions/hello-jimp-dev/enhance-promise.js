'use strict';

const _p = Promise.prototype

/**
 * add a logging interceptor to promise.
 *  logging interceptor will-not and cannot change return-value / exception.
 *  while common interceptors could / would.
 * 
 */
_p.log = function (rstLogger = console.log, errLogger) {
  if (typeof (rstLogger) == 'string')
    return this.log((...args) => console.log(rstLogger, ...args))

  let ret = this.then(rst => {
    try {
      rstLogger(rst)
    } finally {
      return rst
    }
  })

  if (errLogger)
    ret = ret.catch(e => {
      try {
        errLogger(e)
      } finally {
        throw e
      }
    })

  return ret
}

_p.elog = function (errLogger = console.error) {
  return this.catch(e => {
    try {
      errLogger(e)
    } finally {
      throw e
    }
  })
}

_p.log2 = function (name) {
  return this
    .log(resp => console.log(`Succeed-[${name}]:`, resp))
    .elog(err => console.error(`Fail-[${name}]:`, err))
}

_p.log3 = function (name) {
  return this
    .log(resp => console.log(`Succeed-[${name}]:`))
    .elog(err => console.error(`Fail-[${name}]:`))
}

_p.makeSafe = function () {
  return this.then(
    ret => ret,
    err => {
      console.log(``, err)
      return {}
    }
  )
}
