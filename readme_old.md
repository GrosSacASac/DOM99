#What I also tried (old readme)


##HTML : 

    `<tag onclick="jsFunc();" > bla bla </tag>`

When you debug your JavaScript, you want to look in your js files. This can make you lose time. To remove the eventListener later on you will have to use JavaScript anyway, so you might already start using DOM-0. The event object is not accessible here, so you are very limited anyway. You may have to use `this` to interact with event target. The good part is that you can assemble you graphical user interface like bricks by moving around and copying those html blocks.


##DOM-0 :

    <span id="clickme"> Water is life </span>
    <script>
        var element = document.getElementById('clickme');
        element.onclick = function(event) {
            ...
        };
    </script>
    
For every element in your page you are going to use heavy stuff , select and assign an event listener. What happens if you want to change your id for some reason, think about `<a href="#x2"></a>` that also use ids. Same for class name. These are html attributes that are used for other stuff (styling, linking) and therefore might be changed to satisfy these other uses better, thus breaking your code.


##DOM-2 :

    <p id="clickme">Drink more water it is good for your health</p>
    <script>
        var element = document.getElementById('clickme');
        element.addEventListener('click', function() {
            ...
        }, false);
    </script>
    
DOM-2 is already a lot better but still inherits problems from DOM-0. You are still using ids (or classes) to identify the element. Every time you want to add a dynamic element you have to reuse that heavy syntax.


Document Object Model (DOM) <--> dom99 <--> JavaScript Code