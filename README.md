# SIGTERM

This is the nucleus of a deck-building game based heavily on Megacrit's Slay the Spire. It's built with modern JS strategies. 


## Contribution Docs







## Tasks

### Content
* Make more cards- many idea are already listed in character files. 
* Make more pragmas- Also, I need to upload a list of pragmas to implement.
* Create ? style encounters for combat rewards
* Create system permission and restriction system
* Create more creatures
* Upload final boss idea and make it
* Make more creatures / encounters
* Upload the flavor texts/story stuff
* Figure out how I want to handle scoring modifiers

### Gameplay
* Redo the hand animations and interactions
* Make the main menu pretty
* Make tool-tips more flexible (and pretty)
* Add in game menu
* Implement save/load
* Implement profile w/ locked characters and character slots
* Implement chaos w/ random character

### Code
* Clean out old code artifact directly referencing StS.
* Clean out the current encounter and reward generation system. It's a hot mess.
* Opaque type identifiers behind non-dup functions (didn't know this was an option before)
* remove battleState from the state store- it just doesn't belong there. Use the serialize and lift features only for saving and loading the game. This also solves Entity store issues.
* Move files out of the game directory that dont belong there
* I'm considering a sample-enabled split tree implementation to make all the random/procedural stuff easier.
