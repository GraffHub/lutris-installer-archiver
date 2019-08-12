# Lutris Installer Archiver

This is a simple nodejs program to crawl the lutris API and backup all the game metadata and installers. You can see an example of what it generates here: https://gitlab.com/smichel17/lutris-installer-archive

## Setup

```
npm install
```

## Running

Replace `<directory>` with the path to the output directory where you'd like the games folder to be placed. I've only tested using a relative path.

```
npm start -- <directory>
```

## TODO

Currently this is an inefficient implementation -- it completely removes the archive directory, then recreates everything from scratch. Incremental updates could be added later (although the main bottleneck at this point is the API rate limit, so this isn't super important).
