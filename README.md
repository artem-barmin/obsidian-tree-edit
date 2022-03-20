# Obsidian Tree Edit

The plugin allows you to read the incoming markdown file by headers and their contents and display the entire header hierarchy in a tree structure from left to right. You can create, edit and delete headings.

# Project/Issues

Roadmap: https://github.com/users/artem-barmin/projects/1

# Demo



# How to install




# How to use

You can open the Tree Edit preview for the current note with a command.

![preview-command](images/tree-edit-preview-command.jpg)

Click a card in the Edit Tree preview to change its content or add a new card.

## Plugin options

Tree Edit has a horizontal or vertical preview window setting:

![plugin-options](images/tree-edit-plugin-options.jpg)




# Features

* All headings and their contents are displayed as cards in a tree structure from left to right
* File without headings is displayed as as a single active card
* You can change the card's content (except the heading type) or cancel the changes made using the Esc key
* You can add a new card above or below the current one (it will be the same level as the current one) and add a card to the right (it will be one level lower than the current one)
* You can delete the whole chain of cards


# Info for developer 

1. Clone this repository to the obsidian folder along the path `./obsidian/plugins/`. Note: `.obsidian` - hidden folder
2. Go to obsidian settings => options => community plugins. Turn off safe mode and add the plugin folder to the installed plugins section and activate it.
3. `npm i` or `yarn` t  o install dependencies
4. `npm run dev` to run in development mode or `npm run build` to start compilation in watch mode



# Bugs

- [ ] Saving insi de a card breaks content (YAML splash, wiki links, tasks)
- [ ] Destroys content that is not under a heading
- [ ] Incorrect animation of active columns when scrolling up/down



# Road map

- [ ] Allow character # at the beginning of a line in editing mode if it is inside a block of code with back quotes
- [ ] Configure the correct display of multiline text
- [ ] Add the correct display of cards if the file starts with a header of type 2 and higher
- [ ] Auto-correction of code blocks inside editing mode
- [ ] Add animation when adding/removing/clicking one/multiple columns at the same time
- [ ] Add add/merge/remove macros and their description to a separate block
- [ ] Save cards with Ctrl+Enter, not Shift+Enter



# Team


* [Artem Barmin](https://github.com/artem-barmin/)
* [Vladislav Onatskyi](https://github.com/kravich13/)
