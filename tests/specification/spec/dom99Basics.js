describe("DOM99 basics", function() {
  var D = dom99;

  var fakeBody = document.createElement("div");
  fakeBody.innerHTML = '' +
    '<div id="div1" data-element="div1"></div>' +
    '<input data-element="input1" data-variable="string1">' +
    '<div data-element="div2" data-function="click-functionX"></div>';
    
  D.activate(fakeBody);
    

  it("this test suite uses querySelector", function() {
    expect(fakeBody.querySelector).toBeDefined();
  });
  
  it("data-element should be able to preselect an element", function() {
    expect(D.el.div1).toEqual(fakeBody.querySelector("#div1"));
  });  
  
  it("data-variable should be able to set D.vr.string1 and see the change in the dom", function() {
    var anythingText = "abwxyz \\ \" \' <html> <script>http // %20 blabla";
    D.vr.string1 = anythingText;
    expect(anythingText).toEqual(D.el.input1.value);
    //also fake input
  });
  
  it("data-variable should be able to see the change in D.vr.string1 if an user input event is fired", function() {
    var anythingText = "abwxyz \\ \" \' <html> <script>http // %20 blabla";
    

    // Create the fake event.
    D.el.input1.value = anythingText;
    var event = document.createEvent('Event');
    event.initEvent('input', true, true);
    D.el.input1.dispatchEvent(event);
    
    expect(anythingText).toEqual(D.vr.string1);
    
  });
  
  it("data-function should be able fire a function if the event occurs", function() {
    var a = 0;
    var functionX = function(event) {
        a = 10;
    }
    
    D.fx.functionX = functionX;
    
    // Create the fake event.
    var event = document.createEvent('Event');
    event.initEvent('click', true, true);
    D.el.div2.dispatchEvent(event);
    
    expect(a).toEqual(10);//functionX has been called
    
  });

});
