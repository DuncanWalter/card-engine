import * as React from 'react'

let syntaxes = [
  [/([^#]+)/, (data, text) => text],
  [/#{([^}#]*)}/, (data, sub) => data[sub]],
  [/#\[([^\]#]*)]/, (data, sub) => <b style={{ color: '#e5bbef' }}>{sub}</b>],
  [/#<([^>#]*)>/, (data, icon) => <ico class={`fa ${icon}`} />],
  // [/{\[(.*)]}/, data => keyword => <i>{keyword}</i>],
  // [/{(.+)#(.*)#}/, data => (color, text) => <p style={{color}}>{text}</p>],
]

let tokenizer = new RegExp(
  `(${syntaxes.map(([regex, __]) => regex.source).join('|')})`
)

export function interpolate<Data: { [string]: any }>(
  text: string,
  data: Data
): any {
  const res = []
  const tt = new RegExp(tokenizer, 'g')

  let match
  while ((match = tt.exec(text))) {
    let subs = syntaxes
      .filter((syntax) => syntax[0].exec(match[0]) != null)
      .map((syntax) => {
        let [$0, $1, $2] = syntax[0].exec(match[0])
        let ret = syntax[1](data, $1)
        return ret
      })
    // TODO: Why is this matching the safety string? This makes no sense
    // regex exec must only put the match index one after the last match or something
    res.push(subs[subs.length - 1])
  }
  return <span>{res}</span>
}

export function createInterpolationContext<Data: { [string]: any }>(
  expected: Data,
  resultant: Data,
  config: any
): any {
  return Object.keys(expected).reduce((acc, key) => {
    switch (true) {
      // TODO: use normal text color
      case expected[key] == resultant[key]: {
        acc[key] = <span style={{ color: '#ffffff' }}>{resultant[key]}</span>
        break
      }
      case expected[key] >= resultant[key]: {
        acc[key] = <span style={{ color: '#ff3333' }}>{resultant[key]}</span>
        break
      }
      case expected[key] <= resultant[key]: {
        acc[key] = <span style={{ color: '#78ff51' }}>{resultant[key]}</span>
        break
      }
    }
    return acc
  }, {})
}
