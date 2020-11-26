export function expand(body){
        let count = 1
        let returnMe = []
        for (let a in body) {
          let t = body[a]
          if (typeof t === 'number') {
            count = t
          } else {
            for (let b = 0; b < count; b++) {
              returnMe.push(t)
            }
          }
        }
        return returnMe
}