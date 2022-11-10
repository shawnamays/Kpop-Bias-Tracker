// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash-o");

let kpopGroups = document.getElementsByClassName("groupName")
let kpopArtist = document.getElementsByClassName("name")


Array.from(kpopGroups).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const groupName = this.parentNode.parentNode.childNodes[3].innerText

        

        // FETCH REQUEST IS HERE ------------------------
        fetch('kpopGroups', {
    
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
           
            
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          //reloading the page 
          window.location.reload(true)
        })
      });
});


Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.childNodes[1].innerText.trim()
    
    fetch('kpopGroups', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
       name
        
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});