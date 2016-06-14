# MCJS

[![Build Status](https://travis-ci.org/lukecfairchild/MCJS.svg?branch=master)](https://travis-ci.org/lukecfairchild/MCJS)
[![Visit our IRC channel](https://kiwiirc.com/buttons/irc.esper.net/MCJS.png)](https://kiwiirc.com/client/irc.esper.net/#MCJS)
[![Documentation](http://i.imgur.com/ITAGk6P.png)](https://letsbuild.net/mcjs/index.html)
[![Trello](http://i.imgur.com/STUcSnp.png)](https://trello.com/b/1wgOwyfv/mcjs)

I created MCJS which is short for Minecraft Javascript to make it easier 
to code using bukkit/spigot's API. Since I am not a fan of java
MCJS is a simplified version of the bukkit/spigot api fully done
in javascript using it's native methods.

Here is a brief example of some of the things you can do with MCJS:

This example we are creating a simple command.
```javascript
MC.command( '/hello world', function ( event ) {
	
	var player = event.getPlayer();

	player.sendMessage( 'Hello ' + player.getName() );
} );
```

In game do:
```
/hello world
```

This example will Welcome any player that joins the server:
```javascript
MC.on( 'player.PlayerJoinEvent', function ( event ) {

	var username = event.getPlayer().getName();

	MC.broadcast( 'Welcome ' + username + ' to the server!' );
}
```
