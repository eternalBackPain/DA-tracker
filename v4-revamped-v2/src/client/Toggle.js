export function displayToggle() {
    var btn = document.querySelector(".btn-holder");
  
    btn.addEventListener("click", function () {
      var allNodes = btn.children;
  
      // find all children and check them for add class and change checkbox state
      for (var j = 0; j < allNodes.length; j++) {
        var node = allNodes[j];
        var isActive;
  
        // check for button circle and change its CSS class
        if (node.classList.contains("btn-circle")) {
          if (!node.classList.contains("active")) {
            node.classList.add("active");
            isActive = true;
          } else {
            node.classList.remove("active");
            isActive = false;
          }
        }
  
        // check for checkbox and change its state
        if (node.classList.contains("checkbox")) {
          node.checked = isActive;
        //   console.log(node.checked);
        }
      }
    });
  }