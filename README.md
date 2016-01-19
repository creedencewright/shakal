
<p align="center">
  <img align="center" src="https://raw.githubusercontent.com/creedencewright/shakal/master/assets/icon.png" />
</p>

# shakal
#### Friendly CLI task manager
```npm i -g shakal```
---

`shakal` compiles styles, optimizes images, generates SVG and PNG sprites.

The key feature is that `shakal` lives as a global module, making it possible to work with several projects.

Using the sprite bundler you get three files: sprite.png, sprite.svg and icons.less. To set an icon use generated mixin -- `.icon(@filename)`.

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

