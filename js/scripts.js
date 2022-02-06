import {Wheel} from './spin-wheel-esm.min.js';

const prop = {
    name: 'Workout',
    radius: 0.84,
    itemLabelRadius: 0.93,
    itemLabelRadiusMax: 0.35,
    itemLabelRotation: 180,
    itemLabelAlign: 'left',
    itemLabelColors: ['#fff'],
    itemLabelBaselineOffset: -0.07,
    lineColor: '#fff',
    isInteractive: false,
    itemBackgroundColors: ['#ffc93c', '#66bfbf', '#a2d5f2', '#515070', '#43658b', '#ed6663', '#d54062' ],
    image: './assets/img/example-0-image.svg',
    overlayImage: './assets/img/example-0-overlay.svg',
    rotationSpeedMax: 750,
}


$(document).ready( () => {
    
    // Navbar shrink function
    let navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) return;
        if (window.scrollY === 0) navbarCollapsible.classList.remove('navbar-shrink');
        else navbarCollapsible.classList.add('navbar-shrink');
    };
    
    // Shrink the navbar 
    navbarShrink();
    
    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);
    
    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(document.querySelectorAll('#navbarResponsive .nav-link'));
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
    const $itmLst = $("#liste-items");
    const $itmAdd = $("#item-add");
    const $mdlDom = $("#modal");
    const $mdlTxt = $("#modal #txt-modal-result");
    const $mdlCls = $("#modal #modal-close");
    const $btnWhl = $("#turn-wheel-btn");
    const $chgTpe = $('#list-type [data-role="switch-type"]');
    
    // Create wheel Object 
    const wheel = new Wheel(document.querySelector('.wheel-wrapper'));
    
    let data = {
        itmLst : $itmLst,
        itmAdd : $itmAdd,
        mdlDom : $mdlDom,
        mdlTxt : $mdlTxt,
        mdlCls : $mdlCls,
        wheel  : wheel,
    };
    
    switchType(type_displayed, data);

    init_wheel(data);

    $itmAdd.on("keydown", null, data, onitmAdd);
    $mdlCls.on('click', null, null, () => $mdlDom.modal('hide'));
    $btnWhl.on("click", null, null, () => data.wheel.spin(data.wheel.rotationSpeed + Math.random() * 50 + 230));

    $chgTpe.each((i,e) => $(e).on("click", null, null, () => switchType($(e).data("type"), data)));
});

function init_wheel(data) {
    const items = readItems(data.itmLst);
    data.wheel.init({
        ...prop,
        items: items,
        rotationSpeed: data.rotationSpeed ? data.rotationSpeed : data.wheel.rotationSpeed,
        rotation: data.wheel.rotation,    // Preserve value so it doesn't get reset.
        onRest: e => {
            data.mdlTxt.html(translations[type_displayed]["txt-modal-result"].replace("%value%", items[e.currentIndex].label));
            data.mdlDom.modal('show');
        },
    });
}   

function addItem(itemStr, data){
    // Create Dom for the new item
    let $itemDom = $('<div data-role="item" class="btn btn-item btn-outline-light mx-1 my-2" data-item="' + itemStr + '"></div>');
    let $removeIcon = $('<span class="ms-3" title="Cliquez ici pour supprimer l\'élément"><i class="fa fa-times" aria-hidden="true"></i></span>');
    data.itmLst.append($itemDom.append(itemStr, $removeIcon));
    // Event listener
    $removeIcon.on("click", null, data, onItemRemove);
}

function onitmAdd(e){
    const $itmAdd = e.data.itmAdd;
    const $itmLst = e.data.itmLst;

    if(e.key === 'Enter') {
        let new_item_str = $itmAdd.val();
        // Get all the items in cards
        let items_all = [];
        $itmLst.children().each((i,e) => items_all.push($(e).data("item").toLowerCase()));
        // Check if item already exist
        if (items_all.includes(new_item_str.toLowerCase())){
            alert("L'élément \"" + new_item_str + "\" est déjà présent dans la liste.");
        } else {
            addItem(new_item_str, e.data);
            init_wheel(e.data);
        } 
        $itmAdd.val("");
    }
}

function onItemRemove(e){
    $(this).closest("[data-role=\"item\"]").fadeOut(300, function() { 
        $(this).remove(); 
        init_wheel(e.data);
    });
}

function readItems($itmLst){
    return $itmLst.children().map(function(){return {"label": $(this).data('item')};}).get();
}


function switchType(type, data){
    type_displayed = type;

    // Update translations messages
    for (const [domId, message] of Object.entries(translations[type])) {
        $("#" + domId).html(message);
    }

    data.itmLst.empty();

    items_default[type].map(e => ({'label': e}))
        .sort(() => 0.5 - Math.random())
        .forEach(item => addItem(item.label, data));
    
    init_wheel(data);
}