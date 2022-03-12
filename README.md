# Obsidian Tree Edit

The plugin allows you to read the incoming markdown file by headers and their contents and display the entire header hierarchy in a tree structure from left to right. You can create, edit and delete headings.


## Launch for developers 
*** 

1. Clone this repository to the obsidian folder along the path `./obsidian/plugins/`. Note: `.obsidian` - hidden folder
2. Go to obsidian settings => options => community plugins. Turn off safe mode and add the plugin folder to the installed plugins section and activate it.
3. `npm i` or `yarn` to install dependencies
4. `npm run dev` to run in development mode or `npm run build` to start compilation in watch mode



## Bugs
***

- [ ] Saving inside a card breaks content (YAML splash, wiki links, tasks)
- [ ] Destroys content that is not under a heading
- [ ] Incorrect animation of active columns when scrolling up/down


## Road map
*** 

- [ ] Allow character # at the beginning of a line in editing mode if it is inside a block of code with back quotes
- [ ] Configure the correct display of multiline text
- [ ] Auto-correction of code blocks inside editing mode
- [ ] Add animation when adding/removing/clicking one/multiple columns at the same time
- [ ] Add add/merge/remove macros and their description to a separate block
- [ ] Save cards with Ctrl+Enter, not Shift+Enter