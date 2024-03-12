// TODO Look into RIOT API integration



console.log("hello");

const date = new Date()
getCurrentDateString = function(){
    return `${date.toLocaleDateString()}`
}

console.log(date.toLocaleDateString())

// Testing Fetch on api server
fetch("https://evan-tracker.fly.dev", {
    method: 'GET'
})
    .then(response => response.json())
    .then(value => console.log(value.body))
    .catch(error => console.log(error))
    .finally(() => {console.log("hi")});
//



// Fetching all of the previous comments from the JSON file, also showing all of the comments
let commentObjetcs = [];
fetch("https://evan-tracker.fly.dev/pullJSON")
    .then(response => {
        return response.json()})
    .then(values => {
        console.log(values)
        commentObjetcs = values})
    .catch(error => console.log(error))
    .finally(() => {
        console.log(commentObjetcs)
        showComments(commentObjetcs)
    });
//

// Showing the comments, basically just loops through each comment and adds the data 
showComments = function(commentObjetcs){
    commentObjetcs.forEach(response => {
        addTestimonial({
            "username": response.username, 
            "comment": response.comment,
            "rating": response.rating,
            "lane": response.lane,
            "team": response.team,
            "date": response.date});

    })
    updateAverageRating()
}


// This is the function for when we submit a new comment
document.getElementById("NewCommentSubmit").onclick = function(){
    var user = document.getElementById("IGN").value;
    const comment = document.getElementById("explination").value;
    const rating = document.getElementById("ratingStars").value;
    const lane = document.getElementById("lane").value;
    const team = document.getElementById("team").value;

    if(user == ""){
        user = "Anonymous"
    }

    let newObject = {
        "username": user,
        "comment": comment,
        "rating": Number(rating),
        "lane": lane,
        "team": team,
        "date": getCurrentDateString()
    }

    pushReply(newObject)

    addTestimonial(newObject);

    window.alert("Thanks for submitting a comment! :3")
    location.reload();
}

// This function will push a reply to the JSON file on the server's side
pushReply = function(o){
    commentObjetcs.push(o);


    fetch("https://evan-tracker.fly.dev/send", {
        method: 'POST',
        body: JSON.stringify(commentObjetcs),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          }
    })
        .finally();
}

// This function will add a testimonial one at a time, this is useful for when we want to sort them!
addTestimonial = function(o){
    let teamIcon;
    if(o.team == "Ally"){
        teamIcon = "blue_minion"
    } else{
        teamIcon = "red_minion"
    }

    currentString = document.getElementById("responses").innerHTML;
    currentString = currentString + `<div class="container"> <img src="images/${o.lane}.png" alt="Avatar" style="width:90px"> <p><span>${o.username} </span> <img id="teamImage" src=images/${teamIcon}.png> <span class="rating"> ${o.rating}/5</span></p> <p>${o.comment}</p> <p class=showingDate> ${o.date} </p></div>`
    document.getElementById("responses").innerHTML = currentString;
}


// If else tree to see what kind of sorting we need to do
sort = function(sortType){

    let sortedObjects;


    if(sortType == "lowHigh"){
        sortedObjects = commentObjetcs.sort(
            (p1, p2) => (p1.rating > p2.rating) ? 1: (p1.rating < p2.rating) ? -1 : 0)
    } else if (sortType == "highLow"){
        sortedObjects = commentObjetcs.sort(
            (p1, p2) => (p1.rating < p2.rating) ? 1: (p1.rating > p2.rating) ? -1 : 0)
    } else if(sortType == "dateRecent"){
        sortedObjects = commentObjetcs.sort(
            (p1, p2) => -sortDates(p1,p2)
        )
    } else if(sortType == "dateOld"){
        sortedObjects = commentObjetcs.sort(
            (p1, p2) => sortDates(p1, p2)
        )
    }

    return sortedObjects
}


//Helper function to sort dates specifically
sortDates = function(d1, d2){

    parts1 = d1.date.split("/");
    parts2 = d2.date.split("/");

    //Check year first
    if(Number(parts1[2]) > Number(parts2[2])){
        return 1;
    } else if(Number(parts1[2]) < Number(parts2[2])){
        return -1;
    } else{
        // Check the months
        if(Number(parts1[0]) > Number(parts2[0])){
            return 1;
        } else if(Number(parts1[0]) < Number(parts2[0])){
            return -1;
        } else{
            // check days
            if(Number(parts1[1]) > Number(parts2[1])){
                return 1;
            } else if(Number(parts1[1]) < Number(parts2[1])){
                return -1;
            } else return 0;
        }
    }


}




// Function for changing the order of the testimonials based on what the user chooses for the dropdown
document.getElementById("sorting").onchange = function(){

    sortedObjects = sort(document.getElementById("sorting").value)

    document.getElementById("responses").innerHTML = ""
    sortedObjects.forEach(response => addTestimonial(response))
}


// Here I will find the average rating from all of the comments so that we can update the front page
updateAverageRating = function(){
    findAverageRating();

    document.getElementById("averageRating").innerHTML = `Average Rating: ${(findAverageRating()/2).toFixed(2)}/5`
}

findAverageRating = function(){
    total = 0;
    commentObjetcs.forEach(comment => {
        total+= comment.rating
    })

    console.log(total/commentObjetcs.length)
    return (total/commentObjetcs.length)
}
