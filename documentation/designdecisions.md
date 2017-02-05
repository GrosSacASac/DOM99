#Design decisions

After using DOM99 in my own projects I thought about the limitations and benefits. Thoughts about the next generation:

##For version 2.0

I once had a teacher who said: A program can be simple, efficient or polyvalent, and it is impossible to reach perfection in all 3 attributes. The simplest and most efficient program does nothing. The most efficient and polyvalent program is infinitely complex. Etc.

When DOM99 first started it was simple but had limited use cases. Later it became more useful and also more complex. As it grew I tried to keep the external API as clean as possible, by trading with internal complexity. Also, efficiency was traded for some usage assumptions. I can't say if it is  objectively better now than before. How can one know ? Trade-offs only.

So what is the ideal balance ? It all started with fast development in mind, I want to continue to work on the origins. So it needs to be simple, to not make us lose too much time. Also efficient, because if it isn't, I would need to switch to something else and lose time again relearning the whole thing. And it should do all the fundamentals that are DOM related. Looking up how the DOM APIs are working should be avoided. Because that slows down a lot.

To make this simple to get started with and efficient, sane defaults are going to be used with the possibility to explicitly remove assumptions for maximum performance benefits. The main idea here is to increase the internal complexity but also increase the potential performance optimizations from the outside, without increasing the complexity of the outside API too much by using sane default parameters in case nothing is provided. 

The declarative + imperative model will be kept since it gives a lot of flexibility to build a program flow on top of it.


Also some sort of boilerplate is going to be provided, for typical best case scenario. This I 'll do later, but probably will use redux + dom99 + webpack to make something opiniated to get started with quickly.


##Event listener design

Before callbacks were not attached directly but stored inside a dic. Instead the callback was alaways a generic handler that extends the event object with context and scope properties and then calls the user defined handler with that.

This was usefull for the following reasons. An event handler could be replaced at runtime with minimal cost. With the context accesible directly in the event object. The assumption here that event listener change often was wrong. The assumption that providing a context manually is complicated was also wrong. This was not possible to change, without changing the framework. Calling a function and adding properties to an object was a forced not 0 cost abstraction.

In the new model the event handler will be attached directly with no context provided. Switching the event handler will be more costly by calling remove event listener directly. This allows for a 0 cost abstraction layer however in all scenarios, while still letiing the possibility to add context and change the listener changing mechanism in user land.

In the new system all the benefit of the old system can still be reused in user code, but in case where it is not necessary, it will not cost anything.
