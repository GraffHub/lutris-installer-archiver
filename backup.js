const util = require('./util');

const repo = process.argv[2];


if (repo === undefined) {
  console.log("Please provide the destination directory as an argument");
} else {
  console.log("Saving files to:", repo);
  const basedir = `${repo}/games`;
  let write = util.writeFile(basedir);

  try {
    util.rmrf(basedir);

    util.crawl("https://lutris.net/api/games?format=json&page=1", game => {
      write([game.slug], game.slug, game);
    });

    util.crawl("https://lutris.net/api/installers?format=json&page=1", installer => {
      write([installer.game_slug, "installers"], installer.slug, installer);
    })
  } catch(err) {
    console.log("An unknown error occurred:", err);
  }
}
