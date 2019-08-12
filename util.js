const fs = require('fs');
const request = require('request');

function writeFile(basedir) {
  return (path, filename, obj) => {
    try {
      const dir = path.reduce((p, d) => `${p}/${d}`, basedir);
      const file = `${dir}/${filename}.json`;
      const contents = JSON.stringify(obj, null, 2);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(file, contents)
    } catch(err) {
      console.log("Error writing file:", err);
    }
  }
}

function rmrf(path) {
  if(fs.existsSync(path)) {
    fs.readdirSync(path).forEach(file => {
      let curPath = `${path}/${file}`;
      if(fs.lstatSync(curPath).isDirectory()) {
        rmrf(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

async function crawl(uri, callback) {
  console.log("GET:", uri);
  request.get(uri, (error, response, body) => {
    if (error != null) {
      console.log("Error:", err);
      return;
    }
    const { next, results, detail } = JSON.parse(body);
    if (results != null) {
      results.forEach(result => callback(result));
    }
    if (detail != null) {
      const regex = /Request was throttled. Expected available in (\d+) seconds./;
      const found = detail.match(regex);
      if (found == null) {
        console.log("Error from api:", detail);
      } else {
        const lockout = parseInt(found[1], 10);
        if (Number.isNaN(lockout)) {
          console.log("Error parsing lockout, match is:", found);
        } else {
          console.log(`Waiting ${lockout+2} seconds to try again`);
          const delay = (lockout+2)*1000;
          setTimeout(crawl, delay, uri, callback);
        }
      }
    } else if (next != null) {
      crawl(next, callback);
    }
  });
}

exports.writeFile = writeFile;
exports.rmrf = rmrf;
exports.crawl = crawl;
