# ![alt text](https://raw.githubusercontent.com/creedencewright/shakal/master/assets/icon.png "shakal") shakal
#### Friendly CLI task manager
```npm i -g shakal```
---

`shakal` compiles styles, optimizes images and generates sprites. (`browserify` support is coming soon)

`shakal` also has lazy retina support. It means that when building a sprite `shakal` checks for each image if it has a @2x version (like `image-name@2x.png`). If it does -- `shakal` generates a media query inside .sprite() mixin. So, all you have to do is to put a @2x image in a folder. 


The key feature is that `shakal` lives as a global module, making it possible to work with several projects. 

To add a new one just type `shakal add` **inside** a project directory.

Type `shakal list` to see added projects.

You can `remove` or `deactivate` projects you don't need.

When you run the manager it takes **active** projects and generates gulp tasks using the parameters you've specified during the adding.
