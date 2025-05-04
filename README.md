# Bouncy Garden Fox

## Description

Bouncy Garden Fox is a mini-game under the HortusFox umbrella. It is made to draw attention to the HortusFox webapp.
The game is a jump & run action game where you play a little fox that has to survive as long as possible. Defeat all approaching
enemies and collect points. Various special items can spawn during a gameplay session in order to boost your run. There is no
real goal in the game, just endure as much as possible during a match to climb at the top of the highscore. There is an all-time
highscore and a weekly highscore. Also it can be filtered by device (mobile or desktop) if desired.

## Features
- Multiple enemies
- Various items
- Cute nature theme
- Highscores
- Platform independent
- Build & package command

## Run locally

In order to run the game locally during development process, issue one of the following commands.

Use Asatru CLI to run development server
```sh
php asatru serve
```

Use AquaShell to run development server
```sh
aquashell launch.dnys
```

## Make a shippable game build

Make a release build
```sh
php asatru game:release [platform]
```

Make a debug build
```sh
php asatru game:debug [platform]
```

`platform` can be one of the following:
- windows
- linux
- macos
- html5 (default)

The ready-packaged game builds are stored in the `/public/builds` directory
