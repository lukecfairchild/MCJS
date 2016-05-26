# MCJS

[![Visit our IRC channel](https://kiwiirc.com/buttons/irc.esper.net/MCJS.png)](https://kiwiirc.com/client/irc.esper.net/#MCJS)

I created MCJS which is short for Minecraft Javascript to make it easier 
to code using bukkit/spigot's API. Since I am not a fan of java
MCJS is a simplified version of the bukkit/spigot api fully done
in javascript using it's native methods.

Here is a brief example of some of the things you can do with MCJS:
```javascript
mc.command( '/hello world', function ( event ) {
	
	var player = event.getPlayer();

	player.sendMessage( 'Hello ' + player.getUsername() );
} );
```

In game do:
```
/hello world
```

```javascript
mc.on( 'player.PlayerJoinEvent', function ( event ) {

	var username = event.getPlayer().getDisplayName();

	mc.broadcast( 'Welcome ' + username + ' to the server!' );
}
```
