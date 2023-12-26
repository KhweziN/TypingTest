let textAreaElement = document.getElementById("typing-area");

document.addEventListener("keypress", event =>{
    if (event.code === "Space"){
        console.log("HIT");
        textAreaElement.classList.add("translate-animate");

        // textAreaElement.animate(
        //     //keyframes
        //     [
        //         {transform: "translateY(0px)"},
        //         {transform: "translateY(-53px)"}
        //     ],

        //     //timing options
        //     {
        //         duration: 0.5,
        //         fill: "forwards",
        //         iterations: 1
        //     }
        // );
        // document.addEventListener("finish", () => {
        //     textAreaElement.classList.remove("translate-animate");
        // });
    }
});

textAreaElement.addEventListener('animationend', () => {
    textAreaElement.classList.remove("translate-animate");
    var typingAreaStyle = window.getComputedStyle(textAreaElement, null);
    var topValue = typingAreaStyle.getPropertyValue("top").replace("px","");
    textAreaElement.style.top = (Number(topValue) - 53) + "px";
    console.log((Number(topValue) - 5) + "px");
});