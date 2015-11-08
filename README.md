# shakal
#### Friendly CLI task manager
#####```npm i -g shakal```
---

Shakal compiles styles, optimizes PNGs and generates sprites. (`browserify` support is coming soon)


The key feature is that `shakal` lives as a global module, making it possible to work with several projects. 

To add a new one just type `shakal add` **inside** a project directory.

Type `shakal list` to see added projects.

You can `remove` or `deactivate` projects you don't need.

When you run the manager it takes **active** projects and generates gulp tasks using the parameters you've specified during the adding.
