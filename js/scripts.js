//
// Scripts
// 

window.addEventListener('DOMContentLoaded', () => {
    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // // Activate Bootstrap scrollspy on the main nav element
    // const mainNav = document.body.querySelector('#mainNav');
    // if (mainNav) {
    //     new bootstrap.ScrollSpy(document.body, {
    //         target: '#mainNav',
    //         offset: 72,
    //     });
    // };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    /*******************************************/
    /*                  ITEMS                  */
    /*******************************************/
    const items_default = ["Pates", "Blé", "Riz", "Semoule"].sort(() => 0.5 - Math.random());;
    let isSubmitting = false;

    let addItem = function(itemStr){
        // Create Dom
        let itemDom = $('<div class="btn btn-item btn-outline-light mx-1 my-2" data-item="' + itemStr + '"></div>');
        let removeIcon = $('<span class="ms-3" title="Cliquez ici pour supprimer une valeur"><i class="fa fa-times" aria-hidden="true"></i></span>');
        $("#liste-items").append(itemDom.append(itemStr, removeIcon));
        // On Item remove
        removeIcon.on("click", null, null, () => itemDom.fadeOut(300, function() { $(this).remove(); }));
    }

    let randomIntFromInterval = function(min, max) { return Math.floor(Math.random() * (max - min + 1) + min)}

    items_default.forEach(addItem);

    $("#item-add").on("keydown", null, null, (e) => {
        if(e.key === 'Enter') {
            let new_item_str = $("#item-add").val();
            // Get all the items in cards
            let items_all = [];
            $("#liste-items").children().each((i,e) => items_all.push($(e).data("item").toLowerCase()));
            // Check if item already exist
            if (items_all.includes(new_item_str.toLowerCase())){
                alert("L'élément \"" + new_item_str + "\" est déjà présent dans la liste.")
            } else {
                addItem(new_item_str);
            } 
            $("#item-add").val("");
        }
    });

    $("#submitButton").on("submit click", function(){
        // Prevent multiple submission
        if (isSubmitting) return;
        isSubmitting = true;

        let childrenDom = $("#liste-items").children();
        let rand_position = randomIntFromInterval(0, childrenDom.length);

        childrenDom.each((i,e) => {$(e).css({background: "transparent"});})

        let computeDelay = x => 100 * Math.sin(((Math.min(x, 75)-55)/(22))-0.4)+150;
        
        let highlightDom = function(i, n, childrenDom){
            let $item = childrenDom.eq(i % childrenDom.length);
            if (i === n){
                $item.css({background: "rgb(26, 87, 132)"});
                isSubmitting = false;
                return;
            };

            $item.css({background: "rgb(26, 87, 132)"})
                .delay(computeDelay(i))
                .promise()
                .done(function(){
                    $item.css({background: "transparent"})
                        .delay(20)
                        .promise()
                        .done(function () {
                            highlightDom(i + 1, n, childrenDom);
                        });
                })
            ;
        }
        highlightDom(0, 80 + rand_position, childrenDom);
    });
});
