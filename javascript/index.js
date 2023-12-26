let textAreaElement = document.getElementById("typing-area");

document.addEventListener("keypress", event =>{
    if (event.code === "Space"){
        console.log("HIT");
        textAreaElement.classList.add("translate-animate");
    }
});

textAreaElement.addEventListener('animationend', (animationEvent) => {
    textAreaElement.classList.remove("translate-animate");
    let typingAreaStyle = window.getComputedStyle(textAreaElement, null);

    if(animationEvent.animationName === "translate-area-up"){
        var topValue = typingAreaStyle.getPropertyValue("top").replace("px","");
        textAreaElement.style.top = (Number(topValue) - 53) + "px";
    }

});