# MCJS

[![Build Status](https://travis-ci.org/lukecfairchild/MCJS.svg?branch=master){:target="_blank"}](https://travis-ci.org/lukecfairchild/MCJS)

[![Visit our IRC channel](https://kiwiirc.com/buttons/irc.esper.net/MCJS.png){:target="_blank"}](https://kiwiirc.com/client/irc.esper.net/#MCJS)

[![GitHub](https://letsbuild.net/jenkins/static/72206d2f/plugin/github/logov3.png) GitHub](https://github.com/lukecfairchild/MCJS)

I created MCJS which is short for Minecraft Javascript to make it easier 
to code using bukkit/spigot's API. Since I am not a fan of java
MCJS is a simplified version of the bukkit/spigot api fully done
in javascript using it's native methods.

Here is a brief example of some of the things you can do with MCJS:

This example we are creating a simple command.
```javascript
mc.command( '/hello world', function ( event ) {
	
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
mc.on( 'player.PlayerJoinEvent', function ( event ) {

	var username = event.getPlayer().getName();

	mc.broadcast( 'Welcome ' + username + ' to the server!' );
}
```
