$("input:text").focus(function () { // select all the text on focus of the input field
    $(this).select();
});

$("#search").on("focus", function () { // when user focuses on the text input
    $("#search").attr("placeholder", "enter search term here"); // add placeholder text
    $("#searchBox").animate({ // animate the div to become wider
        width: "350px"
    }, 500);
    $("#search").animate({ // make the text input wider and maintain rounded edges
        width: "330px",
        borderRadius: "45px"
    }, 500, function () {
        $('#searchClose').css('opacity', '1');
    });
});

/* There is no submit button for the search input, so use keystroke to trigger search */
$("#search").keydown(function (event) {
    if (event.keyCode == 13) { // 13 is key code for the enter key

        $("#search").focus(); // refocus on the input field so that the user can quickly enter a new search term

        $(".result-card").animate({ // if any result cards are present, gracefully fade them out
            opacity: 0
        }, 200, function () {
            $(".result-card").remove(); // and then remove them from the DOM
        }
        );

        var searchTerm = $("#search").val(); // new variable from user input

        /* use wikipedia API to get JSON data based on user input */
        $.getJSON(
            `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrnamespace=0&gsrlimit=10&prop=extracts|info&inprop=url&exintro&exsentences=2&format=json&formatversion=2&origin=*`,
            function (json) {
                json.query.pages.sort(function (a, b) { // sort the data based on the index number supplied by JSON data
                    return a.index - b.index;
                });

                var id = 1; // create an id to supply to ids of the result card divs as they are created

                for (var i = 0; i < json.query.pages.length; i++) { // for each of the JSON objects isolate:
                    var title = json.query.pages[i].title; // the title of the page
                    var url = json.query.pages[i].canonicalurl; // the url of the page
                    var extract = json.query.pages[i].extract; // the text overview of the page

                    // create a new div element for each of the search results, using the variables from the JSON data
                    $("#main").append("<div id='card-" + id + "' class='result-card'><a href='" + url + "' target='_blank' rel='noopener noreferrer'><h1>" + title + "</h1>" + extract + "</div></a>");

                    id++; // update the id variable for the next card
                }

                // cards are created outside the viewport, and then need to be animated into it. Timeout is to ensure the animation occurs.
                setTimeout(function () {
                    $(".result-card").css("transform", "translateY(0)");
                }, 100);

            });
        return false;
    }
});

$("#searchClose").on("click", function () { // when user clicks cross to exit focus on the text input:
    $('#searchClose').css('opacity', '0');
    $("#search").attr("placeholder", ""); // remove placeholder text
    $("#search").val(''); // remove any value text present
    $("#searchBox").animate({ // animate the div to become narrower
        width: "90px"
    }, 500);
    $("#search").animate({ // make the text input narrower and maintain rounded edges
        width: "70px",
    }, 500);
});
