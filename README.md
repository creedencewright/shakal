# ![alt text](https://raw.githubusercontent.com/creedencewright/shakal/master/assets/icon.png "shakal") shakal
#### Friendly CLI task manager
```npm i -g shakal```
---

`shakal` compiles styles, optimizes images and generates sprites. (`browserify` support is coming soon)

The key feature is that `shakal` lives as a global module, making it possible to work with several projects.

`shakal` also has lazy retina support. It means that when building a sprite `shakal` checks for each image if it has a @2x version (like `image-name@2x.png`). If it does -- `shakal` generates a media query inside .sprite() mixin that will switch to a @2x image on a high-dpi device.

When you run the manager it takes **active** projects and generates gulp tasks using the parameters you've specified during the adding.

####Command list####
- `add` - starts new project initialization in current directory
- `list` - shows a list of added projects
    - `--detail` - outputs a detail info for each project in a list
    - `--active` - only active projects
- `activate`, `deactivate`
- `remove`
- `config <projectName>` - starts project re-initialization. (Useful when you need to change some params)
- `update` - updates/installs dependencies. You may need this after `shakal` update.
- `run` - generates and runs gulp-tasks for active projects in the list
    - `--notify` - turns on system notifications for errors

