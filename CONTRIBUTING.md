- Please add the ability to call a re-guess if the guess was wrong

So start(), step(), win(), tryagain().
If the api returns a guess that is wrong, I would like to still continue with the current line of questioning, but have it try reguess a different person based on more questions.

At the moment to achive this effect, I have to step backwards then step forward with an opposite answer to one that the user just entered to hopefully sway the guess away from the incorrect one.
But this has alot of issues when the guess strength is very high. The api often just immediately guesses the same incorrect character again.
Or I within the same game, I have to restart the line of questioning which results in repeated questions later within a game.
