#Design decisions

After using DOM99 in my own projects I thought about the limitations and benefits. Thoughts about the next generation:

##For version 2.0

I once had a teacher who said: A program can be simple, efficient or polyvalent, and it is impossible to reach perfection in all 3 attributes. The simplest and most efficient program does nothing. The most efficient and polyvalent program is infinitely complex. Etc.

When DOM99 first started it was simple but had limited use cases. Later it became more useful and also more complex. As it grew I tried to keep the external API as clean as possible, by trading with internal complexity. Also, efficiency was traded for some usage assumptions. I can't say if it is  objectively better now than before. How can one know ? Trade-offs only.

So what is the ideal balance ? It all started with fast development in mind, I want to continue to work on the origins. So it needs to be simple, to not make us lose too much time. Also efficient, because if it isn't, I would need to switch to something else and lose time again relearning the whole thing. And it should do all the fundamentals that are DOM related. Looking up how the DOM APIs are working should be avoided. Because that slows down a lot.

To make this simple to get started with and efficient, sane defaults are going to be used with the possibility to explicitly remove assumptions for maximum performance benefits. The main idea here is to increase the internal complexity but also increase the potential performance optimizations from the outside, without increasing the complexity of the outside API too much by using sane default parameters in case nothing is provided. 

The declarative + imperative model will be kept since it gives a lot of flexibility to build a program flow on top of it.