/**
 * \file darwin.js Wednus Darwin module
 *
 * This file loads a series of Wednus Darwin member classes; Oracle, World, and Creature.
 * @author Sundew H. Shin
 */

/**
 * open module namespace
 * @test <a href='../../test/darwin.html'>base setup</a>
 */
W.darwin = {
  version: '0.1.0',
  oracles: []
};


//!\cond    startup_batch
W.load('module/darwin', 'Oracle,World,Skill,Creature,instructions', 'module');
//!\endcond

/**
\mainpage
\section version Version
0.1.1
\section author Author
Sundew H. Shin - <a href='http://wednus.com'>Wednus Project</a>
<hr>
\section intro  Introduction
Wednus Darwin is the set of implementations of the Darwinian evolution workspace
components; time, place, and creatures.
Wednus Darwin is a method kit loads up followings classes and class extensions:
- <b>W.Oracle class</b> - The Oracle introduces the concept of time to the objects with
the receptor method.: .tick()
- <b>W.World class</b> - The World provides a creatures' workspace where they
interact each other.
- <b>W.Skill class</b> - The Skill defines a prototype of an animation action of Creature
- <b>W.Creature class</b> - The Creature defines a prototype of common creature
residing in a world.
- <b>instructions.js</b> - It contains the set of instructions defines the behavior
of the Creature reacting given stimuli. (e.g. meet other creature)

<hr>
\section diagram Architecture
\image html darwin.jpg
<hr>
\section req Requirement
- <a href='http://sourceforge.net/projects/wplat'>Wednus Platform</a> (v0.1.0_pre14 or above) - the compact version included in the package

<hr>
\section usage Usage
\code
<head> .....
<script type='text/javascript' src='wednus.js'></script>
<script type='text/javascript'>
W.module('darwin');
</script>
..... </head>
\endcode

<hr>
\section demo Demos
- Open the sample folder, '<a href='../../test/'>wednus_darwin/module/darwin/test</a>', for faster demo browsing.
- <a href='http://wednus.com/wednus_rpg/applications/wayHome/'>'Haru Ki', the first graphic DRPG</a>
*/