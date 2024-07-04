<h1 align="center">Basic Tilemap Editor</h1>

---

<h3 align="center">
  <a href="#orange_book-tutorial">Tutorial</a>&nbsp;
  <a href="#information_source-about">About</a>&nbsp;
  <a href="#rocket-technologies-used">Technologies</a>&nbsp;
  <a href="#warning-issues">Issues</a>&nbsp;
  <a href="#hammer_and_wrench-how-to-contribute">Contribute</a>&nbsp;
</h3>

---

## :orange_book: Tutorial

[Demo](https://onemandev-io.github.io/tilemap-editor)

I made a **Basic Tilemap Editor** using Vanilla **Javascript** which allows you to draw tilemaps using several tools, like for example: the **Brush Tool | B**, **Eraser Tool | E**, **Bucket Fill Tool | G**, **Eye Dropper Tool | I**, etc.

**Hit (I)** to switch into **Eye Dropper** mode to pick tile from the **Editor Canvas**

<p align="center">
  <img src="https://lh3.googleusercontent.com/pw/AP1GczOytU-kf08zRglchEcmU7xywwdFL1bmXVZiz9OTHde5BGp1zsIoIe82BZkMobvb4sCOaTSvoc7mLcq0oor1QZTSb9_vD3gMX2b2ZG16Bclo1q28Y7O4RgQnpbo4gBZvT-iDK9IiCr5FFLJf7bMLV7Kt=w711-h474-s-no-gm?authuser=0" alt="Demo IMG 1"/>
</p>

You can remove tiles using the **Eraser (E)**

<p align="center">
  <img src="" alt="Demo IMG 2"/>
</p>

Change the layer:

<p align="center">
  <img src="" alt="Demo IMG 4"/>
</p>

Prevent mistakes by blocking the layer:

<p align="center">
  <img src="" alt="Demo IMG 5"/>
</p>

Hold (**CTRL+Z**) to Undo actions:

<p align="center">
  <img src="" alt="Demo IMG 6"/>
</p>

Export the image and clear the entire drawing:

<p align="center">
  <img src="" alt="Demo IMG 7"/>
</p>

## :information_source: About

I made this because I needed a basic tool to edit tilemaps for my basic JavaScript based games.

## :rocket: Technologies Used

This project was created with minimal tech like HTML Canvas and TailwindCSS with some plugins for the visuals.

## :warning: Issues

- **Bug:** Currently the Bucket Fill Tool only works in there's aready painted areas.

- **Feature:** I'm going to add a feature that'll let the user paint with randomly generated tiles from the selection.

## :hammer_and_wrench: How to Contribute

You are welcome to add new features or work on existing issues:

1. Fork this repostory

2. Clone your forked repo
   ```bash
   # Clone this repo and open on your local device
   git clone https://github.com/your-username/tilemap-editor && cd tilemap-editor
   ```

- Create a branch with your changes

  ```bash
  # Create and switch to a new branch
  git checkout -b branch-name
  ```

- Make the commit with your changes

  ```bash
  # Add commit message
  git commit -m 'feat: added shortcuts for the tools'
  ```

- Push your branch

  ```bash
  # Send the code to your remote branch
  git push origin my-changes
  ```

- Create a _Pull Request_ & I'll review them as soon as possible.

Thanks.
