var fs = require('fs')

function copy (src, dst) {
  fs.writeFileSync(dst, fs.readFileSync(src))
}

